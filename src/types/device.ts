/** Wake-on-LAN の対象デバイス。`devices.json` に永続化される。 */
export interface Device {
  name: string;
  /** `XX:XX:XX:XX:XX:XX` 形式（大文字16進、コロン区切り）であること。 */
  mac: string;
  ip?: string;
  host?: string;
  group?: string;
}

/** ping 結果から導出されるデバイスの状態。 */
export type DeviceStatus = "online" | "offline" | "waking" | "unknown";
