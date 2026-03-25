use std::process::Command;
use tauri::Emitter;

#[derive(serde::Serialize)]
struct VersionInfo {
    installed: bool,
    version: Option<String>,
    latest: Option<String>,
    update_available: bool,
}

#[tauri::command]
fn get_version() -> VersionInfo {
    let home = dirs::home_dir().unwrap_or_default();
    let openclaw_dir = home.join(".openclaw");
    
    if !openclaw_dir.exists() {
        return VersionInfo {
            installed: false,
            version: None,
            latest: None,
            update_available: false,
        };
    }
    
    // 读取本地版本
    let version_file = openclaw_dir.join("package.json");
    let local_version = std::fs::read_to_string(&version_file)
        .ok()
        .and_then(|content| {
            serde_json::from_str::<serde_json::Value>(&content)
                .ok()
                .and_then(|v| v.get("version").and_then(|vv| vv.as_str()).map(String::from))
        });
    
    // 这里可以后续调用 GitHub API 获取最新版本
    // 暂时返回本地版本
    VersionInfo {
        installed: true,
        version: local_version,
        latest: None,
        update_available: false,
    }
}

#[tauri::command]
async fn validate_api_key(model: String, api_key: String) -> Result<bool, String> {
    // 首先检查基本格式
    if api_key.len() < 10 {
        return Ok(false);
    }
    
    // 根据模型提供商验证 - 自动检测
    let provider = if model.contains("minimax") {
        "minimax"
    } else if model.contains("anthropic") {
        "anthropic"
    } else if model.contains("qwen") || model.contains("aliyun") || model.contains("bailian") {
        "aliyun"
    } else if model.contains("deepseek") {
        "deepseek"
    } else if model.contains("google") || model.contains("gemini") {
        "google"
    } else if model.contains("openai") || model.contains("gpt") {
        "openai"
    } else if model.contains("xiaomi") || model.contains("mimo") {
        "xiaomi"
    } else if model.contains("mistral") {
        "mistral"
    } else if model.contains("llama") || model.contains("meta-llama") {
        "meta"
    } else if model.contains("nvidia") || model.contains("nemotron") {
        "nvidia"
    } else if model.contains("stepfun") {
        "stepfun"
    } else if model.contains("hunter") {
        "hunter"
    } else {
        "unknown"
    };
    
    match provider {
        "minimax" => validate_minimax_api_key(&api_key).await,
        "anthropic" => validate_anthropic_api_key(&api_key).await,
        "aliyun" => validate_aliyun_api_key(&api_key).await,
        "deepseek" => validate_deepseek_api_key(&api_key).await,
        "google" => validate_google_api_key(&api_key).await,
        "openai" => validate_openai_api_key(&api_key).await,
        "xiaomi" => validate_xiaomi_api_key(&api_key).await,
        "mistral" => validate_mistral_api_key(&api_key).await,
        "meta" => validate_meta_api_key(&api_key).await,
        "nvidia" => validate_nvidia_api_key(&api_key).await,
        "stepfun" => validate_stepfun_api_key(&api_key).await,
        "hunter" => validate_hunter_api_key(&api_key).await,
        _ => Ok(api_key.len() > 10),
    }
}

/// 验证 MiniMax API Key
async fn validate_minimax_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://api.minimax.chat/v1/models")
        .arg("-H")
        .arg(format!("Authorization: Bearer {}", api_key))
        .arg("-H")
        .arg("Content-Type: application/json")
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\""))
}

/// 验证 Anthropic API Key
async fn validate_anthropic_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("POST")
        .arg("https://api.anthropic.com/v1/messages")
        .arg("-H")
        .arg(format!("x-api-key: {}", api_key))
        .arg("-H")
        .arg("anthropic-version: 2023-06-01")
        .arg("-H")
        .arg("Content-Type: application/json")
        .arg("-d")
        .arg(r#"{"model":"claude-3-haiku-20240307","max_tokens":1,"messages":[{"role":"user","content":"hi"}]}"#)
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\""))
}

/// 验证阿里云 (DashScope) API Key
async fn validate_aliyun_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://dashscope.aliyuncs.com/api/v1/models")
        .arg("-H")
        .arg(format!("Authorization: Bearer {}", api_key))
        .arg("-H")
        .arg("Content-Type: application/json")
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\"") && !response.contains("InvalidApiKey"))
}

/// 验证 DeepSeek API Key
async fn validate_deepseek_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://api.deepseek.com/v1/models")
        .arg("-H")
        .arg(format!("Authorization: Bearer {}", api_key))
        .arg("-H")
        .arg("Content-Type: application/json")
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\""))
}

/// 验证 Google API Key
async fn validate_google_api_key(_api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://generativelanguage.googleapis.com/v1/models?key=INVALID_KEY")
        .arg("-H")
        .arg("Content-Type: application/json")
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    // Google 返回 invalid 错误时 key 无效
    Ok(!response.contains("API_KEY_INVALID") && !response.contains("The API key is not valid"))
}

