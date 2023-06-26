use std::{
    fmt,
    io::{self},
};

#[derive(Debug, PartialEq)]
pub enum ClientError {
    ArgumentError,
    InvalidOperation(String),
    IoError(io::ErrorKind),
}

impl From<io::Error> for ClientError {
    fn from(value: io::Error) -> Self {
        Self::IoError(value.kind())
    }
}

impl fmt::Display for ClientError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::IoError(kind) => write!(f, "{}: {}", self, kind),
            Self::InvalidOperation(message) => write!(f, "{}: {}", self, message),
            _ => write!(f, "{}", self),
        }
    }
}
