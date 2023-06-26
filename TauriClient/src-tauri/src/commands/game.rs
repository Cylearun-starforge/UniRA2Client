use crate::game::{
    ini_config::launch_config::{LaunchConfig, LAUNCH_CONFIG_MAX_PLAYER},
    player::{human_player::HumanPlayer, robot_player::RobotPlayer},
};

#[derive(PartialEq, serde::Deserialize)]
enum PlayerType {
    Human,
    Robot,
}

#[derive(serde::Deserialize)]
pub struct PlayerDto {
    player_type: PlayerType,
}

#[tauri::command]
pub fn cmd_game_add_players(players: Vec<PlayerDto>) -> String {
    if players.len() >= LAUNCH_CONFIG_MAX_PLAYER.into() {
        return "Invalid player count".to_owned();
    }
    let mut launch_config = LaunchConfig::new(Default::default());
    for player in players {
        if player.player_type == PlayerType::Human {
            launch_config
                .add_player(&mut HumanPlayer::default())
                .unwrap();
        } else {
            launch_config
                .add_player(&mut RobotPlayer::default())
                .unwrap();
        }
    }

    let mut buffer = Vec::<u8>::with_capacity(128);
    launch_config.finish_add_config();
    launch_config.serialize(&mut buffer).unwrap();

    String::from_utf8(buffer).unwrap()
}
