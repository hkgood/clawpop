use std::process::Command;
use tauri::Emitter;

#[tauri::command]
fn close_window(window: tauri::Window) {
    window.close().unwrap();
}

#[tauri::command]
fn minimize_window(window: tauri::Window) {
    window.minimize().unwrap();
}

#[tauri::command]
async fn check_env(window: tauri::Window) -> Result<serde_json::Value, String> {
    let _ = window.emit("install-log", "> 检查环境...");
    
    // 检查 Node.js
    let node_version = Command::new("node")
        .arg("--version")
        .output()
        .ok()
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .map(|s| s.trim().trim_start_matches('v').to_string());
    
    let _ = window.emit("install-log", format!("✓ Node.js v{}", node_version.as_deref().unwrap_or("未安装")));
    
    // 检查 npm
    let npm_version = Command::new("npm")
        .arg("--version")
        .output()
        .ok()
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .map(|s| s.trim().to_string());
    
    let _ = window.emit("install-log", format!("✓ npm v{}", npm_version.as_deref().unwrap_or("未安装")));
    
    // 检查 Git
    let git_version = Command::new("git")
        .arg("--version")
        .output()
        .ok()
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .map(|s| s.trim().replace("git version ", ""));
    
    let _ = window.emit("install-log", format!("✓ Git v{}", git_version.as_deref().unwrap_or("未安装")));
    
    // 检查网络
    let network_ok = Command::new("ping")
        .arg("-c")
        .arg("1")
        .arg("github.com")
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false);
    
    let _ = window.emit("install-log", if network_ok { "✓ 网络正常" } else { "✗ 网络异常" });
    
    let _ = window.emit("install-progress", serde_json::json!({
        "step": "check",
        "message": "环境检查完成",
        "progress": 20
    }));
    
    Ok(serde_json::json!({
        "node": node_version,
        "npm": npm_version,
        "git": git_version,
        "network": network_ok
    }))
}

#[tauri::command]
async fn start_install(window: tauri::Window, config: serde_json::Value) -> Result<(), String> {
    let model = config.get("model").and_then(|v| v.as_str()).unwrap_or("minimax-m2.5");
    let api_key = config.get("apiKey").and_then(|v| v.as_str()).unwrap_or("");
    let channels = config.get("channels").and_then(|v| v.as_array()).map(|arr| {
        arr.iter().filter_map(|v| v.as_str()).collect::<Vec<_>>()
    }).unwrap_or_default();
    
    // 保存配置
    let home = dirs::home_dir().unwrap_or_default();
    let config_dir = home.join(".openclaw");
    std::fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    
    let config_content = serde_json::json!({
        "model": model,
        "apiKey": api_key,
        "channels": channels
    });
    
    std::fs::write(
        config_dir.join("config.json"),
        serde_json::to_string_pretty(&config_content).map_err(|e| e.to_string())?
    ).map_err(|e| e.to_string())?;
    
    let _ = window.emit("install-log", "> 配置已保存");
    let _ = window.emit("install-progress", serde_json::json!({
        "step": "config",
        "message": "配置已保存",
        "progress": 70
    }));
    
    // 克隆仓库
    let _ = window.emit("install-log", "> 克隆 OpenClaw 仓库...");
    let _ = window.emit("install-progress", serde_json::json!({
        "step": "clone",
        "message": "正在克隆仓库...",
        "progress": 30
    }));
    
    let openclaw_dir = home.join(".openclaw");
    
    if openclaw_dir.exists() {
        let _ = window.emit("install-log", "  仓库已存在，跳过克隆");
    } else {
        let output = Command::new("git")
            .arg("clone")
            .arg("https://github.com/openclaw/openclaw.git")
            .arg(&openclaw_dir)
            .output()
            .map_err(|e| e.to_string())?;
        
        if !output.status.success() {
            let _ = window.emit("install-log", format!("  ✗ 克隆失败: {}", String::from_utf8_lossy(&output.stderr)));
            return Err("Git clone failed".to_string());
        }
        
        let _ = window.emit("install-log", "  ✓ 克隆完成");
    }
    
    // 安装依赖
    let _ = window.emit("install-log", "> 安装依赖...");
    let _ = window.emit("install-progress", serde_json::json!({
        "step": "deps",
        "message": "正在安装依赖...",
        "progress": 50
    }));
    
    let output = Command::new("npm")
        .arg("install")
        .current_dir(&openclaw_dir)
        .output()
        .map_err(|e| e.to_string())?;
    
    if !output.status.success() {
        let _ = window.emit("install-log", format!("  ✗ 安装失败: {}", String::from_utf8_lossy(&output.stderr)));
        return Err("npm install failed".to_string());
    }
    
    let _ = window.emit("install-log", "  ✓ 依赖安装完成");
    
    // 完成
    let _ = window.emit("install-log", "🎉 安装完成！");
    let _ = window.emit("install-progress", serde_json::json!({
        "step": "done",
        "message": "安装完成！",
        "progress": 100
    }));
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![close_window, minimize_window, check_env, start_install])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
