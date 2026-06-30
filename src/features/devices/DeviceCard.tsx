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

/** グリッド表示における 1 デバイスを表すカード。 */
export function DeviceCard({ device, status, pingMs, lastSeen, selected, onClick, onWake }: Props) {
  return (
    <div className={`device-card ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="card-header">
        <div className={`status-dot ${status}`} />
        <div className="card-name">{device.name}</div>
        {device.group && <div className="card-group">{device.group}</div>}
      </div>
      <div className="card-meta">
        {device.ip && (
          <div className="card-ip">
            <span className="meta-label">ip</span> {device.ip}
          </div>
        )}
        <div className="card-mac">
          <span className="meta-label">mac</span> {device.mac}
        </div>
      </div>
      <div className="card-footer">
        {status === "waking" ? (
          <span className="card-status-text waking">
            <span className="spinner" />
            waking...
          </span>
        ) : (
          <>
            <span className={`card-status-text ${status}`}>
              {status}
              {status === "online" && pingMs != null && (
                <span className="card-ping-ms"> · {pingMs}ms</span>
              )}
            </span>
            {status === "offline" && lastSeen && (
              <span className="card-last-seen">last seen {fmtLastSeen(lastSeen)}</span>
            )}
            {status !== "online" && (
              <button
                className="wake-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onWake();
                }}
              >
                WAKE
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
