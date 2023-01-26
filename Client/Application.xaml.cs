using System.IO;
using System.Text.Json;
using System.Windows;
using UniRA2.Client.Foundations;
using UniRA2.Client.Schemas;

namespace UniRA2.Client
{
    /// <summary>
    /// Application.xaml 的交互逻辑
    /// </summary>
    public partial class Application
    {
        private void Application_OnStartup(object sender, StartupEventArgs e)
        {
#if DEBUG
            LoadTestMod(e.Args);
#endif
        }

#if DEBUG
        private static async void LoadTestMod(IReadOnlyList<string> args)
        {
            if (args.Count == 1)
            {
                var manifestPath = args[0];
                var manifest = await ModManifestHelper.LoadFromFile(manifestPath);
                var window = SingletonContext.Get<ModWindowManager>().GetIdle();
                window.Instance.Start(manifest);
            }
        }
#endif
    }
}
