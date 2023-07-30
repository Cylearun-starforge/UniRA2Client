import { Option, Vec, String, Value } from "@/types/rust-generic-types";
export interface SpawnLocation {
  x: number;
  y: number;
}

export type MapModeExternIniPath = string;
export type MapModeInlineIniSection = Record<string, string>;
export type MapModeInlineIni = Record<string, MapModeInlineIniSection>;
export type MapModeIni = MapModeExternIniPath | MapModeInlineIni;

export interface MapMode {
  mode_name: String;
  display_name: Option<String>;
  override_ini: Option<MapModeIni>;
}

export interface CustomJsonData {
  key: String;
  data: Value;
}

export interface CustomPathData {
  key: String;
  data: String;
}

export type CustomData = CustomJsonData | CustomPathData;

export interface Map {
  display_name: string;
  path: string;
  cover: string;
  player_limit: [number, number];
  spawn_locations: Vec<SpawnLocation>;
  modes: Vec<MapMode>;
  custom_data: Vec<CustomData>;
}
