using System.CommandLine;
using System.Globalization;
using System.IO;
using System.Text.Json;
using System.Windows;
using UniRA2.Client.CommandLine;
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
            cmd.OnDefault += OpenDefaultWindow;
            cmd.OnSingle += OnSingle;

            var exitCode = cmd.ParseArguments(e.Args);
            if (exitCode != 0)
            {
                Shutdown(exitCode);
                return;
            }
#if DEBUG
            HandleDevModel();
#endif
            cmd.DispatchCommandHandler();
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

        public void OpenDefaultWindow()
        {
            Client.MainWindow.CreateInstance();
            MainWindow = Client.MainWindow.Instance;
            MainWindow!.Show();
        }

        public async void OnSingle(SingleModel options)
        {
            if (!options.ModFolder.Exists)
            {
                throw new ArgumentException($"Mod [{options.ModFolder}] is not exist");
            }

            var manifestList = options.ModFolder.GetFiles("manifest.json", SearchOption.TopDirectoryOnly);

            if (manifestList.Length == 0)
            {
                throw new ArgumentException($"Cannot find manifest.json for Mod [{options.ModFolder.Name}]");
            }

            var manifest = await ModManifestHelper.LoadFromFile(manifestList[0].OpenRead());
            var window = SingletonContext.Get<ModWindowManager>().GetIdle();
            window.Instance.Start(manifest);


        }
    }
}
