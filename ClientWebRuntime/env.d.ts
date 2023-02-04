/// <reference types="vite/client" />
interface Window {
  chrome: {
    webview: {
      hostObjects: {
        runtime: {
          Platform: {
            Mode: Promise<'Debug' | 'Release'>;
            Runtime: Promise<'Microsoft Webview2'>;
          };

          Window: {
            CloseWindow: () => Promise<void>;
          };

          Map: {
            ListMaps: () => Promise<MapSetProxy[]>;
          };

          Game: {
            LaunchGame: () => Promise<void>;
          };
        };
      };
    };
  };
}

type Webview2AsyncProperty<T> = T extends (...args: infer Param) => infer Ret
  ? (...args: Param) => Promise<Ret>
  : Promise<T>;

type Webview2Proxy<T extends object> = { [Key in keyof T]: Webview2AsyncProperty<T[Key]> } & {
  sync: () => Promise<T>;
};

type RawObject<T> = T extends Webview2Proxy<infer O> ? O : T;

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

type MapSetProxy = Webview2Proxy<{
  ModeName: string;
  MapList: GameMapProxy[];
}>;
