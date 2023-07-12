use serde::{de::Visitor, Deserialize};
use std::{
    fmt::format,
    fs::File,
    io::{self, BufRead, BufReader, Read},
    path::Path,
};
use tauri::{regex::Regex, utils::io::read_line};

use crate::error::ClientError;

use super::SpawnLocation;

#[derive(serde::Deserialize)]
#[serde(rename_all(deserialize = "PascalCase"))]
struct MapBasicSection {
    name: String,
    max_player: u8,
    min_player: u8,
}

#[derive(serde::Deserialize)]
#[serde(rename_all(deserialize = "PascalCase"))]
struct MapHeaderSection {
    width: i32,
    height: i32,
    start_x: i32,
    start_y: i32,
    waypoint1: MapWayPointValue,
    waypoint2: MapWayPointValue,
    waypoint3: MapWayPointValue,
    waypoint4: MapWayPointValue,
    waypoint5: MapWayPointValue,
    waypoint6: MapWayPointValue,
    waypoint7: MapWayPointValue,
    waypoint8: MapWayPointValue,
    number_starting_points: u8,
}

#[derive(PartialEq, Eq, Debug, Clone)]
struct MapWayPointValue(u16, u16);
struct MapWayPointValueVisitor;

impl<'de> Visitor<'de> for MapWayPointValueVisitor {
    type Value = MapWayPointValue;

    fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
        formatter.write_str(
            "A string looks like: {i32},{i32}. {i32} is an integer between -2^31 and 2^31",
        )
    }

    fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
    where
        E: serde::de::Error,
    {
        let pair = v.split(',');

        let pair = pair
            .map(|c| c.trim())
            .filter_map(|str| str.parse::<u16>().ok());

        let pair = Vec::from_iter(pair);

        if pair.len() != 2 {
            return Err(E::custom("INVALID_FORMAT"));
        }
        Ok(MapWayPointValue(pair[0], pair[1]))
    }
}

impl<'de> Deserialize<'de> for MapWayPointValue {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        deserializer.deserialize_str(MapWayPointValueVisitor)
    }
}

impl Into<SpawnLocation> for MapWayPointValue {
    fn into(self) -> SpawnLocation {
        SpawnLocation {
            x: self.0.into(),
            y: self.1.into(),
        }
    }
}

/// Data read from a `.map` file
#[derive(serde::Deserialize)]
#[serde(rename_all(deserialize = "PascalCase"))]
pub struct MapData {
    header: MapHeaderSection,
    basic: MapBasicSection,
}

impl MapData {
    /// Read ini section from reader. This method will seek from current fp.
    fn read_section_from<R: io::Read>(
        section: &str,
        line_iter: &mut io::Lines<BufReader<R>>,
    ) -> Result<Vec<u8>, ClientError> {
        let mut buffer = Vec::<u8>::with_capacity(512);
        let mut match_section = false;
        loop {
            match line_iter.next() {
                None => {
                    if buffer.len() == 0 {
                        return Err(ClientError::ArgumentError(format!(
                            "Unexpected EOF: cannot find [{}]",
                            section
                        )));
                    }
                    return Ok(buffer);
                }
                Some(line) => {
                    if line.is_err() {
                        return Err(ClientError::IoError(line.unwrap_err().to_string()));
                    }

                    let mut line = line.unwrap();
                    if line.trim().len() == 0 {
                        continue;
                    }
                    if match_section {
                        let regex = Regex::new("[.+]").unwrap();
                        if regex.is_match(&line) {
                            return Ok(buffer);
                        }
                        unsafe {
                            buffer.append(line.as_mut_vec());
                        }
                        continue;
                    }

                    let regex = Regex::new(format!("[{}]", section).as_str());
                    if regex.is_err() {
                        return Err(ClientError::ArgumentError(regex.unwrap_err().to_string()));
                    }

                    match_section = regex.unwrap().is_match(&line);
                    unsafe {
                        buffer.append(line.as_mut_vec());
                    }
                }
            }
        }
    }

    pub fn from_dir_unchecked<P: AsRef<Path>>(dir: &P) -> MapData {
        println!("from_dir_unchecked: {:?}", dir.as_ref());
        let file = File::open(dir.as_ref()).expect("Cannot read map");
        let mut buf = vec![];
        let mut reader = BufReader::new(file);
        reader.read_to_end(&mut buf).unwrap();
        let content = String::from_utf8_lossy(&buf);
        serde_ini::from_str(&content).unwrap()
    }

    pub fn display_name(&self) -> String {
        match self.basic.name.find(')') {
            None => self.basic.name.to_owned(),
            Some(index) => self.basic.name.get(index + 1..).unwrap().to_owned(),
        }
    }
    pub fn player_limit(&self) -> [u8; 2] {
        [
            self.header.number_starting_points as u8,
            self.header.number_starting_points as u8,
        ]
    }

