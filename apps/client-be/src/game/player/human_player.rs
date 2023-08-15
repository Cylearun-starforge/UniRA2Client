use crate::game::ini_config::{IniConfig, INI_CONST_FIELDS};

use super::{base_player::BasePlayer, Player, PlayerType};

pub struct HumanPlayer {
    pub base: BasePlayer,
    pub name: String,
    // Thanks to WW's stupid design, we must use another index to mark human player
    pub human_player_index: u8,
}

impl HumanPlayer {
    pub fn human_player_tag(&self) -> String {
        format!("Other{}", self.human_player_index)
    }
}

impl Player for HumanPlayer {
    const PLAYER_TYPE: PlayerType = PlayerType::HumanPlayer;

    fn player_tag(&self) -> String {
        self.base.player_tag()
    }

    fn alliance_tag(&self) -> String {
        self.base.alliance_tag()
    }

    fn add_config_to(&self, ini: &mut IniConfig) {
        self.base.add_config_to(ini);
        let player_tag = self.human_player_tag();
        let is_self = self.human_player_index == 0;
        if is_self {
            ini.add_section_config(
                INI_CONST_FIELDS.settings.to_owned(),
                INI_CONST_FIELDS.name.to_owned(),
                self.name.to_owned(),
            )
            .add_section_config(
                INI_CONST_FIELDS.settings.to_owned(),
                INI_CONST_FIELDS.color.to_owned(),
                self.base.color.to_string(),
            )
            .add_section_config(
                INI_CONST_FIELDS.settings.to_owned(),
                INI_CONST_FIELDS.side.to_owned(),
                self.base.side.to_string(),
            );
        } else {
            ini.add_section_config(
                player_tag.to_owned(),
                INI_CONST_FIELDS.name.to_owned(),
                self.name.to_owned(),
            )
            .add_section_config(
                player_tag.to_owned(),
                INI_CONST_FIELDS.color.to_owned(),
                self.base.color.to_string(),
            )
            .add_section_config(
                player_tag.to_owned(),
                INI_CONST_FIELDS.side.to_owned(),
                self.base.side.to_string(),
            );
        }
    }

    fn get_human_player_index(&self) -> u8 {
        self.human_player_index
    }

    fn get_player_index(&self) -> u8 {
        self.base.get_player_index()
    }

    fn set_human_player_index(&mut self, human_player_index: u8) {
        self.human_player_index = human_player_index;
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

impl Default for HumanPlayer {
    fn default() -> Self {
        Self {
            base: Default::default(),
            name: Default::default(),
            human_player_index: Default::default(),
        }
    }
}
