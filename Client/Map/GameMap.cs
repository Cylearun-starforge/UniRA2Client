using System.IO;

namespace UniRA2.Client.Map;

public class GameMap
{
    private readonly FileInfo _mapFileInfo;

    public GameMap(FileInfo file)
    {
        _mapFileInfo = file;
    }

    public string Name { get => _mapFileInfo.Name; }

}
