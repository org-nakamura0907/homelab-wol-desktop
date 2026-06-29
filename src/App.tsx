import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface Device {
  name: string;
  mac: string;
  ip?: string;
  host?: string;
  group?: string;
}

interface TauriSettings {
  broadcast_addr: string;
  udp_port: number;
  repeat_count: number;
  confirm_on_wake: boolean;
  notify_on_success: boolean;
  auto_ping: boolean;
  log_activity: boolean;
}

interface AppSettings {
  broadcastAddr: string;
  udpPort: number;
  repeatCount: number;
  confirmOnWake: boolean;
  notifyOnSuccess: boolean;
  autoPing: boolean;
  logActivity: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface LogEntry {
  id: string;
  ts: Date;
  message: string;
  level: "info" | "success" | "error";
}

type Screen = "devices" | "activity" | "settings";
type ViewMode = "grid" | "list";
type DeviceStatus = "online" | "offline" | "waking";

const DEFAULT_SETTINGS: AppSettings = {
  broadcastAddr: "255.255.255.255",
  udpPort: 9,
  repeatCount: 1,
  confirmOnWake: false,
  notifyOnSuccess: true,
  autoPing: false,
  logActivity: true,
};

function fromTauri(s: TauriSettings): AppSettings {
  return {
    broadcastAddr: s.broadcast_addr,
    udpPort: s.udp_port,
    repeatCount: s.repeat_count,
    confirmOnWake: s.confirm_on_wake,
    notifyOnSuccess: s.notify_on_success,
    autoPing: s.auto_ping,
    logActivity: s.log_activity,
  };
}

function toTauri(s: AppSettings): TauriSettings {
  return {
    broadcast_addr: s.broadcastAddr,
    udp_port: s.udpPort,
    repeat_count: s.repeatCount,
    confirm_on_wake: s.confirmOnWake,
    notify_on_success: s.notifyOnSuccess,
    auto_ping: s.autoPing,
    log_activity: s.logActivity,
  };
}

let _toastId = 0;
let _logId = 0;

function App() {
  const [screen, setScreen] = useState<Screen>("devices");
  const [devices, setDevices] = useState<Device[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [settingsForm, setSettingsForm] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, DeviceStatus>>({});
  const [log, setLog] = useState<LogEntry[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Drawer state
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);
  const [drawerForm, setDrawerForm] = useState<Device>({ name: "", mac: "" });
  const drawerRef = useRef<HTMLDivElement>(null);

  // Add modal state
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState<Device>({
    name: "",
    mac: "",
    ip: "",
    host: "",
    group: "",
  });

  // Group management state
  const [extraGroups, setExtraGroups] = useState<string[]>([]);
  const [addingGroup, setAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const [editingGroupValue, setEditingGroupValue] = useState("");

  useEffect(() => {
    invoke<Device[]>("load_devices").then(setDevices).catch(console.error);
    invoke<TauriSettings>("load_settings")
      .then((s) => {
        const parsed = fromTauri(s);
        setSettings(parsed);
        setSettingsForm(parsed);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (drawerIndex === null) return;
    function onMouseDown(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerIndex(null);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [drawerIndex]);

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = `t${++_toastId}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2900);
  }, []);

  const addLog = useCallback((message: string, level: LogEntry["level"]) => {
    const id = `l${++_logId}`;
    setLog((prev) => [{ id, ts: new Date(), message, level }, ...prev]);
  }, []);

  const statusKey = (d: Device) => d.mac;

  async function handleWake(index: number) {
    const device = devices[index];
    if (!device) return;

    if (settings.confirmOnWake && !window.confirm(`Send WoL packet to ${device.name}?`)) return;

    setStatuses((prev) => ({ ...prev, [statusKey(device)]: "waking" }));

    try {
      await invoke("send_magic_packet", {
        macAddress: device.mac,
        broadcastAddr: settings.broadcastAddr,
        udpPort: settings.udpPort,
        repeatCount: settings.repeatCount,
      });
      if (settings.notifyOnSuccess) addToast(`WoL packet sent to ${device.name}`, "success");
      if (settings.logActivity)
        addLog(`WoL packet sent to ${device.name} (${device.mac})`, "success");
      setTimeout(() => {
        setStatuses((prev) => {
          const next = { ...prev };
          if (next[statusKey(device)] === "waking") delete next[statusKey(device)];
          return next;
        });
      }, 10000);
    } catch (e) {
      addToast(`Failed to wake ${device.name}: ${e}`, "error");
      if (settings.logActivity) addLog(`Failed to wake ${device.name}: ${e}`, "error");
      setStatuses((prev) => {
        const next = { ...prev };
        delete next[statusKey(device)];
        return next;
      });
    }
  }

  async function handleAddDevice() {
    const { name, mac, ip, host, group } = modalForm;
    if (!name.trim() || !mac.trim()) return;

    const device: Device = {
      name: name.trim(),
      mac: mac.trim().toUpperCase(),
      ...(ip?.trim() ? { ip: ip.trim() } : {}),
      ...(host?.trim() ? { host: host.trim() } : {}),
      ...(group?.trim() ? { group: group.trim() } : {}),
    };

    const next = [...devices, device];
    try {
      await invoke("save_devices", { devices: next });
      setDevices(next);
      setShowModal(false);
      setModalForm({ name: "", mac: "", ip: "", host: "", group: "" });
      addToast(`${device.name} added`, "success");
      if (settings.logActivity) addLog(`Device added: ${device.name}`, "info");
    } catch (e) {
      addToast(`Failed to add device: ${e}`, "error");
    }
  }

  async function handleSaveDrawer() {
    if (drawerIndex === null) return;
    const { name, mac } = drawerForm;
    if (!name.trim() || !mac.trim()) return;

    const device: Device = {
      ...drawerForm,
      name: drawerForm.name.trim(),
      mac: drawerForm.mac.trim().toUpperCase(),
    };

    try {
      await invoke("update_device", { index: drawerIndex, device });
      const next = [...devices];
      next[drawerIndex] = device;
      setDevices(next);
      addToast(`${device.name} updated`, "success");
    } catch (e) {
      addToast(`Failed to update: ${e}`, "error");
    }
  }

  async function handleDeleteDevice(index: number) {
    const device = devices[index];
    if (!window.confirm(`Delete "${device.name}"?`)) return;

    try {
      await invoke("delete_device", { index });
      const next = devices.filter((_, i) => i !== index);
      setDevices(next);
      if (drawerIndex === index) setDrawerIndex(null);
      else if (drawerIndex !== null && drawerIndex > index) setDrawerIndex(drawerIndex - 1);
      addToast(`${device.name} deleted`, "info");
      if (settings.logActivity) addLog(`Device deleted: ${device.name}`, "info");
    } catch (e) {
      addToast(`Failed to delete: ${e}`, "error");
    }
  }

  async function handleSaveSettings() {
    try {
      await invoke("save_settings", { settings: toTauri(settingsForm) });
      setSettings(settingsForm);
      addToast("Settings saved", "success");
    } catch (e) {
      addToast(`Failed to save settings: ${e}`, "error");
    }
  }

  function openDrawer(index: number) {
    setDrawerIndex(index);
    setDrawerForm({ ...devices[index] });
  }

  function handleAddGroup() {
    const name = newGroupName.trim();
    if (name && !allGroups.includes(name)) {
      setExtraGroups((prev) => [...prev, name]);
    }
    setAddingGroup(false);
    setNewGroupName("");
  }

  async function handleDeleteGroup(group: string) {
    const updated = devices.map((d) => (d.group === group ? { ...d, group: undefined } : d));
    if (updated.some((d, i) => d !== devices[i])) {
      try {
        await invoke("save_devices", { devices: updated });
        setDevices(updated);
      } catch (e) {
        addToast(`Failed to save: ${e}`, "error");
        return;
      }
    }
    setExtraGroups((prev) => prev.filter((g) => g !== group));
    if (selectedGroup === group) setSelectedGroup(null);
  }

  async function handleRenameGroup(oldName: string, newName: string) {
    setEditingGroupName(null);
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;
    const updated = devices.map((d) => (d.group === oldName ? { ...d, group: trimmed } : d));
    if (updated.some((d, i) => d !== devices[i])) {
      try {
        await invoke("save_devices", { devices: updated });
        setDevices(updated);
      } catch (e) {
        addToast(`Failed to rename group: ${e}`, "error");
        return;
      }
    }
    setExtraGroups((prev) => prev.map((g) => (g === oldName ? trimmed : g)));
    if (selectedGroup === oldName) setSelectedGroup(trimmed);
  }

  // Derived
  const allGroups = Array.from(
    new Set([...extraGroups, ...devices.flatMap((d) => (d.group ? [d.group] : []))])
  );

  const filtered = devices.filter((d) => {
    const matchGroup = !selectedGroup || d.group === selectedGroup;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.mac.toLowerCase().includes(q) ||
      (d.ip?.toLowerCase().includes(q) ?? false);
    return matchGroup && matchSearch;
  });

  const onlineCount = Object.values(statuses).filter((s) => s === "online").length;

  const fmtTs = (ts: Date) => ts.toTimeString().slice(0, 8);

  const drawerDevice = drawerIndex !== null ? devices[drawerIndex] : null;

  return (
    <div className="app">
      <div className="app-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">[WOL]</div>
            <div className="logo-sub">wake-on-lan manager</div>
          </div>

          <nav className="sidebar-nav">
            <div
              className={`nav-item ${screen === "devices" ? "active" : ""}`}
              onClick={() => setScreen("devices")}
            >
              <span className="nav-icon">⊞</span>
              <span>Devices</span>
              <span className="nav-badge">{devices.length}</span>
            </div>
            <div
              className={`nav-item ${screen === "activity" ? "active" : ""}`}
              onClick={() => setScreen("activity")}
            >
              <span className="nav-icon">≡</span>
              <span>Activity</span>
              {log.length > 0 && <span className="nav-badge">{log.length}</span>}
            </div>
            <div
              className={`nav-item ${screen === "settings" ? "active" : ""}`}
              onClick={() => setScreen("settings")}
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
                  setAddingGroup(true);
                  setNewGroupName("");
                }}
                title="Add group"
              >
                +
              </button>
            </div>
            <div
              className={`group-item ${!selectedGroup ? "active" : ""}`}
              onClick={() => setSelectedGroup(null)}
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
                    onChange={(e) => setEditingGroupValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameGroup(g, editingGroupValue);
                      if (e.key === "Escape") setEditingGroupName(null);
                    }}
                    onBlur={() => handleRenameGroup(g, editingGroupValue)}
                    autoFocus
                  />
                ) : (
                  <div
                    className={`group-item ${selectedGroup === g ? "active" : ""}`}
                    onClick={() => setSelectedGroup(g)}
                  >
                    <span className="group-dot" />
                    <span className="group-label">{g}</span>
                    <span className="group-count">
                      {
                        devices.filter((d) => d.group === g && statuses[statusKey(d)] === "online")
                          .length
                      }
                      /{devices.filter((d) => d.group === g).length}
                    </span>
                    <div className="group-actions">
                      <button
                        className="group-action-btn"
                        title="Rename"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingGroupName(g);
                          setEditingGroupValue(g);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className="group-action-btn"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(g);
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
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddGroup();
                  if (e.key === "Escape") setAddingGroup(false);
                }}
                onBlur={() => {
                  if (newGroupName.trim()) handleAddGroup();
                  else setAddingGroup(false);
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

        {/* Main content */}
        <main className="content">
          {/* Devices screen */}
          {screen === "devices" && (
            <>
              <div className="screen-header">
                <span className="screen-title">DEVICES</span>
                <input
                  className="screen-search"
                  placeholder="Search hosts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="header-actions">
                  <button
                    className={`icon-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                  >
                    ⊞
                  </button>
                  <button
                    className={`icon-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    title="List view"
                  >
                    ≡
                  </button>
                  <button className="add-btn" onClick={() => setShowModal(true)}>
                    + ADD HOST
                  </button>
                </div>
              </div>

              <div className="devices-content">
                {filtered.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">⊡</div>
                    <div className="empty-title">No hosts found</div>
                    <div className="empty-sub">
                      {devices.length === 0
                        ? "Add your first device to get started"
                        : "Try adjusting your search or group filter"}
                    </div>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="devices-grid">
                    {filtered.map((d) => {
                      const idx = devices.indexOf(d);
                      const status = statuses[statusKey(d)] ?? "offline";
                      return (
                        <div
                          key={statusKey(d)}
                          className={`device-card ${drawerIndex === idx ? "selected" : ""}`}
                          onClick={() => openDrawer(idx)}
                        >
                          <div className="card-header">
                            <div className={`status-dot ${status}`} />
                            <div className="card-name">{d.name}</div>
                            {d.group && <div className="card-group">{d.group}</div>}
                          </div>
                          <div className="card-meta">
                            {d.ip && <div className="card-ip">{d.ip}</div>}
                            <div className="card-mac">{d.mac}</div>
                          </div>
                          <div className="card-footer">
                            <span className={`card-status-text ${status}`}>
                              {status === "waking" ? "waking..." : status}
                            </span>
                            <button
                              className="wake-btn"
                              disabled={status === "waking"}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWake(idx);
                              }}
                            >
                              WAKE
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="devices-list">
                    {filtered.map((d) => {
                      const idx = devices.indexOf(d);
                      const status = statuses[statusKey(d)] ?? "offline";
                      return (
                        <div
                          key={statusKey(d)}
                          className={`device-row ${drawerIndex === idx ? "selected" : ""}`}
                          onClick={() => openDrawer(idx)}
                        >
                          <div className={`status-dot ${status}`} />
                          <div className="row-name">{d.name}</div>
                          {d.group && (
                            <div className="row-group">
                              <span className="card-group">{d.group}</span>
                            </div>
                          )}
                          {d.ip && <div className="row-ip">{d.ip}</div>}
                          <div className="row-mac">{d.mac}</div>
                          <button
                            className="wake-btn"
                            disabled={status === "waking"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWake(idx);
                            }}
                          >
                            WAKE
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Activity screen */}
          {screen === "activity" && (
            <div className="activity-screen">
              <div className="terminal-header">
                <span>$ tail -f wol.log</span>
                {log.length > 0 && (
                  <button className="clear-log-btn" onClick={() => setLog([])}>
                    CLEAR
                  </button>
                )}
              </div>
              <div className="terminal-log">
                {log.length === 0 ? (
                  <div className="terminal-empty">
                    No activity yet. Wake a device to get started.
                    <span className="terminal-cursor" />
                  </div>
                ) : (
                  log.map((entry) => (
                    <div key={entry.id} className={`log-entry ${entry.level}`}>
                      <span className="log-ts">[{fmtTs(entry.ts)}]</span>
                      <span className="log-msg">{entry.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings screen */}
          {screen === "settings" && (
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
                    onChange={(e) =>
                      setSettingsForm((p) => ({ ...p, broadcastAddr: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setSettingsForm((p) => ({ ...p, udpPort: Number(e.target.value) }))
                    }
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
                    onChange={(e) =>
                      setSettingsForm((p) => ({ ...p, repeatCount: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div className="settings-section">
                <div className="settings-section-title">Behavior</div>
                {(
                  [
                    [
                      "confirmOnWake",
                      "Confirm before wake",
                      "Show confirmation dialog before sending",
                    ],
                    [
                      "notifyOnSuccess",
                      "Notify on success",
                      "Show toast notification on successful send",
                    ],
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
                        onChange={(e) =>
                          setSettingsForm((p) => ({ ...p, [key]: e.target.checked }))
                        }
                      />
                      <span className="toggle-track" />
                    </label>
                  </div>
                ))}
              </div>

              <button className="settings-save-btn" onClick={handleSaveSettings}>
                SAVE SETTINGS
              </button>
            </div>
          )}
        </main>

        {/* Device drawer */}
        {drawerDevice && (
          <div className="drawer-overlay">
            <div className="drawer" ref={drawerRef}>
              <div className="drawer-header">
                <span className="drawer-title">{drawerDevice.name}</span>
                <button className="drawer-close" onClick={() => setDrawerIndex(null)}>
                  ×
                </button>
              </div>
              <div className="drawer-body">
                <div className="drawer-status-row">
                  <div className={`status-dot ${statuses[statusKey(drawerDevice)] ?? "offline"}`} />
                  <span className="drawer-status-text">
                    {statuses[statusKey(drawerDevice)] ?? "offline"}
                  </span>
                </div>
                <button
                  className="drawer-wake-btn"
                  disabled={statuses[statusKey(drawerDevice)] === "waking"}
                  onClick={() => drawerIndex !== null && handleWake(drawerIndex)}
                >
                  {statuses[statusKey(drawerDevice)] === "waking" ? "SENDING..." : "WAKE NOW"}
                </button>

                <div className="drawer-section-title">Details</div>
                <div className="drawer-field">
                  <label>Hostname</label>
                  <input
                    placeholder="e.g. homeserver"
                    value={drawerForm.name}
                    onChange={(e) => setDrawerForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="drawer-field">
                  <label>IP Address</label>
                  <input
                    placeholder="e.g. 192.168.1.100"
                    value={drawerForm.ip ?? ""}
                    onChange={(e) => setDrawerForm((p) => ({ ...p, ip: e.target.value }))}
                  />
                </div>
                <div className="drawer-field">
                  <label>MAC Address</label>
                  <input
                    className="mono"
                    placeholder="AA:BB:CC:DD:EE:FF"
                    value={drawerForm.mac}
                    onChange={(e) => setDrawerForm((p) => ({ ...p, mac: e.target.value }))}
                  />
                </div>
                <div className="drawer-field">
                  <label>Group</label>
                  <select
                    value={drawerForm.group ?? ""}
                    onChange={(e) => setDrawerForm((p) => ({ ...p, group: e.target.value }))}
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
                    value={drawerForm.host ?? ""}
                    onChange={(e) => setDrawerForm((p) => ({ ...p, host: e.target.value }))}
                  />
                </div>
              </div>
              <div className="drawer-actions">
                <button className="drawer-save-btn" onClick={handleSaveDrawer}>
                  SAVE
                </button>
                <button
                  className="drawer-delete-btn"
                  onClick={() => drawerIndex !== null && handleDeleteDevice(drawerIndex)}
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add device modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <span className="modal-title">ADD HOST</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>
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
                  value={modalForm.name}
                  onChange={(e) => setModalForm((p) => ({ ...p, name: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDevice()}
                />
              </div>
              <div className="form-field">
                <label>IP Address</label>
                <input
                  placeholder="e.g. 192.168.1.100"
                  value={modalForm.ip ?? ""}
                  onChange={(e) => setModalForm((p) => ({ ...p, ip: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>
                  MAC Address <span className="required">*</span>
                </label>
                <input
                  placeholder="AA:BB:CC:DD:EE:FF"
                  value={modalForm.mac}
                  onChange={(e) => setModalForm((p) => ({ ...p, mac: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDevice()}
                />
              </div>
              <div className="form-field">
                <label>Group</label>
                <select
                  value={modalForm.group ?? ""}
                  onChange={(e) => setModalForm((p) => ({ ...p, group: e.target.value }))}
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
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                CANCEL
              </button>
              <button
                className="submit-btn"
                disabled={!modalForm.name.trim() || !modalForm.mac.trim()}
                onClick={handleAddDevice}
              >
                ADD HOST
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className={`toast-icon ${t.type}`}>
              {t.type === "success" ? "✓" : t.type === "error" ? "✗" : "ℹ"}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
