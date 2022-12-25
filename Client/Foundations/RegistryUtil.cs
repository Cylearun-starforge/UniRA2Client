using Microsoft.Win32;

namespace UniRA2.Client.Foundations;

internal class RegistryUtil
{
    private static readonly RegistryKey BaseRegKey =
#if DEBUG
        Registry.CurrentUser.CreateSubKey(@"Software\UniRA2\ClientDebug", true);
#else
        Registry.CurrentUser.CreateSubKey(@"Software\UniRA2\Client", true);
#endif
    public void SetInstallationDir(string dir)
    {
        BaseRegKey.SetValue("InstallationDir", dir);
    }
}
