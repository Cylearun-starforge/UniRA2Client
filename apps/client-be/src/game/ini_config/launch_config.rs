use std::collections::HashMap;
use std::io::Write;

use super::IniConfig;
use crate::error::ClientError;
use crate::game::player::{GameTeamType, Player, PlayerType};

pub struct LaunchConfig {
    ini: IniConfig,
    human_player_count: u8,
    player_count: u8,
    ready_to_serialize: bool,
    team_record: HashMap<GameTeamType, Vec<u8>>,
}

pub const LAUNCH_CONFIG_MAX_PLAYER: u8 = 8;

impl LaunchConfig {
    pub fn new(ini: IniConfig) -> Self {
        LaunchConfig {
            ini,
            human_player_count: 0,
            player_count: 0,
            ready_to_serialize: false,
            team_record: HashMap::from_iter(vec![
                (GameTeamType::A, Vec::<u8>::default()),
                (GameTeamType::B, Vec::<u8>::default()),
                (GameTeamType::C, Vec::<u8>::default()),
                (GameTeamType::D, Vec::<u8>::default()),
            ]),
        }
    }

    fn not_accept_config_error() -> ClientError {
        ClientError::InvalidOperation(
            "LaunchConfig is ready to serialize, and do not accept new config".to_owned(),
        )
    }

    fn invalid_player_count() -> ClientError {
        ClientError::InvalidOperation("Player count out of range".to_owned())
    }

    pub fn add_player<P: Player>(&mut self, player: &mut P) -> Result<(), ClientError> {
        if self.ready_to_serialize {
            return Err(LaunchConfig::not_accept_config_error());
        }

        if LAUNCH_CONFIG_MAX_PLAYER <= self.player_count {
            return Err(LaunchConfig::invalid_player_count());
        }

        let player_team = player.get_team();
        if player_team != GameTeamType::Empty {
            let record = self.team_record.get_mut(&player_team).unwrap();
            record.push(self.player_count);
        }

        player.set_player_index(self.player_count);
        self.player_count += 1;

        if P::PLAYER_TYPE == PlayerType::HumanPlayer {
            player.set_human_player_index(self.human_player_count);
            self.human_player_count += 1;
        }

        player.add_config_to(&mut self.ini);

        Ok(())
    }

    fn player_index_to_house_ally_key(player_index: u8) -> String {
        match player_index {
            0 => String::from("HouseAllyOne"),
            1 => String::from("HouseAllyTwo"),
            2 => String::from("HouseAllyThree"),
            3 => String::from("HouseAllyFour"),
            4 => String::from("HouseAllyFive"),
            5 => String::from("HouseAllySix"),
            6 => String::from("HouseAllySeven"),
            _ => panic!("player_index {} out of range", player_index),
        }
    }

    fn add_team_to_ini(&mut self) {
        let alliance_to_record = self
            .team_record
            .iter()
            .filter(|(_, alliance)| alliance.len() > 1);

        for (_, alliance) in alliance_to_record {
            for player_index in alliance {
                let rest_player_indexes = alliance.iter().filter(|index| index != &player_index);

                let player_tag = format!("Multi{}_Alliance", player_index + 1);
                for (count, alliance_index) in rest_player_indexes.enumerate() {
                    self.ini.add_section_config(
                        player_tag.to_owned(),
                        Self::player_index_to_house_ally_key(count.try_into().unwrap()),
                        alliance_index.to_string(),
                    );
                }
            }
        }
    }

    pub fn finish_add_config(&mut self) {
        self.add_team_to_ini();
        self.ready_to_serialize = true;
    }

    pub fn serialize<W: Write>(&self, write: &mut W) -> Result<(), ClientError> {
        if self.player_count == 0 {
            return Err(LaunchConfig::invalid_player_count());
        }

        self.ini.serialize(write).map_err(|e| e.into())
    }

    #[cfg(test)]
    pub fn get_team_record(&mut self) -> &mut HashMap<GameTeamType, Vec<u8>> {
        &mut self.team_record
    }
}

impl Default for LaunchConfig {
    fn default() -> Self {
        Self::new(Default::default())
    }
}

#[cfg(test)]
mod tests {

    use super::{LaunchConfig, LAUNCH_CONFIG_MAX_PLAYER};
    use crate::{error::ClientError, game::player::*};

