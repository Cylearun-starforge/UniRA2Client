using System.IO;
using System.Text;
using System.Windows;

namespace UniRA2.Client.Foundations
{
    internal static class UnhandledExceptionHandler
    {
        private static void OnUnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            var exception = (Exception)e.ExceptionObject;
            if (!e.IsTerminating)
            {
                HandleNotTerminating(exception);
                return;
            }

            HandleTerminating(exception);
        }

        internal static void SetUnhandledExceptionHandler()
        {
            AppDomain.CurrentDomain.UnhandledException += OnUnhandledException;
        }

        private static void HandleNotTerminating(Exception exception)
        {
            var logger = SingletonContext.Get<Logger>();
            logger.Error("Unhandled Error", exception);
        }

        private static void HandleTerminating(Exception exception)
        {
            var buffer = new StringBuilder(exception.Message);
            buffer.AppendLine();
            buffer.AppendLine("Would you like to generate a crash log? It contains a stack trace to help us solve this problem.");
            var result = MessageBox.Show(buffer.ToString(), "FATAL ERROR", MessageBoxButton.YesNo,
                MessageBoxImage.Error);

            if (result != MessageBoxResult.Yes)
            {
                return;
            }

            if (Directories.CrashLog.DirectoryName != null)
            {
                Directory.CreateDirectory(Directories.CrashLog.DirectoryName);
            }

            var crashLog = Directories.CrashLog.OpenWrite();
            crashLog.Write(Encoding.UTF8.GetBytes(exception.Message));
            crashLog.Write(Encoding.UTF8.GetBytes(exception.PrettyToString()));
            crashLog.Flush();
            crashLog.Close();
        }
    }
}
