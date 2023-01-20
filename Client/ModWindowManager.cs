namespace UniRA2.Client;

public class ModWindowManager
{
    private readonly Dictionary<Guid, ModuleWindow> _modWindows = new();

    public void Register(ModuleWindow window, Guid guid)
    {
        _modWindows.Add(guid, window);
    }

    public void Register(ModuleWindow window)
    {
        var guid = Guid.NewGuid();
        Register(window, guid);
    }


    public ModuleWindow GetByGuid(Guid guid)
    {
        return _modWindows[guid];
    }

    public IdleModuleWindowInfo GetIdle()
    {
        try
        {
            var pair = _modWindows.First(pair => pair.Value.IsIdleWindow);
            return new IdleModuleWindowInfo {Guid = pair.Key, Instance = pair.Value};
        }
        catch (InvalidOperationException)
        {
            var window = new ModuleWindow();
            var guid = window.WindowId;
            _modWindows[guid] = window;
            return new IdleModuleWindowInfo {Guid = guid, Instance = window};
        }
    }
}

public struct IdleModuleWindowInfo
{
    public Guid Guid;
    public ModuleWindow Instance;
}
