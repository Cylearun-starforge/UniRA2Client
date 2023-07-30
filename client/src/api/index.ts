import { Map } from "@/types/dto";
import { invoke } from "@tauri-apps/api";

export function loadMaps() {
  return invoke<Map[]>("cmd_cmd_game_load_maps");
}
