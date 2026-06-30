import { useState, useEffect } from "react";
import "./App.css";
import { Screen } from "./types/ui";
import { useDevices } from "./hooks/useDevices";
import { useSettings } from "./hooks/useSettings";
import { useToasts } from "./hooks/useToasts";
import { useActivityLog } from "./hooks/useActivityLog";
import { usePingStatus } from "./hooks/usePingStatus";
import { useGroups } from "./hooks/useGroups";
import { Sidebar } from "./components/Sidebar";
import { DevicesScreen } from "./features/devices/DevicesScreen";
import { ActivityScreen } from "./features/activity/ActivityScreen";
import { SettingsScreen } from "./features/settings/SettingsScreen";

function App() {
  const [screen, setScreen] = useState<Screen>("devices");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const { devices, loadDevices, addDevice, updateDevice, deleteDevice, saveDevices } = useDevices();
  const { settings, settingsForm, setSettingsForm, loadSettings, saveSettings } = useSettings();
  const { toasts, addToast } = useToasts();
  const { log, addLog, clearLog } = useActivityLog();
  const { statuses, pingMs, lastSeen, pingDevice, setWaking, clearStatus, clearStatusIfWaking } =
    usePingStatus();
  const {
    allGroups,
    addingGroup,
    newGroupName,
    editingGroupName,
    editingGroupValue,
    setAddingGroup,
    setNewGroupName,
    setEditingGroupName,
    setEditingGroupValue,
    handleAddGroup,
    handleDeleteGroup,
    handleRenameGroup,
  } = useGroups(devices, selectedGroup, setSelectedGroup, saveDevices, addToast);

  useEffect(() => {
    Promise.all([loadDevices(), loadSettings()])
      .then(([devs, parsed]) => {
        if (parsed.autoPing) {
          devs.forEach((d) => pingDevice(d));
        }
      })
      .catch(console.error);
  }, []);

  async function handleSaveSettings() {
    try {
      await saveSettings();
      addToast("Settings saved", "success");
    } catch (e) {
      addToast(`Failed to save settings: ${e}`, "error");
    }
  }

  return (
    <div className="app">
      <div className="app-body">
        <Sidebar
          screen={screen}
          devices={devices}
          log={log}
          statuses={statuses}
          settings={settings}
          selectedGroup={selectedGroup}
          allGroups={allGroups}
          addingGroup={addingGroup}
          newGroupName={newGroupName}
          editingGroupName={editingGroupName}
          editingGroupValue={editingGroupValue}
          onSelectScreen={setScreen}
          onSelectGroup={setSelectedGroup}
          onSetAddingGroup={setAddingGroup}
          onSetNewGroupName={setNewGroupName}
          onSetEditingGroupName={setEditingGroupName}
          onSetEditingGroupValue={setEditingGroupValue}
          onAddGroup={handleAddGroup}
          onDeleteGroup={handleDeleteGroup}
          onRenameGroup={handleRenameGroup}
        />

        <main className="content">
          {screen === "devices" && (
            <DevicesScreen
              devices={devices}
              settings={settings}
              statuses={statuses}
              pingMs={pingMs}
              lastSeen={lastSeen}
              allGroups={allGroups}
              selectedGroup={selectedGroup}
              onAddDevice={addDevice}
              onUpdateDevice={updateDevice}
              onDeleteDevice={deleteDevice}
              onPingDevice={pingDevice}
              onSetWaking={setWaking}
              onClearStatus={clearStatus}
              onClearStatusIfWaking={clearStatusIfWaking}
              onAddToast={addToast}
              onAddLog={addLog}
            />
          )}
          {screen === "activity" && <ActivityScreen log={log} onClear={clearLog} />}
          {screen === "settings" && (
            <SettingsScreen
              settingsForm={settingsForm}
              onChange={setSettingsForm}
              onSave={handleSaveSettings}
            />
          )}
        </main>
      </div>

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
