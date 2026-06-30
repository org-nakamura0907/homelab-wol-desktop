import { AppSettings } from "../../types/settings";

interface Props {
  settingsForm: AppSettings;
  onChange: (updated: AppSettings) => void;
  onSave: () => void;
}

/** ネットワーク設定や挙動設定を編集するフォーム画面。 */
export function SettingsScreen({ settingsForm, onChange, onSave }: Props) {
  return (
    <div className="settings-screen">
      <div className="settings-section">
        <div className="settings-section-title">Network</div>
        <div className="settings-field">
          <div className="settings-field-info">
            <div className="settings-field-label">Broadcast Address</div>
            <div className="settings-field-sub">UDP broadcast target</div>
          </div>
          <input
            className="settings-input"
            value={settingsForm.broadcastAddr}
            onChange={(e) => onChange({ ...settingsForm, broadcastAddr: e.target.value })}
          />
        </div>
        <div className="settings-field">
          <div className="settings-field-info">
            <div className="settings-field-label">UDP Port</div>
            <div className="settings-field-sub">Default: 9</div>
          </div>
          <input
            className="settings-input narrow"
            type="number"
            min={1}
            max={65535}
            value={settingsForm.udpPort}
            onChange={(e) => onChange({ ...settingsForm, udpPort: Number(e.target.value) })}
          />
        </div>
        <div className="settings-field">
          <div className="settings-field-info">
            <div className="settings-field-label">Repeat Count</div>
            <div className="settings-field-sub">Times to send the packet</div>
          </div>
          <input
            className="settings-input narrow"
            type="number"
            min={1}
            max={10}
            value={settingsForm.repeatCount}
            onChange={(e) => onChange({ ...settingsForm, repeatCount: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Behavior</div>
        {(
          [
            ["confirmOnWake", "Confirm before wake", "Show confirmation dialog before sending"],
            ["notifyOnSuccess", "Notify on success", "Show toast notification on successful send"],
            ["autoPing", "Auto-ping on startup", "Ping hosts when the app launches"],
            ["logActivity", "Log activity", "Record WoL events in the activity log"],
          ] as const
        ).map(([key, label, sub]) => (
          <div key={key} className="settings-field">
            <div className="settings-field-info">
              <div className="settings-field-label">{label}</div>
              <div className="settings-field-sub">{sub}</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settingsForm[key]}
                onChange={(e) => onChange({ ...settingsForm, [key]: e.target.checked })}
              />
              <span className="toggle-track" />
            </label>
          </div>
        ))}
      </div>

      <button className="settings-save-btn" onClick={onSave}>
        SAVE SETTINGS
      </button>
    </div>
  );
}
