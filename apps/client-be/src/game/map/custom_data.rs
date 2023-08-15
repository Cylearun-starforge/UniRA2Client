use serde_json::{Map, Value};

use crate::{error::ClientError, fs};

#[derive(serde::Serialize, Debug)]
pub struct JsonData {
    key: String,
    data: Value,
}

#[derive(serde::Serialize, Debug)]
pub struct PathData {
    key: String,
    data: String,
}

#[derive(serde::Serialize, Debug)]
pub enum CustomData {
    Json(JsonData),
    RelPath(PathData),
}

impl CustomData {
    fn get_string(value: &Map<String, Value>, key: &str) -> Result<String, ClientError> {
        value
            .get(key)
            .ok_or(ClientError::ArgumentError(format!(
                "\"{}\" not exists in object",
                key
            )))?
            .as_str()
            .map(|str| str.to_owned())
            .ok_or(ClientError::ArgumentError(format!(
                "\"{}\" should be a string",
                key
            )))
    }
    pub fn from_value(value: &Value) -> Result<CustomData, ClientError> {
        let value = value
            .as_object()
            .ok_or(ClientError::ArgumentError(String::from(
                "value is not object",
            )))?;

        let key = CustomData::get_string(&value, "key")?;
        let data_type = CustomData::get_string(&value, "type")?;

        if data_type == "rel_path" {
            let data = CustomData::get_string(&value, "data")?;
            let mut dir = fs::get_client_dir();
            dir.push(data);
            let path_str = dir
                .to_str()
                .map(|str| str.to_owned())
                .ok_or(ClientError::IoError(format!("invalid path: {:?}", dir)))?;
            return Ok(CustomData::RelPath(PathData {
                key,
                data: path_str,
            }));
        } else if data_type == "json" {
            let data = value
                .get("data")
                .ok_or(ClientError::ArgumentError(String::from(
                    "\"data\" not exists in object",
                )))?
                .clone();
            return Ok(CustomData::Json(JsonData { key, data }));
        }

        unreachable!();
    }
}
