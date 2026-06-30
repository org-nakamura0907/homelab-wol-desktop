import { useState, useEffect, useRef } from "react";
import { confirm } from "@tauri-apps/plugin-dialog";
import { Device, DeviceStatus } from "../../types/device";
import { AppSettings } from "../../types/settings";
import { ViewMode } from "../../types/ui";
import { useDeviceWake } from "../../hooks/useDeviceWake";
import { DeviceForm } from "./DeviceForm";
import { DeviceDrawer } from "./DeviceDrawer";
import { DeviceCard } from "./DeviceCard";
import { DeviceRow } from "./DeviceRow";

interface Props {
  devices: Device[];
  settings: AppSettings;
  statuses: Record<string, DeviceStatus>;
  pingMs: Record<string, number | null>;
  lastSeen: Record<string, Date | null>;
  allGroups: string[];
  selectedGroup: string | null;
  onAddDevice: (device: Device) => Promise<void>;
  onUpdateDevice: (index: number, device: Device) => Promise<void>;
  onDeleteDevice: (index: number) => Promise<void>;
  onPingDevice: (device: Device) => Promise<boolean>;
  onSetWaking: (mac: string) => void;
  onClearStatus: (mac: string) => void;
  onClearStatusIfWaking: (mac: string) => void;
  onAddToast: (message: string, type: "success" | "error" | "info") => void;
  onAddLog: (message: string, level: "info" | "success" | "error") => void;
}

/** デバイス画面（グリッド/リスト表示、ドロワー、追加モーダル）を描画する。 */
export function DevicesScreen({
  devices,
  settings,
  statuses,
  pingMs,
  lastSeen,
  allGroups,
  selectedGroup,
  onAddDevice,
  onUpdateDevice,
  onDeleteDevice,
  onPingDevice,
  onSetWaking,
  onClearStatus,
  onClearStatusIfWaking,
  onAddToast,
  onAddLog,
}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState<Device>({
    name: "",
    mac: "",
    ip: "",
    host: "",
    group: "",
  });
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null);
  const [drawerForm, setDrawerForm] = useState<Device>({ name: "", mac: "" });
  const drawerRef = useRef<HTMLDivElement>(null);

  const { wakeDevice } = useDeviceWake({
    settings,
    pingDevice: onPingDevice,
    setWaking: onSetWaking,
    clearStatus: onClearStatus,
    clearStatusIfWaking: onClearStatusIfWaking,
    addToast: onAddToast,
    addLog: onAddLog,
  });

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

  const statusKey = (d: Device) => d.mac;

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

    try {
      await onAddDevice(device);
      setShowModal(false);
      setModalForm({ name: "", mac: "", ip: "", host: "", group: "" });
      onAddToast(`${device.name} added`, "success");
      if (settings.logActivity) onAddLog(`Device added: ${device.name}`, "info");
    } catch (e) {
      onAddToast(`Failed to add device: ${e}`, "error");
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
      await onUpdateDevice(drawerIndex, device);
      onAddToast(`${device.name} updated`, "success");
    } catch (e) {
      onAddToast(`Failed to update: ${e}`, "error");
    }
  }

  async function handleDeleteDevice(index: number) {
    const device = devices[index];
    if (!(await confirm(`Delete "${device.name}"?`))) return;

    try {
      await onDeleteDevice(index);
      if (drawerIndex === index) setDrawerIndex(null);
      else if (drawerIndex !== null && drawerIndex > index) setDrawerIndex(drawerIndex - 1);
      onAddToast(`${device.name} deleted`, "info");
      if (settings.logActivity) onAddLog(`Device deleted: ${device.name}`, "info");
    } catch (e) {
      onAddToast(`Failed to delete: ${e}`, "error");
    }
  }

  function openDrawer(index: number) {
    setDrawerIndex(index);
    setDrawerForm({ ...devices[index] });
  }

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

  const drawerDevice = drawerIndex !== null ? devices[drawerIndex] : null;

  return (
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
              return (
                <DeviceCard
                  key={statusKey(d)}
                  device={d}
                  status={statuses[statusKey(d)] ?? "offline"}
                  pingMs={pingMs[statusKey(d)] ?? null}
                  lastSeen={lastSeen[statusKey(d)] ?? null}
                  selected={drawerIndex === idx}
                  onClick={() => openDrawer(idx)}
                  onWake={() => wakeDevice(d)}
                />
              );
            })}
          </div>
        ) : (
          <div className="devices-list">
            {filtered.map((d) => {
              const idx = devices.indexOf(d);
              return (
                <DeviceRow
                  key={statusKey(d)}
                  device={d}
                  status={statuses[statusKey(d)] ?? "offline"}
                  pingMs={pingMs[statusKey(d)] ?? null}
                  lastSeen={lastSeen[statusKey(d)] ?? null}
                  selected={drawerIndex === idx}
                  onClick={() => openDrawer(idx)}
                  onWake={() => wakeDevice(d)}
                />
              );
            })}
          </div>
        )}
      </div>

      {drawerDevice && (
        <DeviceDrawer
          ref={drawerRef}
          device={drawerDevice}
          form={drawerForm}
          status={statuses[statusKey(drawerDevice)] ?? "offline"}
          allGroups={allGroups}
          onFormChange={setDrawerForm}
          onSave={handleSaveDrawer}
          onDelete={() => drawerIndex !== null && handleDeleteDevice(drawerIndex)}
          onWake={() => drawerDevice && wakeDevice(drawerDevice)}
          onPing={() => drawerIndex !== null && onPingDevice(devices[drawerIndex])}
          onClose={() => setDrawerIndex(null)}
        />
      )}

      {showModal && (
        <DeviceForm
          form={modalForm}
          allGroups={allGroups}
          onChange={setModalForm}
          onSubmit={handleAddDevice}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
