use jsonschema::JSONSchema;
use rust_embed::RustEmbed;
use serde_json::Value;

#[derive(RustEmbed)]
#[folder = "../../schemas"]
pub struct Schema;

pub fn load_map_desc_schema() -> JSONSchema {
    let schema = Schema::get("map-desc.json").unwrap().data.to_owned();
    let schema: Value = serde_json::from_slice(&schema).unwrap();
    let result = JSONSchema::compile(&schema);
    result.unwrap()
}
