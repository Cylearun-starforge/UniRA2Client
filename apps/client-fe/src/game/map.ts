import { GameMode } from "./options";

export const GameMapSatelliteObjectTypes = [
  "player",
  "ore",
  "tech-oil",
  "tech-building",
  "text",
] as const;

type GameMapSatelliteObjectType = typeof GameMapSatelliteObjectTypes[number];

type Location = `${number}px` | `${number}%`;

export type GameMapSatelliteObject = {
  x: Location;
  y: Location;
  type: GameMapSatelliteObjectType;
  extraText?: string;
};

export type GameMapSatellite = {
  image: string;
  objects: GameMapSatelliteObject[];
};

type RemovePromise<T> = T extends Promise<infer V> ? V : never;

export type GameMapSet = RemovePromise<
  ReturnType<typeof UniRA2Api.map.listMaps>
>[number];

export type GameMap = RemovePromise<GameMapSet['mapList']>[number]
