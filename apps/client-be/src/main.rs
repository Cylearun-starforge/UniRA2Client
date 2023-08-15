// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod command;
mod dto;
mod error;
mod fs;
mod game;
mod logger;
mod menu;
mod schema;

use command::build_handlers;
use tauri::SystemTray;

fn main() {
    let menu = menu::build_context_menu();
    let system_tray = SystemTray::new().with_menu(menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .invoke_handler(build_handlers())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
