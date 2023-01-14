using System.Security.Policy;
using System.Windows;
using UniRA2.Client.Foundations;
using UniRA2.Client.Schemas;

namespace UniRA2.Client
{
    /// <summary>
    /// ModuleWindow.xaml 的交互逻辑
    /// </summary>
    public partial class ModuleWindow : Window
    {
        private ModManifest? _manifest;

        public bool IsIdleWindow => _manifest == null;


        public ModuleWindow()
        {
            InitializeComponent();
        }


        private async void OnLoaded(object sender, RoutedEventArgs e)
        {
            await WebView.InitializeWebView2();
            WebView.CoreWebView2.OpenDevToolsWindow();
        }

        public static Guid CreateAndRegister()
        {
            var window = new ModuleWindow();
            var id = Guid.NewGuid();
            SingletonContext.Get<ModWindowManager>().Register(window, id);
            return id;
        }

        public void Start(ModManifest manifest)
        {
            _manifest = manifest;
            WebView.CoreWebView2.Navigate(_manifest.Page);
        }
    }
}
