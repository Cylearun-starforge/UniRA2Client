using System.Diagnostics;
using System.IO;

namespace UniRA2.Client.Foundations;

internal class Directories
{
    public static string InstallationDir =
#if DEBUG
        Environment.GetEnvironmentVariable("INSTALLATION_DIR") ??
#endif
        Environment.CurrentDirectory;

    public static string ModDir = Path.Join(InstallationDir, "Mod");
    public static string ModMapDirName = "Maps";
    public static string UserDataDir = Path.Join(InstallationDir, "UserData");
    public static string LogDir = Path.Join(InstallationDir, "Logs");
    public static FileInfo ClientLogPath = new(Path.Join(LogDir, "client.log"));
    public static FileInfo CrashLog = new(Path.Join(LogDir, "client-crash.log"));

    public static string GetWebUserDataDir(string modName)
    {
        var userDataDir = Path.Combine(UserDataDir, modName);
        Directory.CreateDirectory(userDataDir);
        return userDataDir;
    }

    public static DirectoryInfo GetMapDir(string modName)
    {
        var mapDir = Path.Combine(ModDir, modName, ModMapDirName);
        return Directory.CreateDirectory(mapDir);
    }
}
