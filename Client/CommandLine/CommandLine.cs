using System.CommandLine;
using System.IO;

namespace UniRA2.Client.CommandLine;

public class CommandLine
{
    private readonly RootCommand _parser;

    public bool Invoked { get; private set; }

    public CommandModel Model { get; }

    public CommandLine()
    {
        Model = new CommandModel();
        _parser = new RootCommand();

#if DEBUG
        var devCommand = new Command("dev", "open as developer mode");
        var manifestArgument = new Argument<FileInfo>("manifest", "Path to manifest.json");


        devCommand.AddArgument(manifestArgument);
        devCommand.SetHandler((devModel) =>
        {
            Model.Dev = devModel;
        }, new DevBinder(manifestArgument));
        _parser.AddCommand(devCommand);
#endif

        var singleCommand = new Command("single", "open single mod, do not show UniRA2Client's window");
        var singleModFolderArgument =
            new Argument<DirectoryInfo>("folder", "mod folder, should contains manifest.json");
        singleCommand.AddArgument(singleModFolderArgument);
        singleCommand.SetHandler((singleModel) =>
        {
            Model.Single = singleModel;
        }, new SingleBinder(singleModFolderArgument));
        _parser.AddCommand(singleCommand);
    }

    public int ParseArguments(string[] args)
    {
        Invoked = true;
        if (args.Length == 0)
        {
            // Do not parse empty command line. We will get a empty model and fallback to invoke OnDefault event
            return 0;
        }

        return _parser.Invoke(args);
    }

    public event Action<SingleModel>? OnSingle;
    public event Action? OnDefault;

    public void DispatchCommandHandler()
    {
        if (!Invoked)
        {
            throw new InvalidOperationException("Should call ParseArguments first");
        }

        if (Model.Single is not null)
        {
            OnSingle?.Invoke(Model.Single);
            return;
        }

        OnDefault?.Invoke();
    }
}
