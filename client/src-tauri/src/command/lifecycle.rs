use tauri;

use crate::logger::{ClientLogger, CONSOLE};

#[tauri::command]
pub fn cmd_exit_app(app: tauri::AppHandle) -> () {
    CONSOLE.info(format!("Exit app with code 0").as_str());
    app.exit(0);
}
