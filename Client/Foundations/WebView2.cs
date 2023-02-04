using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Windows;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using UniRA2.Client.Data;
using UniRA2.Client.WebResources;

namespace UniRA2.Client.Foundations;

public static class WebView2Extension
{
    public static async Task InitializeWebView2(this WebView2 webView2)
    {
        var env = await CoreWebView2Environment.CreateAsync(null, Directories.GetWebUserDataDir("main"),
            new CoreWebView2EnvironmentOptions("-allow-file-access-from-files"));
        await webView2.EnsureCoreWebView2Async(env);


        var resourcesManager = SingletonContext.Get<WebResourcesManager>();
        webView2.CoreWebView2.SetVirtualHostNameToFolderMapping("unira2",
            Path.Join(resourcesManager.RuntimeScripts, ".."), CoreWebView2HostResourceAccessKind.Allow);

        webView2.Source = resourcesManager.MainWindowWebUrl;
    }
}
