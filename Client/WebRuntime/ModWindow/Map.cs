using UniRA2.Client.Map;

namespace UniRA2.Client.WebRuntime.ModWindow;

public class Map
{
    private readonly RuntimeContext _context;

    public Map(RuntimeContext context)
    {
        _context = context;
    }

    public MapSet[] ListMaps()
    {
        var maps = _context.Window.MapDirectory.EnumerateDirectories().Select(dir => new MapSet(dir));
        return maps.ToArray();
    }
}
