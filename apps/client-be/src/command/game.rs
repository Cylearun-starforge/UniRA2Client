use crate::{
    dto::ParsedPlayer,
    dto::PlayerDto,
    error::ClientError,
    fs,
    game::{
        ini_config::launch_config::{LaunchConfig, LAUNCH_CONFIG_MAX_PLAYER},
        map::{read_maps_from, Map},
        player::{human_player::HumanPlayer, robot_player::RobotPlayer},
    },
};

#[tauri::command]
pub fn cmd_game_add_players(players: Vec<PlayerDto>) -> Result<String, ClientError> {
    if players.len() >= LAUNCH_CONFIG_MAX_PLAYER.into() {
        return Err(ClientError::InvalidOperation(
            "Invalid player count".to_owned(),
        ));
    }
    let mut launch_config = LaunchConfig::new(Default::default());
    let mut errs = Vec::<ClientError>::with_capacity(8);
    for mut player in players {
        player
            .into_player()
            .and_then(|p| {
                match p {
                    ParsedPlayer::Human(mut player) => launch_config.add_player(&mut player),
                    ParsedPlayer::Robot(mut player) => launch_config.add_player(&mut player),
                };
                Ok(())
            })
            .or_else(|e| {
                errs.push(e);
                Err(())
            });
    }
    if errs.len() > 0 {
        return Err(ClientError::BatchError(errs.to_owned()));
    }
    let mut buffer = Vec::<u8>::with_capacity(128);
    launch_config.finish_add_config();
    launch_config.serialize(&mut buffer).and_then(|_| {
        String::from_utf8(buffer).map_err(|e| ClientError::InvalidOperation(e.to_string()))
    })
}

#[tauri::command]
pub fn cmd_game_load_maps() -> Result<Vec<Map>, ClientError> {
    let map_dir = fs::get_map_dir();
    read_maps_from(&map_dir)
}
