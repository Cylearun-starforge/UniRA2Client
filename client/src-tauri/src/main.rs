// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod command;
mod dto;
mod error;
mod fs;
mod game;
mod logger;
mod schema;

use command::{fs::cmd_get_client_dir, game as game_cmd, lifecycle, util::greet};
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            cmd_get_client_dir,
            game_cmd::cmd_game_add_players,
            game_cmd::cmd_game_load_maps,
            lifecycle::cmd_exit_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
