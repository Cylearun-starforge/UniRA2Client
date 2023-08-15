use std::{
    fmt,
    io::{self},
};

#[derive(Debug, PartialEq, Clone, serde::Serialize)]
#[serde(tag = "errorType", content = "content")]
pub enum ClientError {
    ArgumentError(String),
    InvalidOperation(String),
    IoError(String),
    BatchError(Vec<ClientError>),
}

impl From<io::Error> for ClientError {
    fn from(value: io::Error) -> Self {
        Self::IoError(value.kind().to_string())
    }
}

impl fmt::Display for ClientError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::ArgumentError(message) => write!(f, "{}: {}", self, message),
            Self::InvalidOperation(message) => write!(f, "{}: {}", self, message),
            Self::IoError(kind) => write!(f, "{}: {}", self, kind),
            Self::BatchError(err) => write!(f, "{}: {:?}", self, err),
        }
    }
}
