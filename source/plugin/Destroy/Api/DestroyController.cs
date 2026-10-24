using System.IO.Compression;
using System.Net.Mime;
using System.Reflection;
using Jellyfin.Plugin.Destroy.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jellyfin.Plugin.Destroy.Api;

[ApiController]
[Route("Destroy")]
public class DestroyController : ControllerBase
{
    private static byte[]? Load(string name)
    {
        using Stream? s = Assembly.GetExecutingAssembly().GetManifestResourceStream("Jellyfin.Plugin.Destroy.Web." + name);
        if (s is null)
        {
            return null;
        }

        using var ms = new MemoryStream();
        s.CopyTo(ms);
        return ms.ToArray();
    }

    private static readonly Lazy<byte[]?> Script = new(() => Load("script.js"));
    private static readonly Lazy<byte[]?> SheetPng = new(() => Load("sheet.png"));
    private static readonly Lazy<byte[]?> SheetJson = new(() => Load("sheet.json"));

    [HttpGet("script.js")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult GetScript()
    {
        byte[]? b = Script.Value;
        if (b is null)
        {
            return NotFound();
        }

        string etag = "\"" + Plugin.ScriptVersionHash + "\"";
        Response.Headers.ETag = etag;
        Response.Headers["Cache-Control"] = "no-cache";
        if (Request.Headers.IfNoneMatch.ToString() == etag)
        {
            return StatusCode(StatusCodes.Status304NotModified);
        }

        return File(b, "application/javascript; charset=utf-8");
    }

    private static readonly object QuotesLock = new();
    private static ZipArchive? _quotes;

    private static ZipArchive? QuotesArchive()
    {
        if (_quotes is not null)
        {
            return _quotes;
        }

        try
        {
            string? dir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            string path = Path.Combine(dir ?? string.Empty, "quotes.zip");
            _quotes = System.IO.File.Exists(path) ? ZipFile.OpenRead(path) : null;
        }
        catch (IOException)
        {
            _quotes = null;
        }
        catch (InvalidDataException)
        {
            _quotes = null;
        }

        return _quotes;
    }

    [HttpGet("quotes/packed/{name}")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult GetQuotes([FromRoute] string name)
    {
        if (!System.Text.RegularExpressions.Regex.IsMatch(name, "^[a-z0-9]{1,24}\\.json\\.gz$"))
        {
            return NotFound();
        }

        byte[] bytes;
        string etag;
        lock (QuotesLock)
        {
            ZipArchiveEntry? entry = QuotesArchive()?.GetEntry(name);
            if (entry is null)
            {
                return NotFound();
            }

            etag = "\"" + entry.Crc32.ToString("x8", System.Globalization.CultureInfo.InvariantCulture) + "\"";
            if (Request.Headers.IfNoneMatch.ToString() == etag)
            {
                Response.Headers.ETag = etag;
                return StatusCode(StatusCodes.Status304NotModified);
            }

            using Stream s = entry.Open();
            using var ms = new MemoryStream();
            s.CopyTo(ms);
            bytes = ms.ToArray();
        }

        Response.Headers.ETag = etag;
        Response.Headers["Cache-Control"] = "no-cache";
        return File(bytes, "application/gzip");
    }

    private const long DiagCap = 50L * 1024 * 1024;
    private static readonly object DiagLock = new();

    public class DiagBatch
    {
        public string? Sid { get; set; }

        public System.Text.Json.JsonElement[]? Lines { get; set; }
    }

    [HttpPost("Diagnostics")]
    [Authorize]
    [RequestSizeLimit(4 * 1024 * 1024)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult PostDiagnostics([FromBody] DiagBatch batch)
    {
        Plugin? plugin = Plugin.Instance;
        if (plugin is null || !plugin.Configuration.RecordDiagnostics)
        {
            return NoContent();
        }

        string sid = batch?.Sid ?? string.Empty;
        if (!System.Text.RegularExpressions.Regex.IsMatch(sid, "^[a-z0-9]{6,24}$") || batch?.Lines is null)
        {
            return BadRequest();
        }

        string user = User.Identity?.Name ?? string.Empty;
        lock (DiagLock)
        {
            string day = Path.Combine(plugin.DiagnosticsPath, DateTime.Now.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture));
            Directory.CreateDirectory(day);
            var sb = new System.Text.StringBuilder();
            int snap = Directory.GetFiles(day, sid + "-*.jpg").Length;
            foreach (System.Text.Json.JsonElement line in batch.Lines)
            {
                if (line.ValueKind == System.Text.Json.JsonValueKind.Object && line.TryGetProperty("cat", out var cat) && cat.GetString() == "snap"
                    && line.TryGetProperty("data", out var data) && data.ValueKind == System.Text.Json.JsonValueKind.Object
                    && data.TryGetProperty("img", out var img) && snap < 12)
                {
                    string url = img.GetString() ?? string.Empty;
                    int comma = url.IndexOf(',', StringComparison.Ordinal);
                    if (url.StartsWith("data:image/jpeg;base64,", StringComparison.Ordinal) && comma > 0)
                    {
                        string name = sid + "-" + (++snap).ToString(System.Globalization.CultureInfo.InvariantCulture) + ".jpg";
                        try { System.IO.File.WriteAllBytes(Path.Combine(day, name), Convert.FromBase64String(url[(comma + 1)..])); } catch (FormatException) { name = "bad"; }
                        line.TryGetProperty("ev", out var ev);
                        sb.Append("{\"cat\":\"snap\",\"ev\":").Append(System.Text.Json.JsonSerializer.Serialize(ev.ToString())).Append(",\"file\":\"").Append(name).Append("\"}\n");
                        continue;
                    }
                }

                sb.Append(line.GetRawText()).Append('\n');
            }

            string file = Path.Combine(day, sid + ".jsonl");
            if (!System.IO.File.Exists(file))
            {
                sb.Insert(0, "{\"cat\":\"server\",\"ev\":\"user\",\"data\":{\"user\":" + System.Text.Json.JsonSerializer.Serialize(user) + "}}\n");
            }

            System.IO.File.AppendAllText(file, sb.ToString());
            TrimDiagnostics(plugin.DiagnosticsPath, day);
        }

        return NoContent();
    }

    private static void TrimDiagnostics(string root, string today)
    {
        try
        {
            var days = new DirectoryInfo(root).GetDirectories().OrderBy(d => d.Name).ToList();
            long total = days.Sum(d => d.GetFiles().Sum(f => f.Length));
            foreach (DirectoryInfo d in days)
            {
                if (total <= DiagCap || string.Equals(d.FullName, today, StringComparison.OrdinalIgnoreCase))
                {
                    break;
                }

                total -= d.GetFiles().Sum(f => f.Length);
                d.Delete(true);
            }
        }
        catch (IOException)
        {
        }
    }

    [HttpGet("ClientConfiguration")]
    [Authorize]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<PluginConfiguration> GetClientConfiguration()
    {
        PluginConfiguration? configuration = Plugin.Instance?.Configuration;
        if (configuration is null)
        {
            return NotFound();
        }

        Response.Headers["Cache-Control"] = "no-store";
        return configuration;
    }

    [HttpGet("heroes/sheet.png")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult GetSheetPng()
    {
        byte[]? b = SheetPng.Value;
        Response.Headers["Cache-Control"] = "private, max-age=86400";
        return b is null ? NotFound() : File(b, "image/png");
    }

    [HttpGet("heroes/sheet.json")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult GetSheetJson()
    {
        byte[]? b = SheetJson.Value;
        Response.Headers["Cache-Control"] = "private, max-age=86400";
        return b is null ? NotFound() : File(b, MediaTypeNames.Application.Json);
    }
}
