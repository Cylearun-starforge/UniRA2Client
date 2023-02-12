using System.IO;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace UniRA2.Client.WebResources;

public class WebResourcesManager
{
    public Uri MainWindowWebUrl { get; }
    public string RuntimeScripts { get; }

    public WebResourcesManager()
    {
#if DEBUG
        MainWindowWebUrl = new Uri("http://127.0.0.1:5173/");
        RuntimeScripts =
            Path.Join(Environment.CurrentDirectory, "../../../../../ClientWebRuntime/dist/runtime.iife.js");
#else
        MainWindowWebUrl = new Uri("./ui/index.html", UriKind.Relative);
        RuntimeScripts = Path.Join("./webRuntime/runtime.iife.js", UriKind.Relative);
#endif
    }


    public static async void InjectScriptFromUri(CoreWebView2 webView, string uri)
    {
        await using var file = File.OpenRead(uri);
        var buffer = new byte[file.Length];
        var _ = await file.ReadAsync(buffer);
        var script = Encoding.UTF8.GetString(buffer); 
        await webView.ExecuteScriptAsync(script);
        
    }
}
