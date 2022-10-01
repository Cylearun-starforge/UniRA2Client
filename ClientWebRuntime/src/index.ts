export type WebviewPlatform = {
  mode: 'Debug' | 'Release';
  runtime: 'Microsoft Webview2';
};
export async function getPlatform(): Promise<WebviewPlatform> {
  const mode = await window.chrome.webview.hostObjects.Platform.Mode;
  const runtime = await window.chrome.webview.hostObjects.Platform.Runtime;
  return { mode, runtime };
}
