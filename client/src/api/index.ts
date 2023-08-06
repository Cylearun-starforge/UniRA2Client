import { Map } from "@/types/dto";
import { invoke } from "@tauri-apps/api";

export function loadMaps() {
  return invoke<Map[]>("cmd_game_load_maps");
}

export function closeApp() {
  invoke("cmd_exit_app");
}
