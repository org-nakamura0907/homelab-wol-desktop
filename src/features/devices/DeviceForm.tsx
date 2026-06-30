import { Device } from "../../types/device";

interface Props {
  form: Device;
  allGroups: string[];
  onChange: (updated: Device) => void;
  onSubmit: () => void;
  onClose: () => void;
}

/** 新規デバイス追加用のモーダルフォーム。 */
export function DeviceForm({ form, allGroups, onChange, onSubmit, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <span className="modal-title">ADD HOST</span>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="form-field">
            <label>
              Hostname <span className="required">*</span>
            </label>
            <input
              autoFocus
              placeholder="e.g. homeserver"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            />
          </div>
          <div className="form-field">
            <label>IP Address</label>
            <input
              placeholder="e.g. 192.168.1.100"
              value={form.ip ?? ""}
              onChange={(e) => onChange({ ...form, ip: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>
              MAC Address <span className="required">*</span>
            </label>
            <input
              placeholder="AA:BB:CC:DD:EE:FF"
              value={form.mac}
              onChange={(e) => onChange({ ...form, mac: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            />
          </div>
          <div className="form-field">
            <label>Group</label>
            <select
              value={form.group ?? ""}
              onChange={(e) => onChange({ ...form, group: e.target.value })}
            >
              <option value="">— None —</option>
              {allGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            CANCEL
          </button>
          <button
            className="submit-btn"
            disabled={!form.name.trim() || !form.mac.trim()}
            onClick={onSubmit}
          >
            ADD HOST
          </button>
        </div>
      </div>
    </div>
  );
}
