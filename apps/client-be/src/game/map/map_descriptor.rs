use crate::logger::{self, ClientLogger};
use crate::schema::load_map_desc_schema;
use std::io;
use std::path::Path;
use std::{collections::HashMap, fs::File};

use serde_json::value::Value as ValueType;
use serde_json::Value;

use super::custom_data::CustomData;
use super::{MapMode, SpawnLocation};
use crate::game::map::utils::{u64_to_u8, u64_value_to_u8_unchecked};

pub struct MapDescriptor {
    raw: Value,
}

impl MapDescriptor {
    fn validate_fast(desc: &Value) -> bool {
        let schema = load_map_desc_schema();
        // TODO: use schema.validate() to get full error list, this feature can be controlled by a cmd switch
        if !schema.is_valid(&desc) {
            return false;
        }

        match &desc["player_limit"] {
            ValueType::Array(vec) => {
                u64_value_to_u8_unchecked(&vec[0]) <= u64_value_to_u8_unchecked(&vec[1])
            }
            ValueType::Number(_) => true,
            ValueType::Null => true,
            _ => false,
        }
    }

    pub fn from_reader<R: io::Read>(reader: R) -> Option<MapDescriptor> {
        if let Ok(desc) = serde_json::from_reader::<R, Value>(reader) {
            if Self::validate_fast(&desc) {
                return Some(MapDescriptor { raw: desc });
            }
            return None;
        }
        return None;
    }

    pub fn from_dir<P: AsRef<Path>>(desc_dir: &P) -> Option<MapDescriptor> {
        let desc_dir = desc_dir.as_ref();
        if !Path::exists(desc_dir) {
            return None;
        }

        File::open(desc_dir)
            .map_err(|e| {
                println!("Error open map desc: {}", e);
                e
            })
            .ok()
            .and_then(Self::from_reader)
    }

    pub fn display_name(&self) -> Option<String> {
        self.raw["display_name"].as_str().map(str::to_owned)
    }

    pub fn player_limit(&self) -> Option<[u8; 2]> {
        self.raw
            .get("player_limit")
            .and_then(|player_limit| match player_limit {
                ValueType::Array(player_limit_vec) => Some([
                    u64_value_to_u8_unchecked(&player_limit_vec[0]),
                    u64_value_to_u8_unchecked(&player_limit_vec[1]),
                ]),
                ValueType::Number(max) => Some([1, u64_to_u8(max.as_u64().unwrap())]),
                _ => None,
            })
    }

    pub fn game_modes(&self) -> Option<Vec<MapMode>> {
        self.raw.get("game_modes").and_then(|modes| match modes {
            ValueType::Array(modes) => Some(
                modes
                    .iter()
                    .map(|mode| MapMode::from_value_unchecked(&mode))
                    .collect(),
            ),
            _ => None,
        })
    }

    pub fn spawn_locations(&self) -> Option<Vec<SpawnLocation>> {
        self.raw
            .get("spawn_locations")
            .and_then(|locations| match locations {
                ValueType::Array(locations) => Some(
                    locations
                        .iter()
                        .map(SpawnLocation::from_value_unchecked)
                        .collect(),
                ),
                _ => None,
            })
    }

    pub fn custom_data(&self) -> Option<Vec<CustomData>> {
        self.raw.get("custom_data").and_then(|data| match data {
            ValueType::Array(data) => Some(
                data.iter()
                    .filter_map(|item| {
                        let data = CustomData::from_value(item);
                        if data.is_err() {
                            let err = data.unwrap_err();
                            logger::CONSOLE
                                .warn(format!("Transform CustomData failed: {:?}", err).as_str());
                            return None;
                        }
                        let data = data.unwrap();
                        return Some(data);
                    })
                    .collect(),
            ),
            _ => None,
        })
    }
}
