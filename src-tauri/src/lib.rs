use tauri::{Manager, WebviewWindow};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn minimize_window(window: WebviewWindow) {
    let _ = window.minimize();
}

#[tauri::command]
fn close_window(window: WebviewWindow) {
    window.close().unwrap();
}

#[tauri::command]
fn start_dragging(window: WebviewWindow) {
    window.start_drag_move().unwrap();
}

#[tauri::command]
fn check_installed() -> bool {
    // TODO: 实现实际的检测逻辑
    std::path::Path::new("/usr/local/bin/openclaw").exists()
}

#[tauri::command]
fn get_service_status() -> String {
    // TODO: 实现实际的服务状态检测
    "stopped".to_string()
}

#[tauri::command]
fn get_version() -> serde_json::Value {
    serde_json::json!({
        "installed": true,
        "version": "0.3.3"
    })
}

#[tauri::command]
fn check_env() -> serde_json::Value {
    serde_json::json!({
        "node": "24.0.0",
        "npm": "11.8.0",
        "git": "2.40.0",
        "docker": null,
        "network": true
    })
}

#[tauri::command]
fn start_service() -> Result<(), String> {
    // TODO: 实现实际的服务启动
    Ok(())
}

#[tauri::command]
fn stop_service() -> Result<(), String> {
    // TODO: 实现实际的服务停止
    Ok(())
}

#[tauri::command]
fn restart_service() -> Result<(), String> {
    // TODO: 实现实际的服务重启
    Ok(())
}

#[tauri::command]
fn uninstall(options: Vec<String>) -> Result<(), String> {
    // TODO: 实现实际的卸载逻辑
    println!("Uninstall options: {:?}", options);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            minimize_window,
            close_window,
            start_dragging,
            check_installed,
            get_service_status,
            get_version,
            check_env,
            start_service,
            stop_service,
            restart_service,
            uninstall
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
