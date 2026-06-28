mod errors;

use errors::MacAddressError;
use serde::{Deserialize, Serialize};
use std::fs;
use std::net::UdpSocket;
use std::path::Path;
use tauri::Manager;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Device {
    name: String,
    mac: String,
}

// --- Pure functions (testable without AppHandle) ---

fn save_devices_to(dir: &Path, devices: &[Device]) -> Result<(), String> {
    if !dir.exists() {
        fs::create_dir_all(dir).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string_pretty(devices).map_err(|e| e.to_string())?;
    fs::write(dir.join("devices.json"), json).map_err(|e| e.to_string())
}

fn load_devices_from(dir: &Path) -> Result<Vec<Device>, String> {
    let path = dir.join("devices.json");
    if !path.exists() {
        return Ok(vec![]);
    }
    let json = fs::read_to_string(path).map_err(|e| e.to_string())?;
    serde_json::from_str(&json).map_err(|e| e.to_string())
}

fn update_device_in(dir: &Path, index: usize, name: String, mac: String) -> Result<(), String> {
    let path = dir.join("devices.json");
    if !path.exists() {
        return Err("No devices file found".to_string());
    }
    let json = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let mut devices: Vec<Device> = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    if index >= devices.len() {
        return Err(format!("Device index {} out of range", index));
    }
    devices[index] = Device { name, mac };
    let updated_json = serde_json::to_string_pretty(&devices).map_err(|e| e.to_string())?;
    fs::write(&path, &updated_json).map_err(|e| e.to_string())
}

fn delete_device_from(dir: &Path, index: usize) -> Result<(), String> {
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

// --- Tauri command handlers (thin wrappers) ---

#[tauri::command]
fn save_devices(app: tauri::AppHandle, devices: Vec<Device>) -> Result<(), String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e: tauri::Error| e.to_string())?;
    save_devices_to(&dir, &devices)
}

#[tauri::command]
fn load_devices(app: tauri::AppHandle) -> Result<Vec<Device>, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e: tauri::Error| e.to_string())?;
    load_devices_from(&dir)
}

/// Sends a Wake-on-LAN (WOL) magic packet.
#[tauri::command]
fn send_magic_packet(mac_address: String) -> Result<(), String> {
    let mac_bytes =
        parse_mac_address(&mac_address).map_err(|e| format!("MAC address error: {}", e))?;
    let packet = create_magic_packet(&mac_bytes);

    let socket =
        UdpSocket::bind("0.0.0.0:0").map_err(|e| format!("Failed to create socket: {}", e))?;
    socket
        .set_broadcast(true)
        .map_err(|e| format!("Failed to set broadcast: {}", e))?;

    socket
        .send_to(&packet, "255.255.255.255:9")
        .map_err(|e| format!("Failed to send packet: {}", e))?;

    Ok(())
}

#[tauri::command]
fn update_device(
    app: tauri::AppHandle,
    index: usize,
    name: String,
    mac: String,
) -> Result<(), String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e: tauri::Error| e.to_string())?;
    update_device_in(&dir, index, name, mac)
}

#[tauri::command]
fn delete_device(app: tauri::AppHandle, index: usize) -> Result<(), String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e: tauri::Error| e.to_string())?;
    delete_device_from(&dir, index)
}

/// Creates a WOL magic packet from a 6-byte MAC address.
fn create_magic_packet(mac_bytes: &[u8; 6]) -> [u8; 102] {
    let mut packet = [0xFFu8; 102];

    for i in 0..16 {
        packet[6 + i * 6..6 + (i + 1) * 6].copy_from_slice(mac_bytes);
    }

    packet
}

