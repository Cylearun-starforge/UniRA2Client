use std::path::{Path, PathBuf};

use crate::error::ClientError;

use self::{map_data::MapData, map_descriptor::MapDescriptor};
pub mod map_data;
pub mod map_descriptor;

#[derive(serde::Serialize)]
pub struct SpawnLocation {
    x: u8,
    y: u8,
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
pub struct MapMode;

impl Map {
    pub fn from_dir_unchecked<P: AsRef<Path>>(dir: &P) -> Map {
        let dir = dir.as_ref();
        let mut cover_path = dir.to_path_buf();
        cover_path.set_extension("png");
        let mut desc_dir = dir.to_path_buf();
        desc_dir.set_extension("map-desc.json");
        // ensure!(dir.is_file());
        // ensure!(cover_path.exists());

        let cover_path = cover_path.to_str().unwrap().to_owned();
        let path = dir.to_str().unwrap().to_owned();
        let desc = MapDescriptor::from_dir(&desc_dir);
        let desc = desc.as_ref();
        let map_data = MapData::from_dir_unchecked(&dir);
        Map {
            display_name: desc
                .and_then(|d| d.display_name())
                .unwrap_or(map_data.display_name()),
            path,
            cover: cover_path,
            player_limit: desc
                .and_then(|d| d.player_limit())
                .unwrap_or(map_data.player_limit()),
            modes: Vec::default(),
            spawn_locations: Vec::default(),
        }
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

                Some(Map::from_dir_unchecked(&file))
            });

            Ok(Vec::from_iter(valid_maps))
        })
}
