using System.Windows;
using Microsoft.Web.WebView2.Core;
using UniRA2.Client.Foundations;
using UniRA2.Client.WebResources;
using UniRA2.Client.WebRuntime.MainWindow;

namespace UniRA2.Client
{
    public partial class MainWindow
    {
        public static List<Action<MainWindow>> OnInit = new();
        public static Guid Id = new();
        public static MainWindow? Instance { get; private set; }

        public static void CreateInstance()
        {
            if (Instance is not null)
            {
                throw new InvalidOperationException("Recreate MainWindow");
            }

            Instance = new MainWindow();
        }

        public MainWindow()
        {
            InitializeComponent();
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
