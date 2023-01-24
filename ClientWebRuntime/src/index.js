//@ts-check

const host = window.chrome.webview.hostObjects.runtime;

/**
 * Get UniRA2 Client information
 * @returns {Promise<{mode: 'Debug'|'Release', runtime: string}>}
 */
export async function getPlatform() {
  const mode = await host.Platform.Mode;
  const runtime = await host.Platform.Runtime;
  return { mode, runtime };
}

export async function closeWindow() {
  await host.Window.CloseWindow();
}
