pub trait CommandDataTransferObject {}

use crate::{
    error::ClientError,
    game::player::{
        base_player::BasePlayer, human_player::HumanPlayer, robot_player::RobotPlayer,
        GameSpawnLocation, GameTeamType,
    },
};

#[derive(PartialEq, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum PlayerType {
    Human,
    Robot,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerDto {
    pub player_type: PlayerType,
    pub spawn_location: u8,
    pub difficulty: u8,
    pub side: u8,
    pub color: u8,
    pub team: GameTeamType,
    pub name: String,
    #[serde(skip)]
    serialization_error: Vec<ClientError>,
}

pub enum ParsedPlayer {
    Human(HumanPlayer),
    Robot(RobotPlayer),
}

impl PlayerDto {
    pub fn get_spawn_location(&mut self) -> GameSpawnLocation {
        let convert_result = match self.spawn_location {
            0 => Ok(GameSpawnLocation::Random),
            1 => Ok(GameSpawnLocation::One),
            2 => Ok(GameSpawnLocation::Two),
            3 => Ok(GameSpawnLocation::Three),
            4 => Ok(GameSpawnLocation::Four),
            5 => Ok(GameSpawnLocation::Five),
            6 => Ok(GameSpawnLocation::Six),
            7 => Ok(GameSpawnLocation::Seven),
            8 => Ok(GameSpawnLocation::Eight),
            _ => Err(ClientError::ArgumentError(format!(
                "Cannot convert {} to GameSpawnLocation",
                self.spawn_location
            ))),
        };

        match convert_result {
            Ok(sl) => sl,
            Err(err) => {
                self.serialization_error.push(err);
                Default::default()
            }
        }
    }

    fn to_robot_player(&mut self) -> Result<RobotPlayer, ClientError> {
        self.serialization_error.clear();
        let try_parse = RobotPlayer {
            base: BasePlayer {
                player_index: 0,
                spawn_location: self.get_spawn_location(),
                side: self.side,
                color: self.color,
                team: self.team,
            },
            difficulty: self.difficulty,
        };

        match self.serialization_error.len() > 0 {
            true => Err(ClientError::BatchError(self.serialization_error.to_owned())),
            false => Ok(try_parse),
        }
    }

    fn to_human_player(&mut self) -> Result<HumanPlayer, ClientError> {
        self.serialization_error.clear();
        let try_parse = HumanPlayer {
            base: BasePlayer {
                player_index: 0,
                spawn_location: self.get_spawn_location(),
                side: self.side,
                color: self.color,
                team: self.team,
            },
            name: self.name.to_owned(),
            human_player_index: 0,
        };

        match self.serialization_error.len() > 0 {
            true => Err(ClientError::BatchError(self.serialization_error.to_owned())),
            false => Ok(try_parse),
        }
    }
    pub fn into_player(&mut self) -> Result<ParsedPlayer, ClientError> {
        if self.player_type == PlayerType::Human {
            self.to_human_player().map(|p| ParsedPlayer::Human(p))
        } else {
            self.to_robot_player().map(|p| ParsedPlayer::Robot(p))
        }
    }
}
