using System.IO;
using System.Security.Policy;
using System.Windows;
using UniRA2.Client.Foundations;
using UniRA2.Client.Schemas;
using UniRA2.Client.WebResources;
using UniRA2.Client.WebRuntime;
using UniRA2.Client.WebRuntime.ModWindow;
using Window = System.Windows.Window;

namespace UniRA2.Client;

public partial class ModuleWindow
{
    private ModManifest? _manifest;
    public System.Guid WindowId { get; }
    public bool IsIdleWindow => _manifest == null;
    public LaunchConfig GameLaunchConfig
    {
        get
        {
            if (_manifest?.Launcher is null)
            {
                throw new InvalidOperationException("manifest is null");
            }

            return _manifest.Launcher;
        }
    }

    private bool _isWindowReady = false;
    public event EventHandler<WindowReadyEventArgs> WindowReady;

    public ModuleWindow()
    {
        InitializeComponent();
        WindowId = System.Guid.NewGuid();
        WindowReady += (sender, args) =>
        {
            _isWindowReady = true;
        };
    }

    private async void OnLoaded(object sender, RoutedEventArgs e)
    {
        await WebView.InitializeWebView2();
        WebView.CoreWebView2.ContextMenuRequested += (o, args) =>
        {
            args.Handled = true;
        };
        WebView.CoreWebView2.AddHostObjectToScript("runtime",
            new Runtime(new RuntimeContext {WindowId = WindowId}));
        this.WindowReady.Invoke(this, new WindowReadyEventArgs());
        WebView.CoreWebView2.NavigationCompleted += (o, args) =>
        {
            WebResourcesManager.InjectScriptFromUri(WebView.CoreWebView2,
                SingletonContext.Get<WebResourcesManager>().RuntimeScripts);
        };
    }

    private void StartInternal()
    {
        WebView.CoreWebView2.Navigate(_manifest!.Page);


#if DEBUG
        WebView.CoreWebView2.OpenDevToolsWindow();
#endif
    }

    public void Start(ModManifest manifest)
    {
        _manifest = manifest;
        this.Width = _manifest.Window.InitialWidth;
        this.Title = _manifest.Window.Title ?? _manifest.Name;
        this.Height = _manifest.Window.InitialHeight;
        this.Visibility = Visibility.Visible;
        if (_isWindowReady)
        {
            StartInternal();
        }
        else
        {
            this.WindowReady += (sender, args) =>
            {
                StartInternal();
            };
        }
    }

    public void CloseFromWeb()
    {
        this.WebView.CoreWebView2.Navigate("edge://newtab");
        Close();
    }

    public DirectoryInfo MapDirectory
    {
        get
        {
            if (_manifest is null)
            {
                throw new InvalidOperationException(
                    "ModuleWindow.MapDirectory should be invoked after WindowReadyEvent");
            }

            return Directories.GetMapDir(_manifest.Name);
        }
    }
}

public class WindowReadyEventArgs : EventArgs
{
}
