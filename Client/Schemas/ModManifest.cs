namespace UniRA2.Client.Schemas;

public record ModManifest
{
    public string Name { get; set; } = string.Empty;
    public string Page { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string HomePage { get; set; } = string.Empty;

}
