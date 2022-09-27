using System.Windows;
using Microsoft.Web.WebView2.Core;
using UniRA2.Client.Foundations;
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
            await WebView.InitializeWebView2();
            WebView.CoreWebView2.OpenDevToolsWindow();
        }
    }
}
