/// 別スレッドで OS の `ping` コマンドを実行し、`ip` への往復時間 (ms) を返す。
#[tauri::command]
pub async fn ping_device(ip: String) -> Result<u32, String> {
    tauri::async_runtime::spawn_blocking(move || ping_host(&ip))
        .await
        .map_err(|e| e.to_string())?
}

fn ping_host(ip: &str) -> Result<u32, String> {
    // `-W` のタイムアウト単位は macOS が ms、Linux/その他が秒で異なる点に注意
    #[cfg(target_os = "macos")]
    let args = ["-c", "1", "-W", "2000", ip];
    #[cfg(not(target_os = "macos"))]
    let args = ["-c", "1", "-W", "2", ip];

    let output = std::process::Command::new("ping")
        .args(args)
        .output()
        .map_err(|e| format!("Failed to run ping: {}", e))?;

    if !output.status.success() {
        return Err("Host unreachable".to_string());
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    parse_ping_rtt(&stdout).ok_or_else(|| "Could not parse RTT".to_string())
}

fn parse_ping_rtt(output: &str) -> Option<u32> {
    for line in output.lines() {
        if let Some(pos) = line.find("time=") {
            let rest = &line[pos + 5..];
            if let Some(end) = rest.find(" ms") {
                if let Ok(ms) = rest[..end].trim().parse::<f64>() {
                    return Some(ms.round() as u32);
                }
            }
        }
    }
    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_ping_rtt_macos() {
        let output = "PING 192.168.1.1: 56 data bytes\n\
                      64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.392 ms\n";
        assert_eq!(parse_ping_rtt(output), Some(0));
    }

    #[test]
    fn test_parse_ping_rtt_linux() {
        let output = "64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=1.23 ms\n";
        assert_eq!(parse_ping_rtt(output), Some(1));
    }

    #[test]
    fn test_parse_ping_rtt_unreachable() {
        let output = "Request timeout for icmp_seq 0\n";
        assert_eq!(parse_ping_rtt(output), None);
    }
}