/// 验证 OpenAI API Key
async fn validate_openai_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://api.openai.com/v1/models")
        .arg("-H")
        .arg(format!("Authorization: Bearer {}", api_key))
        .arg("-H")
        .arg("Content-Type: application/json")
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\"") && !response.contains("Invalid API key"))
}

/// 验证小米 API Key
async fn validate_xiaomi_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://api.xiaomi.com/v1/models")
        .arg("-H")
        .arg(format!("Authorization: Bearer {}", api_key))
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\""))
}

/// 验证 Mistral API Key
async fn validate_mistral_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://api.mistral.ai/v1/models")
        .arg("-H")
        .arg(format!("Authorization: Bearer {}", api_key))
        .arg("-H")
        .arg("Content-Type: application/json")
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\""))
}

/// 验证 Meta API Key (Llama via OpenRouter)
async fn validate_meta_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://openrouter.ai/api/v1/models")
        .arg("-H")
        .arg(format!("Authorization: Bearer {}", api_key))
        .arg("-H")
        .arg("Content-Type: application/json")
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\""))
}

/// 验证 NVIDIA API Key
async fn validate_nvidia_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://integrate.api.nvidia.com/v1/models")
        .arg("-H")
        .arg(format!("Authorization: Bearer {}", api_key))
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\""))
}

/// 验证 StepFun API Key
async fn validate_stepfun_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://api.stepfun.com/v1/models")
        .arg("-H")
        .arg(format!("Authorization: Bearer {}", api_key))
        .arg("-H")
        .arg("Content-Type: application/json")
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\""))
}

/// 验证 Hunter API Key (OpenRouter)
async fn validate_hunter_api_key(api_key: &str) -> Result<bool, String> {
    use std::process::Command;
    
    let output = Command::new("curl")
        .arg("-s")
        .arg("-X")
        .arg("GET")
        .arg("https://openrouter.ai/api/v1/models")
        .arg("-H")
        .arg(format!("Authorization: Bearer {}", api_key))
        .arg("-H")
        .arg("Content-Type: application/json")
        .output()
        .map_err(|e| e.to_string())?;
    
    let response = String::from_utf8_lossy(&output.stdout);
    Ok(!response.contains("\"error\""))
}

#[tauri::command]
fn close_window(window: tauri::Window) {
    window.close().unwrap();
}

#[tauri::command]
fn minimize_window(window: tauri::Window) {
    window.minimize().unwrap();
}

#[tauri::command]
fn start_dragging(window: tauri::Window) {
    window.start_dragging().unwrap();
}

#[tauri::command]
fn check_installed() -> bool {
    let home = dirs::home_dir().unwrap_or_default();
    let openclaw_dir = home.join(".openclaw");
    openclaw_dir.exists()
}

#[tauri::command]
fn check_running() -> bool {
    // 检查端口 18789 是否有服务运行
    let output = Command::new("lsof")
        .arg("-i")
        .arg(":18789")
        .output();
    
    match output {
        Ok(o) => o.status.success() && !String::from_utf8_lossy(&o.stdout).is_empty(),
        Err(_) => false,
    }
}

