use std::{
    collections::HashMap,
    path::{Path, PathBuf},
};

use serde_json::Value;

use crate::error::ClientError;

use self::{map_data::MapData, map_descriptor::MapDescriptor};
pub mod map_data;
pub mod map_descriptor;
mod utils;

#[derive(Default, serde::Serialize)]
pub struct InlineIni(HashMap<String, HashMap<String, String>>);

#[derive(serde::Serialize)]
#[serde(untagged)]
pub enum MapModeIni {
    Extern(String),
    Inline(InlineIni),
}

impl MapModeIni {
    pub fn from_value(value: &Value) -> Option<MapModeIni> {
        match value {
            Value::String(file) => Some(MapModeIni::Extern(file.to_owned())),
            Value::Object(object) => {
                let mut result = InlineIni::default();
                for (section, value) in object {
                    let mut ini: HashMap<String, String> = Default::default();
                    for (k, v) in value.as_object().unwrap() {
                        ini.insert(k.to_owned(), v.as_str().unwrap().to_owned());
                    }
                    result.0.insert(section.to_owned(), ini);
                }

                Some(MapModeIni::Inline(result))
            }
            _ => None,
        }
    }
}

#[derive(serde::Serialize)]
pub struct SpawnLocation {
    x: u64,
    y: u64,
}

impl SpawnLocation {
    pub fn from_value_unchecked(value: &Value) -> SpawnLocation {
        let x = value.get("x").and_then(Value::as_u64);
        let y = value.get("y").and_then(Value::as_u64);
        SpawnLocation {
            x: x.unwrap(),
            y: y.unwrap(),
        }
    }
}

#[derive(serde::Serialize)]
pub struct Map {
    display_name: String,
    path: String,
    cover: String,
    player_limit: [u8; 2],
    spawn_locations: Vec<SpawnLocation>,
    modes: Vec<MapMode>,
}

#[derive(serde::Serialize)]
pub struct MapMode {
    mode_name: String,
    display_name: Option<String>,
    override_ini: Option<MapModeIni>,
}

impl MapMode {
    pub fn from_value_unchecked(value: &Value) -> MapMode {
        MapMode {
            mode_name: value.get("mode_name").map(|v| v.to_string()).unwrap(),
            display_name: value.get("display_name").map(|v| v.to_string()),
            override_ini: value.get("override_ini").and_then(MapModeIni::from_value),
        }
    }
}

impl Map {
    pub fn from_dir<P: AsRef<Path>>(dir: &P) -> Result<Map, ClientError> {
        let dir = dir.as_ref();
        let mut cover_path = dir.to_path_buf();
        cover_path.set_extension("png");
        let mut desc_dir = dir.to_path_buf();
        desc_dir.set_extension("map-desc.json");
        // ensure!(dir.is_file());
        // ensure!(cover_path.exists());

        let cover_path = cover_path.to_string_lossy();
        let path = dir.to_string_lossy();
        let desc = MapDescriptor::from_dir(&desc_dir);
        let desc = desc.as_ref();
        let map_data = MapData::from_dir(&dir)?;

        Ok(Map {
            display_name: desc
                .and_then(|d| d.display_name())
                .unwrap_or(map_data.display_name()),
            path: path.into_owned(),
            cover: cover_path.into_owned(),
            player_limit: desc
                .and_then(|d| d.player_limit())
                .unwrap_or(map_data.player_limit()),
            modes: desc.and_then(|d| d.game_modes()).unwrap_or(vec![MapMode {
                mode_name: String::from("Standard"),
                display_name: None,
                override_ini: None,
            }]),
            spawn_locations: desc
                .and_then(|d| d.spawn_locations())
                .unwrap_or(map_data.spawn_locations()),
        })
    }
}

pub fn read_maps_from(dir: &PathBuf) -> Result<Vec<Map>, ClientError> {
    dir.metadata()
        .map_err(|error| {
            ClientError::ArgumentError(format!("Cannot read map from {:?}: {:?}", dir, error))
        })
        .and_then(|metadata| {
            if metadata.is_dir() {
                return Ok(());
            }

            Err(ClientError::ArgumentError(format!(
                "{:?} is not a directory",
                dir
            )))
        })
        .and_then(|_| {
            let map_file_filter = dir.join("*.map");
            println!("map filter: {:?}", map_file_filter);
            let iter_maps = glob::glob(map_file_filter.to_str().unwrap());
            iter_maps.map_err(|io_error| {
                ClientError::IoError(format!("read map dir io error: {}", io_error.to_string()))
            })
        })
        .and_then(|iter_dir| {
            let valid_maps = iter_dir.filter_map(|file| {
                if file.is_err() {
                    return None;
                }

                let file = file.unwrap();
                if !Path::is_file(file.as_path()) {
                    return None;
                }

                Map::from_dir(&file).ok()
            });

            Ok(Vec::from_iter(valid_maps))
        })
}
