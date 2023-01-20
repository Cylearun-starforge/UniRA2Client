using UniRA2.Client.Foundations;

namespace UniRA2.Client.WebRuntime.ModWindow
{
    public class Runtime
    {
        private RuntimeContext _context;

        public Info Platform = new Info();
        public Window Window;

        public Runtime(RuntimeContext context)
        {
            _context = context;
            Window = new Window(_context);

        }
    }


    public record RuntimeContext
    {
        public Guid WindowId;

        public ModuleWindow Window => SingletonContext.Get<ModWindowManager>().GetByGuid(WindowId);
    }
}