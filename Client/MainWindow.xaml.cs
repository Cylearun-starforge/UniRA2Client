using System.Windows;
using Microsoft.Web.WebView2.Core;
using UniRA2.Client.Foundations;
using UniRA2.Client.WebResources;
using UniRA2.Client.WebRuntime.MainWindow;

namespace UniRA2.Client
{
    public partial class MainWindow
    {

        public Guid Id;
        public MainWindow()
        {
            InitializeComponent();
            Id = Guid.NewGuid();
        }


        private async void OnLoaded(object sender, RoutedEventArgs e)
        {
            await WebView.InitializeWebView2();
            WebView.CoreWebView2.AddHostObjectToScript("runtime", new Runtime(this));
            WebResourcesManager.InjectScriptFromUri(WebView.CoreWebView2,
                SingletonContext.Get<WebResourcesManager>().RuntimeScripts);
            WebView.CoreWebView2.OpenDevToolsWindow();
        }
    }
}
