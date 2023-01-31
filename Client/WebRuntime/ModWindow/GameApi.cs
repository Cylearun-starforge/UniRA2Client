using UniRA2.Client.Launcher;

namespace UniRA2.Client.WebRuntime.ModWindow;

public class GameApi
{
    private readonly RuntimeContext _context;

    public GameApi(RuntimeContext context)
    {
        _context = context;
    }

    public void LaunchGame()
    {
        var launcher = new IndependentLauncher(_context.Window.GameLaunchConfig);
        launcher.Launch();
    }
}
