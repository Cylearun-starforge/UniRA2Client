use tauri::Invoke;

mod fs;
mod game;
mod lifecycle;

#[cfg(debug_assertions)]
pub fn build_handlers() -> impl Fn(Invoke) {
    tauri::generate_handler![
        fs::cmd_get_client_dir,
        game::cmd_game_add_players,
        game::cmd_game_load_maps,
        lifecycle::cmd_exit_app,
    ]
}

#[cfg(not(debug_assertions))]
pub fn build_handlers() -> impl Fn(Invoke) {
    tauri::generate_handler![
        fs::cmd_get_client_dir,
        game::cmd_game_add_players,
        game::cmd_game_load_maps,
        lifecycle::cmd_exit_app,
    ]
}
