using System.CommandLine;
using System.Globalization;
using System.IO;
using System.Reflection;
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
            UnhandledExceptionHandler.SetUnhandledExceptionHandler();
            var logger = SingletonContext.Get<Logger>();
            logger.Open(Directories.ClientLogPath);
            logger.Info("UniRA2Client log file");
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

            var logger = SingletonContext.Get<Logger>();
            logger.Debug($"Running in Dev mode. Load manifest from {cmd.Manifest.FullName}");

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
            var modFolderDir = Path.Join(Directories.ModDir, options.ModFolder);
            if (!Directory.Exists(modFolderDir))
            {
                throw new ArgumentException($"Mod [{options.ModFolder}] is not exist");
            }


            var manifestList = Directory.GetFiles(modFolderDir, "manifest.json", SearchOption.TopDirectoryOnly);

            if (manifestList.Length == 0)
            {
                throw new ArgumentException($"Cannot find manifest.json for Mod [{options.ModFolder}]");
            }

            var manifest = await ModManifestHelper.LoadFromFile(File.OpenRead(manifestList[0]));
            var window = SingletonContext.Get<ModWindowManager>().GetIdle();
            window.Instance.Start(manifest);
        }
    }
}
