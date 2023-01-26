using System.CommandLine;
using System.IO;

namespace UniRA2.Client.CommandLine;

public class CommandLine
{
    public readonly RootCommand Parser;
    public CommandModel Model { get; }

    public CommandLine()
    {
        Model = new CommandModel();
        Parser = new RootCommand();
#if DEBUG
        var devCommand = new Command("dev", "open as developer mode");
        var manifestArgument = new Argument<FileInfo>("manifest", "Path to manifest.json");


        devCommand.AddArgument(manifestArgument);
        devCommand.SetHandler((devModel) =>
        {
            Model.Dev = devModel;
        }, new DevBinder(manifestArgument));
        Parser.AddCommand(devCommand);
#endif
    }
}
