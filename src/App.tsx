import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import "./App.css";

interface Device {
  name: string;
  mac: string;
}

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceName, setDeviceName] = useState("");
  const [deviceMac, setDeviceMac] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingMac, setEditingMac] = useState("");

  useEffect(() => {
    loadDevices();
  }, []);

  async function loadDevices() {
    try {
      const loaded = await invoke<Device[]>("load_devices");
      setDevices(loaded);
    } catch (e) {
      console.error(e);
    }
  }

  async function saveDevices(newDevices: Device[]) {
    try {
      await invoke("save_devices", { devices: newDevices });
    } catch (e) {
      console.error(e);
    }
  }

  async function wakeDevice(mac: string) {
    try {
      await invoke("send_magic_packet", { macAddress: mac });
      alert(`WoL packet sent to ${mac}`);
    } catch (e) {
      console.error(e);
      alert(`Failed to send WoL packet: ${e}`);
    }
  }

  function startEditingDevice(index: number) {
    setEditingIndex(index);
    setEditingName(devices[index].name);
    setEditingMac(devices[index].mac);
  }

  async function saveEditingDevice() {
    if (editingIndex === null || !editingName || !editingMac) return;

    try {
      await invoke("update_device", {
        index: editingIndex,
        name: editingName,
        mac: editingMac,
      });
      const updatedDevices = [...devices];
      updatedDevices[editingIndex] = {
        name: editingName,
        mac: editingMac,
      };
      setDevices(updatedDevices);
      setEditingIndex(null);
      setEditingName("");
      setEditingMac("");
    } catch (e) {
      console.error(e);
      alert(`Failed to update device: ${e}`);
    }
  }

  function cancelEditingDevice() {
    setEditingIndex(null);
    setEditingName("");
    setEditingMac("");
  }

  async function deleteDevice(index: number) {
    const confirmed = await confirm("Are you sure you want to delete this device?");

    if (!confirmed) {
      return;
    }

    try {
      await invoke("delete_device", { index });

      const updatedDevices = devices.filter((_, i) => i !== index);
      setDevices(updatedDevices);
    } catch (e) {
      console.error(e);
      alert(`Failed to delete device: ${e}`);
    }
  }

  function addDevice() {
    if (deviceName && deviceMac) {
      const newDevices = [...devices, { name: deviceName, mac: deviceMac }];
      setDevices(newDevices);
      setDeviceName("");
      setDeviceMac("");
      saveDevices(newDevices);
    }
  }

  return (
    <main className="container">
      <h1>WoL Devices</h1>

      <ul>
        {devices.map((d, i) => (
          <li key={i}>
            {editingIndex === i ? (
              <div>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Device Name"
                />
                <input
                  value={editingMac}
                  onChange={(e) => setEditingMac(e.target.value)}
                  placeholder="MAC Address"
                />
                <button onClick={() => saveEditingDevice()}>Save</button>
                <button onClick={() => cancelEditingDevice()}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>
                  {d.name} - {d.mac}
                </span>
                <button onClick={() => wakeDevice(d.mac)}>Wake</button>
                <button onClick={() => startEditingDevice(i)}>Edit</button>
                <button onClick={() => deleteDevice(i)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addDevice();
        }}
      >
        <input
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          placeholder="Device Name"
        />
        <input
          value={deviceMac}
          onChange={(e) => setDeviceMac(e.target.value)}
          placeholder="MAC Address"
        />
        <button type="submit">Add Device</button>
      </form>
    </main>
  );
}

export default App;
