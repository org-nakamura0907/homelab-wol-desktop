import { forwardRef } from "react";
import { Device, DeviceStatus } from "../../types/device";

interface Props {
  device: Device;
  form: Device;
  status: DeviceStatus;
  allGroups: string[];
  onFormChange: (updated: Device) => void;
  onSave: () => void;
  onDelete: () => void;
  onWake: () => void;
  onPing: () => void;
  onClose: () => void;
}

/** 既存デバイスの表示・編集用サイドドロワー。 */
export const DeviceDrawer = forwardRef<HTMLDivElement, Props>(function DeviceDrawer(
  { device, form, status, allGroups, onFormChange, onSave, onDelete, onWake, onPing, onClose },
  ref
) {
  return (
    <div className="drawer-overlay">
      <div className="drawer" ref={ref}>
        <div className="drawer-header">
          <span className="drawer-title">{device.name}</span>
          <button className="drawer-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="drawer-body">
          <div className="drawer-status-row">
            <div className={`status-dot ${status}`} />
            <span className="drawer-status-text">{status}</span>
          </div>
          <div className="drawer-action-row">
            {status === "waking" ? (
              <span className="drawer-waking">
                <span className="spinner" />
                waking...
              </span>
            ) : status === "online" ? (
              device.ip && (
                <button className="drawer-ping-btn drawer-ping-btn--full" onClick={onPing}>
                  PING
                </button>
              )
            ) : (
              <>
                <button className="drawer-wake-btn" onClick={onWake}>
                  WAKE NOW
                </button>
                {device.ip && (
                  <button className="drawer-ping-btn" onClick={onPing}>
                    PING
                  </button>
                )}
              </>
            )}
          </div>

          <div className="drawer-section-title">Details</div>
          <div className="drawer-field">
            <label>Hostname</label>
            <input
              placeholder="e.g. homeserver"
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            />
          </div>
          <div className="drawer-field">
            <label>IP Address</label>
            <input
              placeholder="e.g. 192.168.1.100"
              value={form.ip ?? ""}
              onChange={(e) => onFormChange({ ...form, ip: e.target.value })}
            />
          </div>
          <div className="drawer-field">
            <label>MAC Address</label>
            <input
              className="mono"
              placeholder="AA:BB:CC:DD:EE:FF"
              value={form.mac}
              onChange={(e) => onFormChange({ ...form, mac: e.target.value })}
            />
          </div>
          <div className="drawer-field">
            <label>Group</label>
            <select
              value={form.group ?? ""}
              onChange={(e) => onFormChange({ ...form, group: e.target.value })}
            >
              <option value="">— None —</option>
              {allGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className="drawer-field">
            <label>Notes</label>
            <input
              placeholder="Optional notes"
              value={form.host ?? ""}
              onChange={(e) => onFormChange({ ...form, host: e.target.value })}
            />
          </div>
        </div>
        <div className="drawer-actions">
          <button className="drawer-save-btn" onClick={onSave}>
            SAVE
          </button>
          <button className="drawer-delete-btn" onClick={onDelete}>
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
});
