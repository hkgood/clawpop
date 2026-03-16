use tauri::Manager;

#[tauri::command]
fn close_window(window: tauri::Window) {
    window.close().unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![close_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
