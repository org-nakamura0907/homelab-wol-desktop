use crate::errors::MacAddressError;
use std::net::UdpSocket;

/// Wake-on-LAN マジックパケットを送信する。`repeat_count` は最小値 1 にクランプされる。
#[tauri::command]
pub fn send_magic_packet(
    mac_address: String,
    broadcast_addr: String,
    udp_port: u16,
    repeat_count: u8,
) -> Result<(), String> {
    let mac_bytes =
        parse_mac_address(&mac_address).map_err(|e| format!("MAC address error: {}", e))?;
    let packet = create_magic_packet(&mac_bytes);

    let socket =
        UdpSocket::bind("0.0.0.0:0").map_err(|e| format!("Failed to create socket: {}", e))?;
    socket
        .set_broadcast(true)
        .map_err(|e| format!("Failed to set broadcast: {}", e))?;

    let target = format!("{}:{}", broadcast_addr, udp_port);
    let count = repeat_count.max(1);
    for _ in 0..count {
        socket
            .send_to(&packet, &target)
            .map_err(|e| format!("Failed to send packet: {}", e))?;
    }

    Ok(())
}

// WoL マジックパケットの仕様: 先頭 6 バイトの 0xFF + MAC(6バイト)を 16 回繰り返した計 102 バイト。
fn create_magic_packet(mac_bytes: &[u8; 6]) -> [u8; 102] {
    let mut packet = [0xFFu8; 102];

    for i in 0..16 {
        packet[6 + i * 6..6 + (i + 1) * 6].copy_from_slice(mac_bytes);
    }

    packet
}

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
    use crate::errors::MacAddressError;

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
}
