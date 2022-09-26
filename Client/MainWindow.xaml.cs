using System.IO;
using System.Windows;
using Microsoft.Web.WebView2.Core;

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
            Environment.CurrentDirectory =
                Path.Combine(Environment.CurrentDirectory, "../../../../../ClientUI/dist");
            var env = await CoreWebView2Environment.CreateAsync(null, null,
                new CoreWebView2EnvironmentOptions("-allow-file-access-from-files"));
            await WebView.EnsureCoreWebView2Async(env);
            WebView.Source = new Uri(Path.Combine(Environment.CurrentDirectory, "./index.html"));
            WebView.CoreWebView2.OpenDevToolsWindow();
        }
    }
}
