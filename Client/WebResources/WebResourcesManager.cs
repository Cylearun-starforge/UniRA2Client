namespace UniRA2.Client.WebResources;

public class WebResourcesManager
{
    public Uri MainWindowWebUrl { get; }

    public WebResourcesManager()
    {
#if DEBUG
        MainWindowWebUrl = new Uri("http://127.0.0.1:5173/");
#else
        MainWindowWebUrl = new Uri("./ui/index.html", UriKind.Relative);
#endif
    }
}
