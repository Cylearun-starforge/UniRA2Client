using System.Diagnostics;
using System.IO;
using System.Text;
using UniRA2.Client.Schemas;

namespace UniRA2.Client.Launcher;

public class IndependentLauncher
{
    private readonly FileInfo _syringe;
    private readonly string _workingDirectory;
    private string[] _arguments;
    private readonly string _syringeArgumentGameExe;

    public IndependentLauncher(LaunchConfig launchConfig)
    {
        var syringe = launchConfig.Syringe;


        // if (!File.Exists(syringe))
        // {
        //     throw new ArgumentException($"Syringe not found: {syringe}");
        // }

        _syringe = new FileInfo(syringe);
        _workingDirectory = launchConfig.WorkingDirectory ?? _syringe.DirectoryName!;
        _syringeArgumentGameExe = $"\"{launchConfig.Game}\"";
        _arguments = (launchConfig.GameArguments ?? Array.Empty<string>());
    }

    public void Launch(string overrideIni)
    {
        var process = new Process();
        process.StartInfo = new ProcessStartInfo(_syringe.FullName)
        {
            Arguments = CommandLine, WorkingDirectory = _workingDirectory
        };


        process.Start();
    }

    private string CommandLine => _arguments
        .Aggregate(new StringBuilder(_syringeArgumentGameExe), (sb, text) => sb.Append(' ').Append(text)).ToString();
}
