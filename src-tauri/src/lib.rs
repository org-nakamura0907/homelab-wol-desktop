mod commands;
mod errors;
mod models;
mod ping;
mod storage;
mod wol;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::save_devices,
            commands::load_devices,
            commands::save_settings,
            commands::load_settings,
            wol::send_magic_packet,
            commands::update_device,
            commands::delete_device,
            ping::ping_device,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
