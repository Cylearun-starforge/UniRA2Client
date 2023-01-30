using System.IO;

namespace UniRA2.Client.Map;

public class GameMap
{
    private readonly FileInfo _mapFileInfo;


    public GameMap(IGrouping<string, FileInfo> mapGrouping)
    {
        if (!mapGrouping.Any())
        {
            throw new ArgumentException("Empty grouping");
        }

        var yrmFile = mapGrouping.FirstOrDefault((file) => file!.Extension == ".yrm", null);
        _mapFileInfo = yrmFile ?? mapGrouping.First();
    }

    public string Name { get => _mapFileInfo.Name; }
}
