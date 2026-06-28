use std::fmt;

#[derive(Debug, PartialEq)]
pub enum MacAddressError {
    InvalidLength(usize),
    InvalidHex(String),
}

impl fmt::Display for MacAddressError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MacAddressError::InvalidLength(len) => {
                write!(
                    f,
                    "Invalid MAC address length: expected 6 parts, got {}",
                    len
                )
            }
            MacAddressError::InvalidHex(part) => {
                write!(f, "Invalid hexadecimal in MAC address: '{}'", part)
            }
        }
    }
}

#[derive(Debug)]
#[allow(dead_code)]
pub enum NetworkError {
    SocketCreate(std::io::Error),
    BroadcastSet(std::io::Error),
    Send(std::io::Error),
}

impl fmt::Display for NetworkError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            NetworkError::SocketCreate(err) => {
                write!(f, "Failed to create UDP socket: {}", err)
            }
            NetworkError::BroadcastSet(err) => {
                write!(f, "Failed to enable broadcast mode: {}", err)
            }
            NetworkError::Send(err) => {
                write!(f, "Failed to send magic packet: {}", err)
            }
        }
    }
}

#[derive(Debug)]
#[allow(dead_code)]
pub enum WolError {
    MacAddress(MacAddressError),
    Network(NetworkError),
}

impl fmt::Display for WolError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            WolError::MacAddress(err) => write!(f, "{}", err),
            WolError::Network(err) => write!(f, "{}", err),
        }
    }
}

impl From<MacAddressError> for WolError {
    fn from(err: MacAddressError) -> Self {
        WolError::MacAddress(err)
    }
}

impl From<NetworkError> for WolError {
    fn from(err: NetworkError) -> Self {
        WolError::Network(err)
    }
}
