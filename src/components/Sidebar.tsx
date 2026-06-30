import { Device, DeviceStatus } from "../types/device";
import { LogEntry, Screen } from "../types/ui";
import { AppSettings } from "../types/settings";

interface Props {
  screen: Screen;
  devices: Device[];
  log: LogEntry[];
  statuses: Record<string, DeviceStatus>;
  settings: AppSettings;
  selectedGroup: string | null;
  allGroups: string[];
  addingGroup: boolean;
  newGroupName: string;
  editingGroupName: string | null;
  editingGroupValue: string;
  onSelectScreen: (screen: Screen) => void;
  onSelectGroup: (group: string | null) => void;
  onSetAddingGroup: (value: boolean) => void;
  onSetNewGroupName: (value: string) => void;
  onSetEditingGroupName: (value: string | null) => void;
  onSetEditingGroupValue: (value: string) => void;
  onAddGroup: () => void;
  onDeleteGroup: (group: string) => void;
  onRenameGroup: (oldName: string, newName: string) => void;
}

/** ナビゲーション、グループ管理、ステータス統計を含むアプリのサイドバー。 */
export function Sidebar({
  screen,
  devices,
  log,
  statuses,
  settings,
  selectedGroup,
  allGroups,
  addingGroup,
  newGroupName,
  editingGroupName,
  editingGroupValue,
  onSelectScreen,
  onSelectGroup,
  onSetAddingGroup,
  onSetNewGroupName,
  onSetEditingGroupName,
  onSetEditingGroupValue,
  onAddGroup,
  onDeleteGroup,
  onRenameGroup,
}: Props) {
  const onlineCount = Object.values(statuses).filter((s) => s === "online").length;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">[WOL]</div>
        <div className="logo-sub">wake-on-lan manager</div>
      </div>

      <nav className="sidebar-nav">
        <div
          className={`nav-item ${screen === "devices" ? "active" : ""}`}
          onClick={() => onSelectScreen("devices")}
        >
          <span className="nav-icon">⊞</span>
          <span>Devices</span>
          <span className="nav-badge">{devices.length}</span>
        </div>
        <div
          className={`nav-item ${screen === "activity" ? "active" : ""}`}
          onClick={() => onSelectScreen("activity")}
        >
          <span className="nav-icon">≡</span>
          <span>Activity</span>
          {log.length > 0 && <span className="nav-badge">{log.length}</span>}
        </div>
        <div
          className={`nav-item ${screen === "settings" ? "active" : ""}`}
          onClick={() => onSelectScreen("settings")}
        >
          <span className="nav-icon">⚙</span>
          <span>Settings</span>
        </div>
      </nav>

      <div className="sidebar-section">
        <div className="section-header">
          <span className="section-title">Groups</span>
          <button
            className="section-add-btn"
            onClick={() => {
              onSetAddingGroup(true);
              onSetNewGroupName("");
            }}
            title="Add group"
          >
            +
          </button>
        </div>
        <div
          className={`group-item ${!selectedGroup ? "active" : ""}`}
          onClick={() => onSelectGroup(null)}
        >
          <span className="group-dot" />
          <span>All devices</span>
          <span className="group-count">
            {onlineCount}/{devices.length}
          </span>
        </div>
        {allGroups.map((g) => (
          <div key={g} className="group-row">
            {editingGroupName === g ? (
              <input
                className="group-edit-input"
                value={editingGroupValue}
                onChange={(e) => onSetEditingGroupValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onRenameGroup(g, editingGroupValue);
                  if (e.key === "Escape") onSetEditingGroupName(null);
                }}
                onBlur={() => onRenameGroup(g, editingGroupValue)}
                autoFocus
              />
            ) : (
              <div
                className={`group-item ${selectedGroup === g ? "active" : ""}`}
                onClick={() => onSelectGroup(g)}
              >
                <span className="group-dot" />
                <span className="group-label">{g}</span>
                <span className="group-count">
                  {devices.filter((d) => d.group === g && statuses[d.mac] === "online").length}/
                  {devices.filter((d) => d.group === g).length}
                </span>
                <div className="group-actions">
                  <button
                    className="group-action-btn"
                    title="Rename"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetEditingGroupName(g);
                      onSetEditingGroupValue(g);
                    }}
                  >
                    ✎
                  </button>
                  <button
                    className="group-action-btn"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteGroup(g);
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {addingGroup && (
          <input
            className="group-edit-input group-add-input"
            placeholder="New group name..."
            value={newGroupName}
            onChange={(e) => onSetNewGroupName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAddGroup();
              if (e.key === "Escape") onSetAddingGroup(false);
            }}
            onBlur={() => {
              if (newGroupName.trim()) onAddGroup();
              else onSetAddingGroup(false);
            }}
            autoFocus
          />
        )}
      </div>

      <div className="sidebar-stats">
        <div className="stats-label">Hosts Online</div>
        <div className="stats-count">
          {onlineCount} <span>/ {devices.length}</span>
        </div>
        <div className="stats-bar">
          <div
            className="stats-bar-fill"
            style={{
              width: devices.length ? `${(onlineCount / devices.length) * 100}%` : "0%",
            }}
          />
        </div>
      </div>
      <div className="sidebar-bcast">
        <span className="bcast-label">bcast</span>
        <span className="bcast-addr">{settings.broadcastAddr}</span>
      </div>
    </aside>
  );
}
