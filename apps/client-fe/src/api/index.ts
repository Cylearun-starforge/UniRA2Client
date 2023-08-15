import { Map, PlayerDto } from "@/types/dto";
import { invoke } from "@tauri-apps/api";

export function loadMaps() {
  return invoke<Map[]>("cmd_game_load_maps");
}

export function closeApp() {
  return invoke("cmd_exit_app");
}

export function toggleDevtools() {
  return invoke("toggle_devtools");
}

export function addPlayers(players: PlayerDto[]) {
  return invoke(" cmd_game_add_players", {
    players,
  });
}