    #[test]
    fn player_count_limit() {
        let mut config = LaunchConfig::new(Default::default());
        let mut buffer = Vec::with_capacity(128);
        match config.serialize(&mut buffer) {
            Ok(_) => assert!(false),
            Err(ClientError::InvalidOperation(_)) => assert!(true),
            Err(_) => assert!(false),
        }
        let mut robot = robot_player::RobotPlayer {
            base: base_player::BasePlayer {
                player_index: 1,
                spawn_location: GameSpawnLocation::Random,
                side: 1,
                color: 1,
                team: GameTeamType::Empty,
            },
            difficulty: 1,
        };

        for _ in 0..LAUNCH_CONFIG_MAX_PLAYER {
            config.add_player(&mut robot).unwrap();
        }

        match config.add_player(&mut robot) {
            Ok(_) => assert!(false),
            Err(ClientError::InvalidOperation(_)) => assert!(true),
            Err(_) => assert!(false),
        }
    }

    #[test]
    fn player_alliance() {
        let mut config = LaunchConfig::default();
        let mut robot_team_empty = robot_player::RobotPlayer::default();

        let mut robot_team_a = robot_player::RobotPlayer::default();
        robot_team_a.set_team(GameTeamType::A);

        let mut robot_team_b = robot_player::RobotPlayer::default();
        robot_team_b.set_team(GameTeamType::B);

        let mut human_team_a = human_player::HumanPlayer::default();
        human_team_a.set_team(GameTeamType::A);
        let mut human_team_a2 = human_player::HumanPlayer::default();
        human_team_a2.set_team(GameTeamType::A);

        let mut human_team_c = human_player::HumanPlayer::default();
        human_team_c.set_team(GameTeamType::C);

        config.add_player(&mut human_team_a).unwrap(); // 0
        config.add_player(&mut robot_team_empty).unwrap(); // 1
        config.add_player(&mut robot_team_a).unwrap(); // 2
        config.add_player(&mut human_team_c).unwrap(); // 3
        config.add_player(&mut human_team_a2).unwrap(); // 4
        config.add_player(&mut robot_team_b).unwrap(); // 5

        let team = config.get_team_record();

        assert_eq!(team.get(&GameTeamType::A).unwrap(), &vec![0, 2, 4]);
        assert_eq!(team.get(&GameTeamType::B).unwrap(), &vec![5]);
        assert_eq!(team.get(&GameTeamType::C).unwrap(), &vec![3]);
        assert_eq!(team.get(&GameTeamType::D).unwrap().len(), 0);
        assert_ne!(config.ini.record.len(), 0);

        config.finish_add_config();

        config.ini.expect_contain_kv(
            &"Multi1_Alliance".to_owned(),
            &"HouseAllyOne".to_owned(),
            &"2".to_owned(),
        );
        config.ini.expect_contain_kv(
            &"Multi1_Alliance".to_owned(),
            &"HouseAllyTwo".to_owned(),
            &"4".to_owned(),
        );

        config.ini.expect_contain_kv(
            &"Multi3_Alliance".to_owned(),
            &"HouseAllyOne".to_owned(),
            &"0".to_owned(),
        );
        config.ini.expect_contain_kv(
            &"Multi3_Alliance".to_owned(),
            &"HouseAllyTwo".to_owned(),
            &"4".to_owned(),
        );

        config.ini.expect_contain_kv(
            &"Multi5_Alliance".to_owned(),
            &"HouseAllyOne".to_owned(),
            &"0".to_owned(),
        );
        config.ini.expect_contain_kv(
            &"Multi5_Alliance".to_owned(),
            &"HouseAllyTwo".to_owned(),
            &"2".to_owned(),
        );
    }

    #[test]
    fn fix_player_index() {
        let mut config = LaunchConfig::new(Default::default());
        let mut robot = robot_player::RobotPlayer {
            base: base_player::BasePlayer {
                player_index: 1,
                spawn_location: GameSpawnLocation::Random,
                side: 1,
                color: 1,
                team: GameTeamType::Empty,
            },
            difficulty: 1,
        };
        let mut human = human_player::HumanPlayer {
            base: base_player::BasePlayer {
                player_index: 0,
                spawn_location: GameSpawnLocation::Random,
                side: 1,
                color: 2,
                team: GameTeamType::Empty,
            },
            name: String::from("Test"),
            human_player_index: 0,
        };

        config.add_player(&mut human).unwrap();
        assert_eq!(human.human_player_index, 0);
        assert_eq!(human.base.player_index, 0);

        config.add_player(&mut robot).unwrap();
        assert_eq!(robot.base.player_index, 1);

        config.add_player(&mut human).unwrap();
        assert_eq!(human.human_player_index, 1);
        assert_eq!(human.base.player_index, 2);
    }
}
