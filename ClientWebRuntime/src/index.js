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

class GameMap {
  /** @type {GameMapProxy} */
  #map;

  /**
   * @param {GameMapProxy} map
   */
  constructor(map) {
    this.#map = map;
  }

  get name() {
    return this.#map.Name;
  }
}

export const Map = {
  listMaps: async () => {
    const internalMapList = await host.Map.ListMaps();
    return internalMapList.map(map => new GameMap(map));
  },
};
