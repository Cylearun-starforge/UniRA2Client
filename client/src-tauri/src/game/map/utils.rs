use serde_json::Value;

pub fn u64_to_u8(v: u64) -> u8 {
    v.to_le_bytes()[0]
}

pub fn u64_value_to_u8_unchecked(v: &Value) -> u8 {
    u64_to_u8(v.as_u64().unwrap())
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use crate::game::map::utils::u64_value_to_u8_unchecked;

    #[test]
    fn u64_to_u8() {
        let n = json!(8);
        assert_eq!(u64_value_to_u8_unchecked(&n), 8);
    }
}
