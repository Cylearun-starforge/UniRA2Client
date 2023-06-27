use crate::error::ClientError;

use super::ini_config::IniConfig;

pub mod base_player;
pub mod human_player;
pub mod robot_player;

pub trait Player {
    const PLAYER_TYPE: PlayerType;

    fn player_tag(&self) -> String;
    fn alliance_tag(&self) -> String;
    fn add_config_to(&self, ini: &mut IniConfig);

    fn get_player_index(&self) -> u8;
    fn set_player_index(&mut self, player_index: u8);
    fn get_human_player_index(&self) -> u8;
    fn set_human_player_index(&mut self, human_player_index: u8);
    fn get_team(&self) -> GameTeamType;
    fn set_team(&mut self, team: GameTeamType);
}

#[derive(Clone, Copy, PartialEq, Eq, Hash, serde::Deserialize)]
pub enum GameTeamType {
    #[serde(rename(deserialize = "UPPERCASE"))]
    Empty,
    A,
    B,
    C,
    D,
}

#[derive(PartialEq, Clone, Copy)]
pub enum GameSpawnLocation {
    Random,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
}

impl Default for GameSpawnLocation {
    fn default() -> Self {
        Self::Random
    }
}

impl From<u8> for GameSpawnLocation {
    fn from(value: u8) -> Self {
        match value {
            0 => Self::Random,
            1 => Self::One,
            2 => Self::Two,
            3 => Self::Three,
            4 => Self::Four,
            5 => Self::Five,
            6 => Self::Six,
            7 => Self::Seven,
            8 => Self::Eight,
            _ => panic!("Cannot convert {} to GameSpawnLocation", value),
        }
    }
}

impl Into<u8> for GameSpawnLocation {
    fn into(self) -> u8 {
        match self {
            Self::Random => 0,
            Self::One => 1,
            Self::Two => 2,
            Self::Three => 3,
            Self::Four => 4,
            Self::Five => 5,
            Self::Six => 6,
            Self::Seven => 7,
            Self::Eight => 8,
        }
    }
}

#[derive(PartialEq)]
pub enum PlayerType {
    HumanPlayer,
    RobotPlayer,
}
