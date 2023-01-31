using System.CommandLine;
using System.Globalization;
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
            var cmd = SingletonContext.Get<CommandLine.CommandLine>();
            var exitCode = cmd.Parser.Invoke(e.Args);
            if (exitCode != 0)
            {
                Shutdown(exitCode);
            }
#if DEBUG
            HandleDevModel();
#endif
        }

#if DEBUG
        private async void HandleDevModel()
        {
            var cmd = SingletonContext.Get<CommandLine.CommandLine>().Model.Dev;
            if (cmd is null)
            {
                return;
            }

            var manifest = await ModManifestHelper.LoadFromFile(cmd.Manifest.OpenRead());
            var window = SingletonContext.Get<ModWindowManager>().GetIdle();
            window.Instance.Start(manifest);
        }
#endif
    }
}
