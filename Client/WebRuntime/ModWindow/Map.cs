using UniRA2.Client.Map;

namespace UniRA2.Client.WebRuntime.ModWindow;

public class Map
{
    private readonly RuntimeContext _context;

    public Map(RuntimeContext context)
    {
        _context = context;
    }

    public GameMap[] ListMaps()
    {
        return _context.Window.MapDirectory.EnumerateFiles().Select(file => new GameMap(file))
            .ToArray();
    }
}
