use crate::game::ini_config::{IniConfig, INI_CONST_FIELDS};

use super::{GameSpawnLocation, GameTeamType, Player, PlayerType};

pub struct BasePlayer {
    pub player_index: u8,
    pub spawn_location: GameSpawnLocation,
    pub side: u8,
    pub color: u8,
    pub team: GameTeamType,
}

impl Player for BasePlayer {
    const PLAYER_TYPE: PlayerType = PlayerType::RobotPlayer;

    fn player_tag(&self) -> String {
        format!("Multi{}", self.player_index + 1)
    }

    fn alliance_tag(&self) -> String {
        format!("{}_Alliances", self.player_tag())
    }

    fn add_config_to(&self, ini: &mut IniConfig) {
        if self.spawn_location == GameSpawnLocation::Random {
            return;
        }

        let player_tag = self.player_tag();
        let location: u8 = self.spawn_location.into();
        ini.add_section_config(
            INI_CONST_FIELDS.spawn_locations.to_owned(),
            player_tag,
            location.to_string(),
        );
    }

    fn get_player_index(&self) -> u8 {
        self.player_index
    }

    fn get_human_player_index(&self) -> u8 {
        panic!("You are calling an abstract method")
    }

    fn set_human_player_index(&mut self, _human_player_index: u8) {
        panic!("You are calling an abstract method")
    }

    fn set_player_index(&mut self, player_index: u8) {
        self.player_index = player_index;
    }

    fn get_team(&self) -> GameTeamType {
        self.team
    }

    fn set_team(&mut self, team: GameTeamType) {
        self.team = team;
    }
}

impl Default for BasePlayer {
    fn default() -> Self {
        Self {
            player_index: Default::default(),
            spawn_location: GameSpawnLocation::Random,
            side: Default::default(),
            color: Default::default(),
            team: GameTeamType::Empty,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    impl BasePlayer {
        pub fn new_player(spawn_location: GameSpawnLocation) -> BasePlayer {
            BasePlayer {
                player_index: 1,
                spawn_location,
                side: 1,
                color: 1,
                team: GameTeamType::Empty,
            }
        }
    }

    #[test]
    fn add_base_player_to_config() {
        let player = BasePlayer::new_player(GameSpawnLocation::One);
        assert_eq!(player.player_tag(), "Multi2");
        assert_eq!(player.alliance_tag(), "Multi2_Alliances");
        let mut ini = IniConfig {
            record: Default::default(),
        };
        player.add_config_to(&mut ini);

        assert_eq!(ini.record.len(), 1);
        ini.expect_contain_kv(
            &INI_CONST_FIELDS.spawn_locations.to_owned(),
            &"Multi2".to_owned(),
            &"1".to_owned(),
        );
    }

    #[test]
    fn never_add_random_location() {
        let player = BasePlayer::new_player(GameSpawnLocation::Random);
        let mut ini = IniConfig {
            record: Default::default(),
        };
        player.add_config_to(&mut ini);

        assert_eq!(ini.record.len(), 0);
    }
}
