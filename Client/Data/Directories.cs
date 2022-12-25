using System.Diagnostics;
using System.IO;

namespace UniRA2.Client.Data;

internal class Directories
{
    public static string InstallationDir = Environment.CurrentDirectory;
    public static string ModDir = Path.Join(InstallationDir, "Mod");
    public static string UserDataDir = Path.Join(InstallationDir, "UserData");

    public static string GetWebUserDataDir(string modName)
    {
        string userDataDir = Path.Combine(UserDataDir, modName);
        Directory.CreateDirectory(userDataDir);
        return userDataDir;
    }
}