/// Parses a MAC address string into a 6-byte array.
fn parse_mac_address(mac_address: &str) -> Result<[u8; 6], MacAddressError> {
    let parts: Vec<&str> = mac_address.split(':').collect();
    if parts.len() != 6 {
        return Err(MacAddressError::InvalidLength(parts.len()));
    }

    let mut bytes = [0u8; 6];
    for (i, part) in parts.iter().enumerate() {
        bytes[i] = u8::from_str_radix(part, 16)
            .map_err(|_| MacAddressError::InvalidHex(part.to_string()))?
    }

    Ok(bytes)
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    // --- parse_mac_address ---

    #[test]
    fn test_parse_mac_address_valid() {
        let mac = "00:11:22:33:44:55";

        let bytes = parse_mac_address(mac).unwrap();

        assert_eq!(bytes, [0x00, 0x11, 0x22, 0x33, 0x44, 0x55]);
    }

    #[test]
    fn test_parse_mac_address_errors() {
        struct TestCase<'a> {
            input: &'a str,
            expected: MacAddressError,
        }

        let cases = vec![
            TestCase {
                input: "00:11:22",
                expected: MacAddressError::InvalidLength(3),
            },
            TestCase {
                input: "00:11:22:33:44:55:66",
                expected: MacAddressError::InvalidLength(7),
            },
            TestCase {
                input: "00:11:22:33:44:zz",
                expected: MacAddressError::InvalidHex("zz".to_string()),
            },
            TestCase {
                input: "00:11:22:33:44:gg",
                expected: MacAddressError::InvalidHex("gg".to_string()),
            },
            TestCase {
                input: "",
                expected: MacAddressError::InvalidLength(1),
            },
        ];

        for case in cases {
            let err = parse_mac_address(case.input).unwrap_err();
            assert_eq!(
                err.to_string(),
                case.expected.to_string(),
                "input = {}",
                case.input
            );
        }
    }

    // --- create_magic_packet ---

    #[test]
    fn test_create_magic_packet_structure() {
        let mac = [0x00, 0x11, 0x22, 0x33, 0x44, 0x55];

        let packet = create_magic_packet(&mac);

        assert_eq!(packet.len(), 102);
        assert!(packet[..6].iter().all(|&b| b == 0xFF));

        for i in 0..16 {
            let start = 6 + i * 6;
            let end = start + 6;
            assert_eq!(&packet[start..end], &mac);
        }
    }

    // --- save_devices_to / load_devices_from ---

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
            Device {
                name: "Server 1".into(),
                mac: "00:11:22:33:44:55".into(),
            },
            Device {
                name: "Server 2".into(),
                mac: "AA:BB:CC:DD:EE:FF".into(),
            },
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

    // --- update_device_in ---

    #[test]
    fn test_update_device() {
        let dir = tempdir().unwrap();
        let devices = vec![Device {
            name: "Server 1".into(),
            mac: "00:11:22:33:44:55".into(),
        }];
        save_devices_to(dir.path(), &devices).unwrap();

        update_device_in(dir.path(), 0, "Updated".into(), "AA:BB:CC:DD:EE:FF".into()).unwrap();

        let loaded = load_devices_from(dir.path()).unwrap();
        assert_eq!(loaded[0].name, "Updated");
        assert_eq!(loaded[0].mac, "AA:BB:CC:DD:EE:FF");
    }

    #[test]
    fn test_update_device_out_of_range() {
        let dir = tempdir().unwrap();
        let devices = vec![Device {
            name: "Server 1".into(),
            mac: "00:11:22:33:44:55".into(),
        }];
        save_devices_to(dir.path(), &devices).unwrap();

        let err =
            update_device_in(dir.path(), 5, "X".into(), "00:00:00:00:00:00".into()).unwrap_err();

        assert!(err.contains("out of range"));
    }

    #[test]
    fn test_update_device_no_file() {
        let dir = tempdir().unwrap();

        let err =
            update_device_in(dir.path(), 0, "X".into(), "00:00:00:00:00:00".into()).unwrap_err();

        assert_eq!(err, "No devices file found");
    }

    // --- delete_device_from ---

    #[test]
    fn test_delete_device() {
        let dir = tempdir().unwrap();
        let devices = vec![
            Device {
                name: "Server 1".into(),
                mac: "00:11:22:33:44:55".into(),
            },
            Device {
                name: "Server 2".into(),
                mac: "AA:BB:CC:DD:EE:FF".into(),
            },
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
        let devices = vec![Device {
            name: "Server 1".into(),
            mac: "00:11:22:33:44:55".into(),
        }];
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            save_devices,
            load_devices,
            send_magic_packet,
            update_device,
            delete_device
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
