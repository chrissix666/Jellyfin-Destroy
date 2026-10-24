using System.Reflection;
using System.Runtime.Loader;
using System.Text.RegularExpressions;
using Jellyfin.Plugin.Destroy.Configuration;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Plugins;
using MediaBrowser.Model.Serialization;
using Microsoft.Extensions.Logging;

namespace Jellyfin.Plugin.Destroy;

public class Plugin : BasePlugin<PluginConfiguration>, IHasWebPages
{
    public static readonly Guid PluginGuid = new("9332385a-9eeb-4410-a224-b699c4e3098b");

    private static readonly object IndexHtmlLock = new();

    private static readonly Regex InjectedTagRegex = new(
        "<script defer src=\"\\.\\./Destroy/script\\.js[^\"]*\"></script>",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private readonly ILogger<Plugin> _logger;
    private readonly IApplicationPaths _applicationPaths;

    public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer, ILogger<Plugin> logger)
        : base(applicationPaths, xmlSerializer)
    {
        _logger = logger;
        _applicationPaths = applicationPaths;
        Instance = this;
        IndexHtmlTransform.Logger = logger;
        _ = RegisterWithRetriesAsync();
    }

    internal string DiagnosticsPath => Path.Combine(_applicationPaths.DataPath, "destroy-diagnostics");

    public static Plugin? Instance { get; private set; }

    public override string Name => "Destroy";

    public override Guid Id => PluginGuid;

    public override string ConfigurationFileName => "Jellyfin.Plugin.Destroy.xml";

    public override string Description => "Run, jump and shoot your way through the Jellyfin page you are looking at.";

    internal static string ScriptTag => "<script defer src=\"../Destroy/script.js?v=" + ScriptHash.Value + "\"></script>";

    internal static string ScriptVersionHash => ScriptHash.Value;

    private static readonly Lazy<string> ScriptHash = new(() =>
    {
        using Stream? s = typeof(Plugin).Assembly.GetManifestResourceStream("Jellyfin.Plugin.Destroy.Web.script.js");
        if (s is null)
        {
            return typeof(Plugin).Assembly.GetName().Version?.ToString() ?? "0";
        }

        byte[] hash = System.Security.Cryptography.SHA256.HashData(s);
        return Convert.ToHexString(hash, 0, 6).ToLowerInvariant();
    });

    internal static string StripTags(string html) => InjectedTagRegex.Replace(html, string.Empty);

    public IEnumerable<PluginPageInfo> GetPages()
    {
        yield return new PluginPageInfo
        {
            Name = Name,
            EmbeddedResourcePath = GetType().Namespace + ".Configuration.configPage.html",
        };
    }

    public override void OnUninstalling()
    {
        RemoveTagFromDisk("uninstall");
        base.OnUninstalling();
    }

    private void RemoveTagFromDisk(string reason, bool usesFileTransformation = false)
    {
        try
        {
            string indexPath = Path.Combine(_applicationPaths.WebPath, "index.html");
            if (!File.Exists(indexPath))
            {
                return;
            }

            lock (IndexHtmlLock)
            {
                string html = File.ReadAllText(indexPath);
                string cleaned = StripTags(html);
                if (!string.Equals(cleaned, html, StringComparison.Ordinal))
                {
                    File.WriteAllText(indexPath, cleaned);
                    _logger.LogInformation("Destroy: script tag removed from index.html ({Reason}).", reason);
                }
            }
        }
        catch (Exception ex) when (usesFileTransformation && (ex is UnauthorizedAccessException or IOException))
        {
            _logger.LogInformation("Destroy: the old tag could not be removed from index.html ({Reason}): {Message}", reason, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Destroy: removing the script tag from index.html failed ({Reason}).", reason);
        }
    }

    private async Task RegisterWithRetriesAsync()
    {
        for (int attempt = 1; attempt <= 5; attempt++)
        {
            if (TryRegisterWithFileTransformation())
            {
                return;
            }

            if (attempt < 5)
            {
                await Task.Delay(3000).ConfigureAwait(false);
            }
        }

        _logger.LogInformation("Destroy: 'File Transformation' not found - writing the script tag into index.html instead.");
        TryDirectIndexHtmlInjection();
    }

    private bool TryRegisterWithFileTransformation()
    {
        try
        {
            Assembly? ft = AssemblyLoadContext.All
                .SelectMany(ctx => ctx.Assemblies)
                .FirstOrDefault(a => a.FullName?.Contains(".FileTransformation", StringComparison.OrdinalIgnoreCase) ?? false);
            MethodInfo? register = ft?.GetType("Jellyfin.Plugin.FileTransformation.PluginInterface")?.GetMethod("RegisterTransformation");
            if (register is null)
            {
                return false;
            }

            var payload = Newtonsoft.Json.Linq.JObject.FromObject(new
            {
                id = PluginGuid,
                fileNamePattern = "index.html",
                callbackAssembly = typeof(Plugin).Assembly.FullName,
                callbackClass = typeof(IndexHtmlTransform).FullName,
                callbackMethod = nameof(IndexHtmlTransform.Transform),
            });
            register.Invoke(null, new object?[] { payload });
            _logger.LogInformation("Destroy: registered with 'File Transformation'.");
            RemoveTagFromDisk("'File Transformation' is used now", usesFileTransformation: true);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "Destroy: registering with 'File Transformation' failed.");
            return false;
        }
    }

    private void TryDirectIndexHtmlInjection()
    {
        try
        {
            string indexPath = Path.Combine(_applicationPaths.WebPath, "index.html");
            if (!File.Exists(indexPath))
            {
                _logger.LogWarning("Destroy: index.html not found at {Path}.", indexPath);
                return;
            }

            lock (IndexHtmlLock)
            {
                string html = File.ReadAllText(indexPath);
                string patched = Regex.Replace(StripTags(html), "</body>", ScriptTag + "</body>", RegexOptions.IgnoreCase);
                if (string.Equals(patched, html, StringComparison.Ordinal))
                {
                    return;
                }

                File.WriteAllText(indexPath, patched);
                _logger.LogInformation("Destroy: script tag written into index.html.");
            }
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(ex, "Destroy: no write permission on index.html - install 'File Transformation' (Docker setups).");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Destroy: writing the script tag into index.html failed.");
        }
    }
}

public class TransformPayload
{
    [Newtonsoft.Json.JsonProperty("contents")]
    public string Contents { get; set; } = string.Empty;
}

public static class IndexHtmlTransform
{
    internal static ILogger? Logger { get; set; }

    public static string Transform(TransformPayload payload)
    {
        string? contents = payload?.Contents;
        if (string.IsNullOrEmpty(contents))
        {
            return contents ?? string.Empty;
        }

        return Regex.Replace(Plugin.StripTags(contents), "</body>", Plugin.ScriptTag + "</body>", RegexOptions.IgnoreCase);
    }
}
