// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod commands;
mod error;
mod fs;
mod game;
mod logger;

use commands::{fs::cmd_get_client_dir, game::cmd_game_add_players, util::greet};
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            cmd_get_client_dir,
            cmd_game_add_players
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
