using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Nodes;
using Json.Schema;
using UniRA2.Client.Foundations;
using System.Resources;
using System.Resources.Extensions;



namespace UniRA2.Client.Schemas;

public record ModManifest
{
    public string Name { get; set; } = string.Empty;
    public string Page { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string HomePage { get; set; } = string.Empty;

    public static ValidationResults ValidateManifest(JsonDocument manifest)
    {
       var stream =
           Application.ResourceAssembly.GetManifestResourceStream("UniRA2.Client.Schemas.mod-manifest.schema.json");
        
        var validator = JsonSchema.FromStream(stream);
        return validator.Result.Validate(manifest);
    }

    public static ModManifest LoadFromFile(string path)
    {
        using var file = File.OpenRead(path);
        return LoadFromFile(file);
    }

    public static ModManifest LoadFromFile(Stream stream)
    {
        var manifest = JsonDocument.Parse(stream);
        if (manifest == null)
        {
            throw new NullReferenceException("manifest json is null");
        }

        var result = ValidateManifest(manifest);
        if (result.IsValid)
        {
            return manifest.Deserialize<ModManifest>()!;
        }

        throw new ArgumentException(result.Message);
    }
}
