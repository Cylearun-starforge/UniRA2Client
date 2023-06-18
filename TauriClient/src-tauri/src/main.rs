// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod commands;
mod fs;
mod logger;

use commands::{fs::cmd_get_client_dir, util::greet};
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, cmd_get_client_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
