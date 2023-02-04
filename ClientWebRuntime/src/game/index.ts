import { Webview2Proxy, runtime } from '../env';
type MapLocationProxy = Webview2Proxy<{
  X: number;
  Y: number;
  IsValidLocation: boolean;
}>;

type GameMapHeaderProxy = Webview2Proxy<{
  Width: number;
  Height: number;
  StartingPoints: MapLocationProxy[];
}>;

type GameMapProxy = Webview2Proxy<{
  Name: string;
  Header: GameMapHeaderProxy;
  CoverFile: string;
}>;

export type MapSetProxy = Webview2Proxy<{
  ModeName: string;
  MapList: GameMapProxy[];
}>;

export class GameMapHeader {
  #header: GameMapHeaderProxy;

  constructor(header: GameMapHeaderProxy) {
    this.#header = header;
  }

  get width() {
    return this.#header.Width;
  }

  get height() {
    return this.#header.Height;
  }

  get startingPoints() {
    return new Promise(async resolve => {
      const startingPointList = await this.#header.StartingPoints;
      resolve(startingPointList);
    });
  }
}

export class GameMap {
  #map: GameMapProxy;
  #header: Promise<GameMapHeader>;

  constructor(map: GameMapProxy) {
    this.#map = map;
    this.#header = new Promise(async resolve => {
      const headerProxy = await this.#map.Header;
      resolve(new GameMapHeader(headerProxy));
    });
  }

  get name() {
    return this.#map.Name;
  }

  get header() {
    return this.#header;
  }

  get cover() {
    return new Promise<string>(async resolve => {
      const blobString = 'data:image/png;base64,' + (await this.#map.CoverFile);
      resolve(blobString);
    });
  }
}

/**
 * @public
 */
export class MapSet {
  #mapSet: MapSetProxy;
  #mapList: Promise<GameMap[]>;

  constructor(mapSet: MapSetProxy) {
    this.#mapSet = mapSet;

    this.#mapList = this.#mapSet.MapList.then(maps => {
      console.log(maps);
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

/**
 * @public
 */
export const map = {
  listMaps: async () => {
    const internalMapSetList = await runtime.Map.ListMaps();
    return internalMapSetList.map(map => new MapSet(map));
  },
};

/**
 * @public
 */
export const game = {
  launch: async () => {
    await runtime.Game.LaunchGame();
  },
};
