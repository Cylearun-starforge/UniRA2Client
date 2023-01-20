namespace UniRA2.Client.WebRuntime.MainWindow;

public class Info
{
#if DEBUG
    public string Mode = "Debug";
#else
    public string Mode = "Release";
#endif
    public string Runtime = "Microsoft WebView2";
}
