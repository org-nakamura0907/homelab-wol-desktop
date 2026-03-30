import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface Device {
  name: string;
  mac: string;
}

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceName, setDeviceName] = useState("");
  const [deviceMac, setDeviceMac] = useState("");

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
            {d.name} - {d.mac}
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
