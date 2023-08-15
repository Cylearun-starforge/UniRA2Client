import { Option, Vec, String, Value, u8 } from "@/types/rust-types";
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

export type PlayerType = "Human" | "Robot";
export type GameTeamType = "EMPTY" | "A" | "B" | "C" | "D";

export interface PlayerDto {
  playerType: PlayerType;
  spawnLocation: u8;
  difficulty: u8;
  side: u8;
  color: u8;
  team: GameTeamType;
  name: String;
}
