using System.Reflection;
using System.Runtime.InteropServices;
using Microsoft.Web.WebView2.Core;

namespace UniRA2.Client.Foundations;

// This attribute seems useless
// [ClassInterface(ClassInterfaceType.AutoDispatch)]
[AttributeUsage(AttributeTargets.Class, Inherited = false)]
public class HostInjectAttribute : Attribute
{
    /// <summary>
    /// property name presents in window.chrome.webview.hostObjects
    /// </summary>
    public string? NameInWeb { get; }

    public HostInjectAttribute(string? nameInWeb = null)
    {
        NameInWeb = nameInWeb;
    }
}

public static class HostInjector
{
    public static void InjectFromAssembly(CoreWebView2 webRuntime, Assembly assembly)
    {
        var injectableClasses = from type in assembly.GetTypes()
            where type.IsClass && !type.IsAbstract && type.GetCustomAttribute<HostInjectAttribute>(false) != null
            select type;

        foreach (var injectableClass in injectableClasses)
        {
            var injectProperty = injectableClass.GetCustomAttribute<HostInjectAttribute>()?.NameInWeb ??
                                 injectableClass.Name;
            webRuntime.AddHostObjectToScript(injectProperty, SingletonContext.Get(injectableClass));
        }
    }
}
