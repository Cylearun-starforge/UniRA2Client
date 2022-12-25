//@ts-check

/**
 * Get UniRA2 Client information
 * @returns {Promise<{mode: 'Debug'|'Release', runtime: string}>}
 */
export async function getPlatform() {
  const mode = await window.chrome.webview.hostObjects.Platform.Mode;
  const runtime = await window.chrome.webview.hostObjects.Platform.Runtime;
  return { mode, runtime };
}
