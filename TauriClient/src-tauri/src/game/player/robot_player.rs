use crate::game::ini_config::{IniConfig, INI_CONST_FIELDS};

use super::{base_player::BasePlayer, Player, PlayerType};

pub struct RobotPlayer {
    pub base: BasePlayer,
    pub difficulty: u8,
}

impl Player for RobotPlayer {
    const PLAYER_TYPE: PlayerType = PlayerType::RobotPlayer;

    fn player_tag(&self) -> String {
        self.base.player_tag()
    }

    fn alliance_tag(&self) -> String {
        self.base.alliance_tag()
    }

    fn add_config_to(&self, ini: &mut IniConfig) {
        self.base.add_config_to(ini);
        let player_tag = self.player_tag();
        ini.add_section_config(
            INI_CONST_FIELDS.house_countries.to_owned(),
            player_tag.to_owned(),
            self.base.side.to_string(),
        )
        .add_section_config(
            INI_CONST_FIELDS.house_colors.to_owned(),
            player_tag.to_owned(),
            self.base.color.to_string(),
        )
        .add_section_config(
            INI_CONST_FIELDS.house_handicaps.to_owned(),
            player_tag,
            self.difficulty.to_string(),
        );
    }

    fn get_human_player_index(&self) -> u8 {
        self.base.get_human_player_index()
    }

    fn get_player_index(&self) -> u8 {
        self.base.get_player_index()
    }

    fn set_human_player_index(&mut self, human_player_index: u8) {
        self.base.set_human_player_index(human_player_index)
    }

    fn set_player_index(&mut self, player_index: u8) {
        self.base.set_player_index(player_index)
    }

    fn get_team(&self) -> super::GameTeamType {
        self.base.get_team()
    }

    fn set_team(&mut self, team: super::GameTeamType) {
        self.base.set_team(team)
    }
}

impl Default for RobotPlayer {
    fn default() -> Self {
        Self {
            base: Default::default(),
            difficulty: 0,
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::game::player::{GameSpawnLocation, GameTeamType};

    use super::*;

    #[test]
    fn serialize_robot_player() {
        let player = RobotPlayer {
            base: BasePlayer {
                player_index: 0,
                spawn_location: GameSpawnLocation::Random,
                side: 0,
                color: 0,
                team: GameTeamType::Empty,
            },
            difficulty: 0,
        };

        let mut ini: IniConfig = Default::default();
        player.add_config_to(&mut ini);
        let player_tag = player.player_tag();
        ini.expect_contain_kv(
            &INI_CONST_FIELDS.house_countries.to_owned(),
            &player_tag,
            &player.base.side.to_string(),
        );

        ini.expect_contain_kv(
            &INI_CONST_FIELDS.house_colors.to_owned(),
            &player_tag,
            &player.base.color.to_string(),
        );

        ini.expect_contain_kv(
            &INI_CONST_FIELDS.house_handicaps.to_owned(),
            &player_tag,
            &player.difficulty.to_string(),
        );
    }
}
