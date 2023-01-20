namespace UniRA2.Client.WebRuntime.ModWindow
{
    public class Window
    {
        private RuntimeContext _context;

        public Window(RuntimeContext context)
        {
            _context = context;
        }

        public void CloseWindow()
        {
            _context.Window.CloseFromWeb();
        }
    }
}
