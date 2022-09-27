using System.Runtime.InteropServices;
using UniRA2.Client.Foundations;

namespace UniRA2.Client.WebRuntime;

[HostInject("Platform")]
public class Info
{
#if DEBUG
    public string Mode = "Debug";
#else
    public string Mode = "Release";
#endif
    public string Runtime = "Microsoft WebView2";
}