    pub fn spawn_locations(&self) -> Vec<SpawnLocation> {
        let player_count = self.header.number_starting_points.into();
        let waypoints = vec![
            &self.header.waypoint1,
            &self.header.waypoint2,
            &self.header.waypoint3,
            &self.header.waypoint4,
            &self.header.waypoint5,
            &self.header.waypoint6,
            &self.header.waypoint7,
            &self.header.waypoint8,
        ];

        let mut result: Vec<SpawnLocation> = Vec::with_capacity(player_count);
        for i in 0..player_count {
            result.push(waypoints[i].clone().into());
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use crate::game::map::map_data::{MapBasicSection, MapData};

    use super::{MapHeaderSection, MapWayPointValue};

    #[derive(serde::Deserialize)]
    struct Model {
        key: MapWayPointValue,
    }
    const INI: &'static str = "key= 114  ,   514 ";

    #[test]
    fn parse_valid_waypoint() {
        let model: Model = serde_ini::from_str(INI).unwrap();
        assert_eq!(model.key.0, 114);
        assert_eq!(model.key.1, 514);
    }

    #[test]
    fn parse_invalid_waypoint() {
        fn parse_ini_expect_error(ini: &str, message: &str) {
            let model = serde_ini::from_str::<Model>(ini);
            assert_eq!(
                model.err().map(|e| {
                    if let serde_ini::de::Error::Custom(msg) = e {
                        return msg;
                    }

                    e.to_string()
                }),
                Some(String::from("INVALID_FORMAT")),
                "case: {}",
                message
            );
        }

        parse_ini_expect_error("key= 114, 12, 45", "More than 2 values");
        parse_ini_expect_error("key=1145141919810", "Only 1 value");
        parse_ini_expect_error("key=test", "Not a number");
        parse_ini_expect_error(
            "key=11451419198101145141919810114514191981011451419198101145141919810",
            "Out of range",
        );
    }

    const MAP_HEADER: &'static str = r#"
                                    Width=73
                                    Height=61
                                    StartX=219
                                    StartY=44
                                    Waypoint1=279,87
                                    Waypoint2=233,57
                                    Waypoint3=0,0
                                    Waypoint4=0,0
                                    Waypoint5=0,0
                                    Waypoint6=0,0
                                    Waypoint7=0,0
                                    Waypoint8=0,0
                                    NumberStartingPoints=2"#;

    #[test]
    fn parse_map_header_section() {
        let header = serde_ini::from_str::<MapHeaderSection>(MAP_HEADER).unwrap();
        assert_eq!(header.width, 73);
        assert_eq!(header.height, 61);
        assert_eq!(header.start_x, 219);
        assert_eq!(header.start_y, 44);
        assert_eq!(header.waypoint1, MapWayPointValue(279, 87));
        assert_eq!(header.waypoint2, MapWayPointValue(233, 57));
        assert_eq!(header.waypoint3, MapWayPointValue(0, 0));
        assert_eq!(header.waypoint4, MapWayPointValue(0, 0));
        assert_eq!(header.waypoint5, MapWayPointValue(0, 0));
        assert_eq!(header.waypoint6, MapWayPointValue(0, 0));
        assert_eq!(header.waypoint7, MapWayPointValue(0, 0));
        assert_eq!(header.waypoint8, MapWayPointValue(0, 0));
        assert_eq!(header.number_starting_points, 2);
    }

    const MAP_BASIC: &'static str = r#"
                                    Name=(2) Action Reaction
                                    Percent=0
                                    GameMode=Standard,No Bases,Tech Share,Infantry Only
                                    HomeCell=98
                                    InitTime=10000
                                    Official=yes
                                    EndOfGame=no
                                    FreeRadar=no
                                    MaxPlayer=2
                                    MinPlayer=2"#;

    #[test]
    fn parse_map_basic_section() {
        let basic = serde_ini::from_str::<MapBasicSection>(MAP_BASIC).unwrap();
        assert_eq!(basic.name, String::from("(2) Action Reaction"));
        assert_eq!(basic.max_player, 2);
        assert_eq!(basic.min_player, 2);
    }

    const MAP: &'static str = r#"
[Header]
Width=73
Height=61
StartX=219
StartY=44
Waypoint1=279,87
Waypoint2=233,57
Waypoint3=0,0
Waypoint4=0,0
Waypoint5=0,0
Waypoint6=0,0
Waypoint7=0,0
Waypoint8=0,0
NumberStartingPoints=2                
             
[Basic]
Name=(2) Action Reaction
Percent=0
GameMode=Standard,No Bases,Tech Share,Infantry Only
HomeCell=98
InitTime=10000
Official=yes
EndOfGame=no
FreeRadar=no
MaxPlayer=2
MinPlayer=2
SkipScore=no
TrainCrate=no
TruckCrate=no
AltHomeCell=99
OneTimeOnly=no
CarryOverCap=0
NewINIFormat=4
NextScenario=
SkipMapSelect=no
CarryOverMoney=0.000000
AltNextScenario=
MultiplayerOnly=1
IceGrowthEnabled=yes
VeinGrowthEnabled=yes
TiberiumGrowthEnabled=yes
IgnoreGlobalAITriggers=no
TiberiumDeathToVisceroid=no
"#;

    #[test]
    fn parse_map_data() {
        let basic = serde_ini::from_str::<MapData>(MAP).unwrap();
        assert_eq!(basic.display_name(), String::from(" Action Reaction"));
        assert_eq!(basic.player_limit(), [2, 2]);
    }
}
