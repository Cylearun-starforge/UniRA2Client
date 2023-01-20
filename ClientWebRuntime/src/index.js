//@ts-check

const host = window.chrome.webview.hostObjects;
/**
 * Get UniRA2 Client information
 * @returns {Promise<{mode: 'Debug'|'Release', runtime: string}>}
 */
export async function getPlatform() {
  const mode = await window.chrome.webview.hostObjects.Platform.Mode;
  const runtime = await window.chrome.webview.hostObjects.Platform.Runtime;
  return { mode, runtime };
}

export async function closeWindow() {
  await host.Window.CloseWindow();
}
