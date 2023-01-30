type WebviewPlatform = {
  mode: 'Debug' | 'Release';
  runtime: 'Microsoft Webview2';
};

type GameMap = {
  name: string;
};

type MapSet = {
  mode: Promise<string>;
  apList: Promise<GameMap[]>;
};

declare var UniRA2Api: {
  getPlatform: () => Promise<WebviewPlatform>;
  closeWindow: () => Promise<void>;
  map: {
    listMaps: () => Promise<MapSet[]>;
  };
};
