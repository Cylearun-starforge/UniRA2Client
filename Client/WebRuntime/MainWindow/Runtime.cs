namespace UniRA2.Client.WebRuntime.MainWindow
{
    public class Runtime
    {
        private Client.MainWindow _window;
        public Info Platform = new Info();
        public Window Window;

        public Runtime(Client.MainWindow window)
        {
            _window = window;
            Window = new Window(_window);
        }
    }
}
