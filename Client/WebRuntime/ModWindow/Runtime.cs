using UniRA2.Client.Foundations;

namespace UniRA2.Client.WebRuntime.ModWindow
{
    public class Runtime
    {
        private RuntimeContext _context;

        public Info Platform = new();
        public Window Window;
        public Map Map;
        public GameApi Game;

        public Runtime(RuntimeContext context)
        {
            _context = context;
            Window = new Window(_context);
            Map = new Map(_context);
            Game = new GameApi(_context);
        }
    }


    public record RuntimeContext
    {
        public System.Guid WindowId;

        public ModuleWindow Window => SingletonContext.Get<ModWindowManager>().GetByGuid(WindowId);
    }
}
