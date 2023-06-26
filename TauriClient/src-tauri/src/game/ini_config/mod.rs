use std::{
    collections::HashMap,
    io::{Result as IoResult, Write},
};

mod launch_config;

pub struct IniConfig {
    pub record: HashMap<String, HashMap<String, String>>,
}

impl IniConfig {
    pub fn serialize<W: Write>(&self, writer: &mut W) -> IoResult<()> {
        for (section_key, section) in self.record.iter() {
            writeln!(writer, "[{}]", section_key)?;
            for (key, value) in section.iter() {
                writeln!(writer, "{}={}", key, value)?;
            }
            writeln!(writer)?;
        }
        Ok(())
    }

    pub fn add_section_config(&mut self, section: String, key: String, value: String) -> &mut Self {
        if !self.record.contains_key(&section) {
            self.record.insert(section.clone(), HashMap::new());
        }

        let ini_section = self
            .record
            .get_mut(&section)
            .expect(format!("Cannot get section [{}]", section).as_str());
        ini_section.insert(key, value);

        self
    }

    #[cfg(test)]
    pub fn expect_contain_section(&self, section: &String) {
        assert!(
            self.record.contains_key(section),
            "expect to contains [{}]",
            section
        )
    }

    #[cfg(test)]
    pub fn expect_contain_key(&self, section: &String, key: &String) {
        self.expect_contain_section(&section);
        assert!(
            self.record.get(section).unwrap().contains_key(key),
            "expect to contains [{}]\n{}=",
            section,
            key
        )
    }

    #[cfg(test)]
    pub fn expect_contain_kv(&self, section: &String, key: &String, value: &String) {
        self.expect_contain_key(section, key);
        assert_eq!(
            self.record.get(section).unwrap().get(key).unwrap(),
            value,
            "expect to contains [{}]\n{}={}",
            section,
            key,
            value
        );
    }
}

impl Default for IniConfig {
    fn default() -> Self {
        Self {
            record: Default::default(),
        }
    }
}

pub struct IniConstFields {
    pub settings: &'static str,
    pub side: &'static str,
    pub color: &'static str,
    pub name: &'static str,
    pub house_countries: &'static str,
    pub house_colors: &'static str,
    pub spawn_locations: &'static str,
    pub house_handicaps: &'static str,
}

pub const INI_CONST_FIELDS: IniConstFields = IniConstFields {
    settings: "Settings",
    side: "Side",
    color: "Color",
    name: "Name",
    house_countries: "HouseCountries",
    house_colors: "HouseColors",
    spawn_locations: "SpawnLocations",
    house_handicaps: "HouseHandicaps",
};

#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use super::IniConfig;

    #[test]
    fn ini_serialization() {
        let mut config = IniConfig {
            record: HashMap::new(),
        };
        let section_key = String::from("TestSection");
        let mut buffer = Vec::<u8>::with_capacity(128);
        config.serialize(&mut buffer).unwrap();
        assert_eq!(buffer.len(), 0);

        config.add_section_config(
            section_key,
            String::from("TestKey"),
            String::from("TestValue"),
        );
        buffer.clear();
        config.serialize(&mut buffer).unwrap();

        let result = String::from_utf8(buffer).unwrap();
        assert_eq!(result, "[TestSection]\nTestKey=TestValue\n\n");
    }

    #[test]
    fn ini_add_config() {
        let mut config = IniConfig {
            record: HashMap::new(),
        };

        let section_key = String::from("TestSection");

        assert_eq!(config.record.len(), 0);
        config.add_section_config(
            section_key.clone(),
            String::from("TestKey"),
            String::from("TestValue"),
        );
        assert_eq!(config.record.len(), 1);

        config.add_section_config(
            section_key.clone(),
            String::from("TestKey2"),
            String::from("TestValue2"),
        );
        assert_eq!(config.record.len(), 1);

        let section = config.record.get(&section_key).unwrap();
        assert_eq!(section.len(), 2)
    }
}
