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

class MapSet {
  /** @type {MapSetProxy} */
  #mapSet;

  /** @type {Promise<GameMap[]>} */
  #mapList;

  /**
   * @param {MapSetProxy} mapSet
   */
  constructor(mapSet) {
    this.#mapSet = mapSet;

    this.#mapList = this.#mapSet.MapList.then(maps => {
      return maps.map(proxy => new GameMap(proxy));
    });
  }

  get mode() {
    return this.#mapSet.ModeName;
  }

  get mapList() {
    return this.#mapList;
  }
}

export const map = {
  listMaps: async () => {
    const internalMapSetList = await host.Map.ListMaps();
    return internalMapSetList.map(map => new MapSet(map));
  },
};

export const Game = {
  launch: async () => {
    await host.Game.LaunchGame();
  },
};
