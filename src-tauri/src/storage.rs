use crate::models::{AppSettings, Device};
use std::fs;
use std::path::Path;

/// `devices` を `dir/devices.json` に保存する。`dir` が存在しない場合は作成する。
pub fn save_devices_to(dir: &Path, devices: &[Device]) -> Result<(), String> {
    if !dir.exists() {
        fs::create_dir_all(dir).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string_pretty(devices).map_err(|e| e.to_string())?;
    fs::write(dir.join("devices.json"), json).map_err(|e| e.to_string())
}

/// `dir/devices.json` からデバイス一覧を読み込む。ファイルが存在しない場合は空の `Vec` を返す。
pub fn load_devices_from(dir: &Path) -> Result<Vec<Device>, String> {
    let path = dir.join("devices.json");
    if !path.exists() {
        return Ok(vec![]);
    }
    let json = fs::read_to_string(path).map_err(|e| e.to_string())?;
    serde_json::from_str(&json).map_err(|e| e.to_string())
}

/// `settings` を `dir/settings.json` に保存する。`dir` が存在しない場合は作成する。
pub fn save_settings_to(dir: &Path, settings: &AppSettings) -> Result<(), String> {
    if !dir.exists() {
        fs::create_dir_all(dir).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    fs::write(dir.join("settings.json"), json).map_err(|e| e.to_string())
}

/// `dir/settings.json` から設定を読み込む。ファイルが存在しない場合は `AppSettings::default()` を返す。
pub fn load_settings_from(dir: &Path) -> Result<AppSettings, String> {
    let path = dir.join("settings.json");
    if !path.exists() {
        return Ok(AppSettings::default());
    }
    let json = fs::read_to_string(path).map_err(|e| e.to_string())?;
    serde_json::from_str(&json).map_err(|e| e.to_string())
}

/// `devices.json` の `index` 番目のデバイスを置き換える。ファイルが無い、または `index` が範囲外の場合はエラー。
pub fn update_device_in(dir: &Path, index: usize, device: Device) -> Result<(), String> {
    let path = dir.join("devices.json");
    if !path.exists() {
        return Err("No devices file found".to_string());
    }
    let json = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let mut devices: Vec<Device> = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    if index >= devices.len() {
        return Err(format!("Device index {} out of range", index));
    }
    devices[index] = device;
    let updated_json = serde_json::to_string_pretty(&devices).map_err(|e| e.to_string())?;
    fs::write(&path, &updated_json).map_err(|e| e.to_string())
}

/// `devices.json` から `index` 番目のデバイスを削除する。ファイルが無い、または `index` が範囲外の場合はエラー。
pub fn delete_device_from(dir: &Path, index: usize) -> Result<(), String> {
    let path = dir.join("devices.json");
    if !path.exists() {
        return Err("No devices file found".to_string());
    }
    let json = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let mut devices: Vec<Device> = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    if index >= devices.len() {
        return Err(format!("Device index {} out of range", index));
    }
    devices.remove(index);
    let updated_json = serde_json::to_string_pretty(&devices).map_err(|e| e.to_string())?;
    fs::write(&path, &updated_json).map_err(|e| e.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    fn make_device(name: &str, mac: &str) -> Device {
        Device {
            name: name.into(),
            mac: mac.into(),
            ip: None,
            host: None,
            group: None,
        }
    }

    #[test]
    fn test_load_devices_empty_when_no_file() {
        let dir = tempdir().unwrap();
        let result = load_devices_from(dir.path()).unwrap();
        assert!(result.is_empty());
    }

    #[test]
    fn test_save_and_load_devices() {
        let dir = tempdir().unwrap();
        let devices = vec![
            make_device("Server 1", "00:11:22:33:44:55"),
            make_device("Server 2", "AA:BB:CC:DD:EE:FF"),
        ];

        save_devices_to(dir.path(), &devices).unwrap();
        let loaded = load_devices_from(dir.path()).unwrap();

        assert_eq!(loaded.len(), 2);
        assert_eq!(loaded[0].name, "Server 1");
        assert_eq!(loaded[0].mac, "00:11:22:33:44:55");
        assert_eq!(loaded[1].name, "Server 2");
        assert_eq!(loaded[1].mac, "AA:BB:CC:DD:EE:FF");
    }

    #[test]
    fn test_save_creates_directory() {
        let base = tempdir().unwrap();
        let dir = base.path().join("nested").join("subdir");

        save_devices_to(&dir, &[]).unwrap();

        assert!(dir.join("devices.json").exists());
    }

    #[test]
    fn test_save_and_load_device_with_optional_fields() {
        let dir = tempdir().unwrap();
        let devices = vec![Device {
            name: "NAS".into(),
            mac: "AA:BB:CC:DD:EE:FF".into(),
            ip: Some("192.168.1.10".into()),
            host: Some("nas.local".into()),
            group: Some("storage".into()),
        }];

        save_devices_to(dir.path(), &devices).unwrap();
        let loaded = load_devices_from(dir.path()).unwrap();

        assert_eq!(loaded[0].ip.as_deref(), Some("192.168.1.10"));
        assert_eq!(loaded[0].host.as_deref(), Some("nas.local"));
        assert_eq!(loaded[0].group.as_deref(), Some("storage"));
    }

    #[test]
    fn test_load_settings_defaults_when_no_file() {
        let dir = tempdir().unwrap();
        let settings = load_settings_from(dir.path()).unwrap();
        assert_eq!(settings.broadcast_addr, "255.255.255.255");
        assert_eq!(settings.udp_port, 9);
        assert_eq!(settings.repeat_count, 1);
    }

    #[test]
    fn test_save_and_load_settings() {
        let dir = tempdir().unwrap();
        let settings = AppSettings {
            broadcast_addr: "192.168.1.255".into(),
            udp_port: 7,
            repeat_count: 3,
            confirm_on_wake: true,
            notify_on_success: false,
            auto_ping: true,
            log_activity: false,
        };

        save_settings_to(dir.path(), &settings).unwrap();
        let loaded = load_settings_from(dir.path()).unwrap();

        assert_eq!(loaded.broadcast_addr, "192.168.1.255");
        assert_eq!(loaded.udp_port, 7);
        assert_eq!(loaded.repeat_count, 3);
        assert!(loaded.confirm_on_wake);
        assert!(!loaded.notify_on_success);
    }

    #[test]
    fn test_update_device() {
        let dir = tempdir().unwrap();
        let devices = vec![make_device("Server 1", "00:11:22:33:44:55")];
        save_devices_to(dir.path(), &devices).unwrap();

        update_device_in(dir.path(), 0, make_device("Updated", "AA:BB:CC:DD:EE:FF")).unwrap();

        let loaded = load_devices_from(dir.path()).unwrap();
        assert_eq!(loaded[0].name, "Updated");
        assert_eq!(loaded[0].mac, "AA:BB:CC:DD:EE:FF");
    }

    #[test]
    fn test_update_device_out_of_range() {
        let dir = tempdir().unwrap();
        let devices = vec![make_device("Server 1", "00:11:22:33:44:55")];
        save_devices_to(dir.path(), &devices).unwrap();

        let err =
            update_device_in(dir.path(), 5, make_device("X", "00:00:00:00:00:00")).unwrap_err();

        assert!(err.contains("out of range"));
    }

    #[test]
    fn test_update_device_no_file() {
        let dir = tempdir().unwrap();

        let err =
            update_device_in(dir.path(), 0, make_device("X", "00:00:00:00:00:00")).unwrap_err();

        assert_eq!(err, "No devices file found");
    }

    #[test]
    fn test_save_settings_creates_directory() {
        let base = tempdir().unwrap();
        let dir = base.path().join("nested").join("subdir");
        let settings = AppSettings::default();
        save_settings_to(&dir, &settings).unwrap();
        assert!(dir.join("settings.json").exists());
    }

    #[test]
    fn test_delete_device() {
        let dir = tempdir().unwrap();
        let devices = vec![
            make_device("Server 1", "00:11:22:33:44:55"),
            make_device("Server 2", "AA:BB:CC:DD:EE:FF"),
        ];
        save_devices_to(dir.path(), &devices).unwrap();

        delete_device_from(dir.path(), 0).unwrap();

        let loaded = load_devices_from(dir.path()).unwrap();
        assert_eq!(loaded.len(), 1);
        assert_eq!(loaded[0].name, "Server 2");
    }

    #[test]
    fn test_delete_device_out_of_range() {
        let dir = tempdir().unwrap();
        let devices = vec![make_device("Server 1", "00:11:22:33:44:55")];
        save_devices_to(dir.path(), &devices).unwrap();

        let err = delete_device_from(dir.path(), 5).unwrap_err();

        assert!(err.contains("out of range"));
    }

    #[test]
    fn test_delete_device_no_file() {
        let dir = tempdir().unwrap();

        let err = delete_device_from(dir.path(), 0).unwrap_err();

        assert_eq!(err, "No devices file found");
    }
}
