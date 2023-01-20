namespace UniRA2.Client.WebRuntime.MainWindow
{
    public class Window
    {
        private Client.MainWindow _window;

        public Window(Client.MainWindow window)
        {
           _window = window;
        }

        public void CloseWindow()
        {
            _window.Close();
        }
    }
}
