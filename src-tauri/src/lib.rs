// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Device {
    name: String,
    mac: String,
}

#[tauri::command]
fn save_devices(app: tauri::AppHandle, devices: Vec<Device>) -> Result<(), String> {
    let dir = app.path().app_data_dir().map_err(|e: tauri::Error| e.to_string())?;

    if !dir.exists() {
        std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    }

    let file_path = dir.join("devices.json");
    let json = serde_json::to_string_pretty(&devices).map_err(|e| e.to_string())?;

    fs::write(&file_path, &json).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn load_devices(app: tauri::AppHandle) -> Result<Vec<Device>, String> {
    let dir = app.path().app_data_dir().map_err(|e: tauri::Error| e.to_string())?;

    let file_path = dir.join("devices.json");
    if !file_path.exists() {
        return Ok(vec![]);
    }
    let json = fs::read_to_string(file_path).map_err(|e| e.to_string())?;
    serde_json::from_str(&json).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![save_devices, load_devices])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
