using System.Reflection;
using System.Text.Json;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using UniRA2.Client.WebResources;

namespace UniRA2.Client.Foundations;

public static class WebView2Extension
{
    public static async Task InitializeWebView2(this WebView2 webView2)
    {
        var env = await CoreWebView2Environment.CreateAsync(null, null,
            new CoreWebView2EnvironmentOptions("-allow-file-access-from-files"));
        await webView2.EnsureCoreWebView2Async(env);

        webView2.Source = SingletonContext.Get<WebResourcesManager>().MainWindowWebUrl;
        InitializeWebRuntime(webView2.CoreWebView2);
    }

    public static void InitializeWebRuntime(this CoreWebView2 webView2)
    {
        HostInjector.InjectFromAssembly(webView2, Assembly.GetExecutingAssembly());
    }
}
