using System.Security.Policy;
using System.Windows;
using UniRA2.Client.Foundations;
using UniRA2.Client.Schemas;
using UniRA2.Client.WebRuntime;
using UniRA2.Client.WebRuntime.ModWindow;
using Window = System.Windows.Window;

namespace UniRA2.Client
{
    /// <summary>
    /// ModuleWindow.xaml 的交互逻辑
    /// </summary>
    public partial class ModuleWindow : Window
    {
        private ModManifest? _manifest;
        public Guid WindowId { get; }
        public bool IsIdleWindow => _manifest == null;

        public ModuleWindow()
        {
            InitializeComponent();
            WindowId = Guid.NewGuid();
        }


        private async void OnLoaded(object sender, RoutedEventArgs e)
        {
            await WebView.InitializeWebView2();
            WebView.CoreWebView2.AddHostObjectToScript("runtime",
                new Runtime(new RuntimeContext {WindowId = WindowId}));
            WebView.CoreWebView2.OpenDevToolsWindow();
        }

        public void Start(ModManifest manifest)
        {
            _manifest = manifest;
            WebView.CoreWebView2.Navigate(_manifest.Page);
        }

        public void CloseFromWeb()
        {
            Close();
        }
    }
}
