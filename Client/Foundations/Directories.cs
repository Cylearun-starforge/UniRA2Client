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
