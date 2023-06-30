use crate::{
    fs,
    logger::{ClientLogger, CONSOLE},
};

#[tauri::command]
pub fn cmd_get_client_dir() -> String {
    let dir = fs::get_client_dir();
    let cwd = dir.to_str().expect("Failed call: to_str");
    CONSOLE.info(format!("get_client_dir: {}", cwd).as_str());
    return String::from(cwd);
}