#[tauri::command]
fn start_service() -> Result<(), String> {
    let home = dirs::home_dir().unwrap_or_default();
    let openclaw_dir = home.join(".openclaw");
    
    // 检查是否已安装
    if !openclaw_dir.exists() {
        return Err("OpenClaw 未安装".to_string());
    }
    
    // 检查是否已运行
    if check_running() {
        return Err("OpenClaw 服务已在运行中".to_string());
    }
    
    // 使用 nohup 启动服务
    Command::new("nohup")
        .arg("npx")
        .arg("openclaw")
        .arg("gateway")
        .arg("start")
        .current_dir(&openclaw_dir)
        .spawn()
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn stop_service() -> Result<(), String> {
    // 查找并终止 openclaw gateway 进程
    let output = Command::new("lsof")
        .arg("-i")
        .arg(":18789")
        .arg("-t")
        .output()
        .map_err(|e| e.to_string())?;
    
    let pid = String::from_utf8_lossy(&output.stdout).trim().to_string();
    
    if pid.is_empty() {
        return Err("OpenClaw 服务未运行".to_string());
    }
    
    Command::new("kill")
        .arg("-9")
        .arg(&pid)
        .output()
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn restart_service() -> Result<(), String> {
    // 先停止
    let _ = stop_service();
    // 再启动
    start_service()
}

#[tauri::command]
fn get_service_status() -> String {
    if check_running() {
        "running".to_string()
    } else {
        "stopped".to_string()
    }
}

#[tauri::command]
fn cancel_install() -> Result<(), String> {
    // 终止可能正在运行的 npm install 或 git clone 进程
    // 这是一个简单的实现，实际可能需要更复杂的进程管理
    let _ = Command::new("pkill")
        .arg("-f")
        .arg("npm install")
        .output();
    
    Ok(())
}

#[tauri::command]
async fn uninstall(options: Vec<String>) -> Result<(), String> {
    let home = dirs::home_dir().unwrap_or_default();
    let openclaw_dir = home.join(".openclaw");
    
    // 删除 OpenClaw 主程序
    if options.contains(&"openclaw".to_string()) {
        if openclaw_dir.exists() {
            std::fs::remove_dir_all(&openclaw_dir).map_err(|e| e.to_string())?;
        }
    }
    
    // 删除 node_modules (在 workspace 目录)
    if options.contains(&"deps".to_string()) {
        let workspace_deps = home.join(".openclaw").join("workspace").join(".agents").join("node_modules");
        if workspace_deps.exists() {
            std::fs::remove_dir_all(workspace_deps).map_err(|e| e.to_string())?;
        }
    }
    
    // 删除配置文件
    if options.contains(&"config".to_string()) {
        let config_file = home.join(".openclaw").join("config.json");
        if config_file.exists() {
            std::fs::remove_file(config_file).map_err(|e| e.to_string())?;
        }
        // 删除 .env 文件
        let env_file = home.join(".openclaw").join(".env");
        if env_file.exists() {
            std::fs::remove_file(env_file).map_err(|e| e.to_string())?;
        }
    }
    
    // 删除工作数据
    if options.contains(&"data".to_string()) {
        let workspace_dir = home.join(".openclaw").join("workspace");
        if workspace_dir.exists() {
            // 只删除 memory, skills 等数据目录，保留必要的结构
            let data_dirs = ["memory", "skills", ".agents"];
            for dir in data_dirs {
                let data_path = workspace_dir.join(dir);
                if data_path.exists() {
                    std::fs::remove_dir_all(data_path).map_err(|e| e.to_string())?;
                }
            }
        }
    }
    
    Ok(())
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
    
    // 检查网络（使用 curl 更可靠）
    let network_ok = Command::new("curl")
        .arg("-s")
        .arg("--connect-timeout")
        .arg("5")
        .arg("https://api.github.com")
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false);
    
    let _ = window.emit("install-log", if network_ok { "✓ 网络正常" } else { "✗ 网络异常" });
    
    // 检查 Docker
    let docker_version = Command::new("docker")
        .arg("--version")
        .output()
        .ok()
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .map(|s| {
            // 解析 "Docker version 24.0.0, build 12345" 格式
            s.trim().replace("Docker version ", "").split(',').next().unwrap_or("").to_string()
        });
    
    let docker_installed = docker_version.is_some();
    let _ = window.emit("install-log", if docker_installed { 
        format!("✓ Docker v{}", docker_version.as_deref().unwrap_or("")) 
    } else { 
        "○ Docker 未安装（可选）".to_string() 
    });
    
    let _ = window.emit("install-progress", serde_json::json!({
        "step": "check",
        "message": "环境检查完成",
        "progress": 20
    }));
    
    Ok(serde_json::json!({
        "node": node_version,
        "npm": npm_version,
        "git": git_version,
        "network": network_ok,
        "docker": docker_version
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
    
    // 克隆仓库 - 实时输出
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
        // 使用 spawn 实时获取 git 输出
        let mut child = Command::new("git")
            .arg("clone")
            .arg("--verbose")
            .arg("https://github.com/openclaw/openclaw.git")
            .arg(&openclaw_dir)
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .spawn()
            .map_err(|e| e.to_string())?;
        
        // 读取 stdout
        if let Some(stdout) = child.stdout.take() {
            use std::io::{BufRead, BufReader};
            let reader = BufReader::new(stdout);
            for line in reader.lines() {
                if let Ok(line) = line {
                    let _ = window.emit("install-log", format!("  {}", line));
                }
            }
        }
        
        // 等待完成
        let status = child.wait().map_err(|e| e.to_string())?;
        
        if !status.success() {
            let _ = window.emit("install-log", "  ✗ 克隆失败".to_string());
            return Err("Git clone failed".to_string());
        }
        
        let _ = window.emit("install-log", "  ✓ 克隆完成");
    }
    
    // 安装依赖 - 实时输出
    let _ = window.emit("install-log", "> 安装依赖...");
    let _ = window.emit("install-progress", serde_json::json!({
        "step": "deps",
        "message": "正在安装依赖...",
        "progress": 50
    }));
    
    // 使用 npm install --verbose 实时输出
    let mut child = Command::new("npm")
        .arg("install")
        .arg("--verbose")
        .current_dir(&openclaw_dir)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?;
    
    // 读取 stdout
    if let Some(stdout) = child.stdout.take() {
        use std::io::{BufRead, BufReader};
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(line) = line {
                let _ = window.emit("install-log", format!("  {}", line));
            }
        }
    }
    
    // 等待完成
    let status = child.wait().map_err(|e| e.to_string())?;
    
    if !status.success() {
        let _ = window.emit("install-log", "  ✗ 安装失败".to_string());
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
        .invoke_handler(tauri::generate_handler![
            close_window, 
            minimize_window,
            start_dragging, 
            check_env, 
            start_install, 
            check_installed, 
            check_running, 
            start_service, 
            stop_service,
            restart_service,
            get_service_status,
            get_version,
            validate_api_key,
            cancel_install, 
            uninstall
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
