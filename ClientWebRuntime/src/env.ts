import { MapSetProxy } from './game';
type Webview2AsyncProperty<T> = T extends (...args: infer Param) => infer Ret
  ? (...args: Param) => Promise<Ret>
  : Promise<T>;

/** @public */
export type Webview2Proxy<T extends object> = { [Key in keyof T]: Webview2AsyncProperty<T[Key]> } & {
  sync: () => Promise<T>;
};

export type RawObject<T> = T extends Webview2Proxy<infer O> ? O : T;

export const runtime: {
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
} = (window as any).chrome.webview.hostObjects.runtime;
