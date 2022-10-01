using System.IO;
using System.Text.Json.Serialization;

namespace UniRA2.Client.WebResources;

public class WebResourcesManager
{
    public Uri MainWindowWebUrl { get; }
    public Uri RuntimeScripts { get; }

    public WebResourcesManager()
    {
#if DEBUG
        MainWindowWebUrl = new Uri("http://127.0.0.1:5173/");
        RuntimeScripts =
            new Uri(Path.Join(Environment.CurrentDirectory, "../../../../../ClientWebRuntime/dist/runtime.js"));
#else
        MainWindowWebUrl = new Uri("./ui/index.html", UriKind.Relative);
        RuntimeScripts = new Uri("./webRuntime/runtime.js", UriKind.Relative);
#endif
    }

    public ImportMap CreateImportMap()
    {
        return new ImportMap {imports = {Runtime = Path.Join(Environment.CurrentDirectory, RuntimeScripts.ToString())}};
    }

    public class ImportMap
    {
        public struct Import
        {
            [JsonPropertyName("@uni-ra2/client-runtime")]
            public string Runtime;
        }

        public Import imports;
    }

    public static string InjectScriptFromUri(Uri uri)
    {
        var template = @"(function(document){
const script = document.createElement('script');
script.src = '$URI';
script.type = 'module';
document.head.prepend(script);
})(document)";
        template = template.Replace("$URI", uri.ToString());
        return template;
    }
}
