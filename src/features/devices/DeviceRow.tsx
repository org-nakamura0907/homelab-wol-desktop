import { Device, DeviceStatus } from "../../types/device";
import { fmtLastSeen } from "../../lib/format";

interface Props {
  device: Device;
  status: DeviceStatus;
  pingMs: number | null;
  lastSeen: Date | null;
  selected: boolean;
  onClick: () => void;
  onWake: () => void;
}

/** リスト表示における 1 デバイスを表す行。 */
export function DeviceRow({ device, status, pingMs, lastSeen, selected, onClick, onWake }: Props) {
  return (
    <div className={`device-row ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className={`status-dot ${status}`} />
      <div className="row-name">{device.name}</div>
      {device.group && (
        <div className="row-group">
          <span className="card-group">{device.group}</span>
        </div>
      )}
      {device.ip && (
        <div className="row-ip">
          <span className="meta-label">ip</span> {device.ip}
        </div>
      )}
      <div className="row-mac">
        <span className="meta-label">mac</span> {device.mac}
      </div>
      {status === "online" && pingMs != null && <span className="card-ping-ms">{pingMs}ms</span>}
      {status === "offline" && lastSeen && (
        <span className="card-last-seen">{fmtLastSeen(lastSeen)}</span>
      )}
      {status === "waking" ? (
        <span className="spinner" />
      ) : (
        status !== "online" && (
          <button
            className="wake-btn"
            onClick={(e) => {
              e.stopPropagation();
              onWake();
            }}
          >
            WAKE
          </button>
        )
      )}
    </div>
  );
}
