using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Nodes;
using Json.Schema;
using UniRA2.Client.Foundations;
using System.Resources;
using System.Resources.Extensions;
using System.Text;
using System.Windows;

namespace UniRA2.Client.Schemas;

public record WindowConfig
{
    public double InitialWidth { get; set; }
    public double InitialHeight { get; set; }
};

public record ModManifest
{
    public string Name { get; set; } = string.Empty;
    public string Page { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string HomePage { get; set; } = string.Empty;
    public WindowConfig Window { get; set; }
}

public static class ModManifestHelper
{
    public static async Task<ValidationResults> ValidateManifest(JsonDocument manifest)
    {
        var stream = Assembly.GetExecutingAssembly()
            .GetManifestResourceStream("UniRA2.Client.Schemas.mod-manifest.schema.json")!;


        var validator = await JsonSchema.FromStream(stream);
        return validator.Validate(manifest, new ValidationOptions {OutputFormat = OutputFormat.Basic,});
    }

    public static async Task<ModManifest> LoadFromFile(string path)
    {
        await using var file = File.OpenRead(path);
        return await LoadFromFile(file);
    }

    public static async Task<ModManifest> LoadFromFile(Stream stream)
    {
        var manifest = await JsonDocument.ParseAsync(stream,
            new JsonDocumentOptions {AllowTrailingCommas = true, CommentHandling = JsonCommentHandling.Skip});
        if (manifest == null)
        {
            throw new NullReferenceException("manifest json is null");
        }

        var result = await ValidateManifest(manifest);
        if (result.IsValid)
        {
            return manifest.Deserialize<ModManifest>(new JsonSerializerOptions
            {
                AllowTrailingCommas = true, ReadCommentHandling = JsonCommentHandling.Skip,
            })!;
        }

        if (result.Message != null)
        {
            throw new ArgumentException($"Invalid manifest:\n{FormatValidationResult(result)}");
        }

        if (!result.HasNestedResults)
        {
            throw new ArgumentException("Invalid manifest");
        }

        var messageBuffer = result.NestedResults.Aggregate(new StringBuilder("Invalid manifest:\n"),
            (sb, nestedResult) => sb.AppendLine(FormatValidationResult(nestedResult)));

        throw new ArgumentException(messageBuffer.ToString());
    }

    private static string FormatValidationResult(ValidationResults result)
    {
        return new StringBuilder()
            .AppendLine($"\tProperty: {result.InstanceLocation.Source}")
            .AppendLine($"\t\t{result.Message}")
            .ToString();
    }
}
