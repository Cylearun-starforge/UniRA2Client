using System.IO;

namespace UniRA2.Client.CommandLine;



public class CommandModel
{
#if DEBUG
    public DevModel? Dev;
#endif
    public SingleModel? Single;
}

public record DevModel(FileInfo Manifest);

public record SingleModel(string ModFolder);
