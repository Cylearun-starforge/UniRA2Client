using System.Windows;
using Microsoft.Web.WebView2.Core;
using UniRA2.Client.WebResources;

namespace UniRA2.Client
{
    public partial class MainWindow
    {
        public MainWindow()
        {
            InitializeComponent();
        }


        private async void OnLoaded(object sender, RoutedEventArgs e)
        {
            var env = await CoreWebView2Environment.CreateAsync(null, null,
                new CoreWebView2EnvironmentOptions("-allow-file-access-from-files"));
            await WebView.EnsureCoreWebView2Async(env);

            WebView.Source = Foundations.SingletonContext.Get<WebResourcesManager>().MainWindowWebUrl;
            WebView.CoreWebView2.OpenDevToolsWindow();
        }
    }
}
