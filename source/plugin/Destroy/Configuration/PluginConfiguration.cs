using MediaBrowser.Model.Plugins;

namespace Jellyfin.Plugin.Destroy.Configuration;

public class PluginConfiguration : BasePluginConfiguration
{
    public bool Enabled { get; set; } = true;

    public bool ShowPlayButton { get; set; } = true;

    public bool ShortcutEnabled { get; set; } = true;

    public string Shortcut { get; set; } = "Alt+Shift+D";

    public bool ControllerEnabled { get; set; } = true;

    public bool ControllerStart { get; set; } = true;

    public bool StartMuted { get; set; } = true;

    public string Hero { get; set; } = "auto";

    public string EffectQuality { get; set; } = "auto";

    public bool ShowOneLiners { get; set; } = true;

    public bool AllowPersonalSettings { get; set; } = true;

    public bool RecordDiagnostics { get; set; }
}
