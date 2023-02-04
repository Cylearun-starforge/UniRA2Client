using System.IO;
using IniParser;
using IniParser.Model;

namespace UniRA2.Client.Map;

public class GameMap
{
    private readonly FileInfo _mapFileInfo;
    public string CoverFile;


    public GameMap(IGrouping<string, FileInfo> mapGrouping)
    {
        if (!mapGrouping.Any())
        {
            throw new ArgumentException("Empty grouping");
        }

        var yrmFile = mapGrouping.FirstOrDefault((file) => file!.Extension == ".yrm", null);
        _mapFileInfo = yrmFile ?? mapGrouping.First();
        var coverFile = new FileInfo(_mapFileInfo.FullName[..^4] + ".png");
        using var stream = coverFile.OpenRead();
        var buffer = new byte[stream.Length];
        stream.Read(buffer);

        CoverFile = Convert.ToBase64String(buffer);
        Header = ReadMapHeader();
    }

    public string Name { get => _mapFileInfo.Name; }
    public GameMapHeader Header;

    private GameMapHeader ReadMapHeader()
    {
        using var fileStream = _mapFileInfo.OpenRead();
        using var fileReader = new StreamReader(fileStream);
        var parser = new IniDataParser {Configuration = {AllowDuplicateSections = true, SkipInvalidLines = true}};
        var data = parser.Parse(fileReader)["Header"];

        int numberOfStartPoints = int.Parse(data["NumberStartingPoints"]);
        var startingPointList = new MapLocation[numberOfStartPoints];
        for (int i = 0; i < numberOfStartPoints; i++)
        {
            var startingPoint = data[$"Waypoint{i + 1}"];
            startingPointList[i] = new MapLocation(startingPoint);
        }

        return new GameMapHeader(int.Parse(data["Width"]), int.Parse(data["Height"]), startingPointList);
    }
}

public record MapLocation(int X, int Y)
{
    public MapLocation(string? iniLocation) : this(-1, -1)
    {
        if (iniLocation is null)
        {
            return;
        }

        var pair = iniLocation.Split(',').Select(int.Parse).ToArray();

        if (pair.Length != 2)
        {
            return;
        }

        X = pair[0];
        Y = pair[1];
    }

    public bool IsValidLocation => X >= 0 && Y >= 0;
}

public record GameMapHeader(int Width, int Height, MapLocation[] StartingPoints);
