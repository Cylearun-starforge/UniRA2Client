use crate::schema::load_map_desc_schema;
use std::fs::File;
use std::io;
use std::path::Path;

use serde_json::value::Value as ValueType;
use serde_json::Value;

use super::SpawnLocation;

pub struct MapDescriptor {
    raw: Value,
}

fn u64_to_u8(v: u64) -> u8 {
    v.to_le_bytes()[0]
}

fn u64_value_to_u8_unchecked(v: &Value) -> u8 {
    u64_to_u8(v.as_u64().unwrap())
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

        File::open(desc_dir).ok().and_then(Self::from_reader)
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
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use crate::game::map::map_descriptor::u64_value_to_u8_unchecked;

    #[test]
    fn u64_to_u8() {
        let n = json!(8);
        assert_eq!(u64_value_to_u8_unchecked(&n), 8);
    }
}
