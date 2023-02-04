using System.IO;
using System.Text.RegularExpressions;

namespace UniRA2.Client.Map;

public class MapSet
{
    public string ModeName;
    public FileInfo? OptionFile;
    public DirectoryInfo Directory;

    public IEnumerable<GameMap> Maps;

    public MapSet(DirectoryInfo directory)
    {
        if (!directory.Exists)
        {
            throw new InvalidOperationException($"Invalid Directory: {directory.Name}");
        }

        Directory = directory;
        var optionIni = new FileInfo(Path.Combine(Directory.FullName, "options.ini"));
        if (optionIni.Exists)
        {
            OptionFile = new FileInfo(Path.Combine(Directory.FullName, "options.ini"));
        }

        ModeName = directory.Name;

        var validExtension = new[] {".map", ".yrm"};

        var mapGrouping = from file in Directory.EnumerateFiles()
            where validExtension.Contains(file.Extension)
            group file by file.Name[0..^4];

        Maps = from grouping in mapGrouping select new GameMap(grouping);
    }

    public GameMap[] MapList { get => Maps.ToArray(); }
}
