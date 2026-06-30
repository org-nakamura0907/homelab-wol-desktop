use crate::models::{AppSettings, Device};
use crate::storage::{
    delete_device_from, load_devices_from, load_settings_from, save_devices_to, save_settings_to,
    update_device_in,
};
use tauri::Manager;

/// デバイス一覧を app data dir に保存する。
#[tauri::command]
pub fn save_devices(app: tauri::AppHandle, devices: Vec<Device>) -> Result<(), String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e: tauri::Error| e.to_string())?;
    save_devices_to(&dir, &devices)
}

/// app data dir からデバイス一覧を読み込む。
#[tauri::command]
pub fn load_devices(app: tauri::AppHandle) -> Result<Vec<Device>, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e: tauri::Error| e.to_string())?;
    load_devices_from(&dir)
}

/// アプリ設定を app data dir に保存する。
#[tauri::command]
pub fn save_settings(app: tauri::AppHandle, settings: AppSettings) -> Result<(), String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e: tauri::Error| e.to_string())?;
    save_settings_to(&dir, &settings)
}

/// app data dir からアプリ設定を読み込む。
#[tauri::command]
pub fn load_settings(app: tauri::AppHandle) -> Result<AppSettings, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e: tauri::Error| e.to_string())?;
    load_settings_from(&dir)
}

/// app data dir のデバイス一覧の `index` 番目を置き換える。
#[tauri::command]
pub fn update_device(app: tauri::AppHandle, index: usize, device: Device) -> Result<(), String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e: tauri::Error| e.to_string())?;
    update_device_in(&dir, index, device)
}

/// app data dir のデバイス一覧から `index` 番目を削除する。
#[tauri::command]
pub fn delete_device(app: tauri::AppHandle, index: usize) -> Result<(), String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e: tauri::Error| e.to_string())?;
    delete_device_from(&dir, index)
}
