using Microsoft.Web.WebView2.Core;

namespace UniRA2.Client
{
	public partial class Form1 : Form
	{
		public Form1()
		{
			InitializeComponent();
		}

		private async void Form1_Load(object sender, EventArgs e)
		{
			Environment.CurrentDirectory =
				Path.Combine(Environment.CurrentDirectory, "../../../../../ClientUI/dist");
			var env = await
				CoreWebView2Environment.CreateAsync(null, null,
					new CoreWebView2EnvironmentOptions("-allow-file-access-from-files"));
			await webView.EnsureCoreWebView2Async(env);
			webView.Source =
				new Uri(Path.Combine(Environment.CurrentDirectory, "./index.html"));
			webView.CoreWebView2.OpenDevToolsWindow();
		}
	}
}