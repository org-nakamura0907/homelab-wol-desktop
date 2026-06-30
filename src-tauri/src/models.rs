use serde::{Deserialize, Serialize};

/// Wake-on-LAN の対象デバイス。`devices.json` に永続化される。
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Device {
    pub name: String,
    pub mac: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub host: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group: Option<String>,
}

/// `settings.json` に永続化されるアプリ設定。
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AppSettings {
    pub broadcast_addr: String,
    pub udp_port: u16,
    pub repeat_count: u8,
    pub confirm_on_wake: bool,
    pub notify_on_success: bool,
    pub auto_ping: bool,
    pub log_activity: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            broadcast_addr: "255.255.255.255".to_string(),
            udp_port: 9,
            repeat_count: 1,
            confirm_on_wake: false,
            notify_on_success: true,
            auto_ping: false,
            log_activity: true,
        }
    }
}
