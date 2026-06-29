import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { invoke } from "@tauri-apps/api/core";
import App from "./App";

vi.mock("@tauri-apps/api/core");

const DEFAULT_TAURI_SETTINGS = {
  broadcast_addr: "255.255.255.255",
  udp_port: 9,
  repeat_count: 1,
  confirm_on_wake: false,
  notify_on_success: true,
  auto_ping: false,
  log_activity: true,
};

function setupInvoke(devices: unknown[] = []) {
  (invoke as ReturnType<typeof vi.fn>).mockImplementation(async (cmd: string) => {
    if (cmd === "load_devices") return devices;
    if (cmd === "load_settings") return DEFAULT_TAURI_SETTINGS;
    if (cmd === "ping_device") throw new Error("Host unreachable");
    return undefined;
  });
}

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.confirm = vi.fn().mockReturnValue(true);
  });

  describe("Initial render", () => {
    it("shows DEVICES screen with add button on load", async () => {
      setupInvoke();
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));
      expect(screen.getByText("DEVICES")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "+ ADD HOST" })).toBeInTheDocument();
    });

    it("loads and displays devices on mount", async () => {
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());
      expect(screen.getByText("00:11:22:33:44:55")).toBeInTheDocument();
    });

    it("shows empty state when device list is empty", async () => {
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));
      expect(screen.getByText(/Add your first device/i)).toBeInTheDocument();
    });

    it("handles load error gracefully", async () => {
      (invoke as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Load failed"));
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalled());
      expect(screen.queryByText(/Server/)).not.toBeInTheDocument();
    });
  });

  describe("addDevice", () => {
    it("opens modal and adds a device", async () => {
      const user = userEvent.setup();
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));

      await user.click(screen.getByRole("button", { name: "+ ADD HOST" }));

      const modal = screen.getByRole("dialog");
      await user.type(within(modal).getByPlaceholderText("e.g. homeserver"), "New Server");
      await user.type(within(modal).getByPlaceholderText("AA:BB:CC:DD:EE:FF"), "11:22:33:44:55:66");
      await user.click(within(modal).getByRole("button", { name: "ADD HOST" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("save_devices", {
          devices: [{ name: "New Server", mac: "11:22:33:44:55:66" }],
        })
      );
    });

    it("disables submit button when name or mac is empty", async () => {
      const user = userEvent.setup();
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));

      await user.click(screen.getByRole("button", { name: "+ ADD HOST" }));
      const modal = screen.getByRole("dialog");
      expect(within(modal).getByRole("button", { name: "ADD HOST" })).toBeDisabled();
    });

    it("closes modal on CANCEL", async () => {
      const user = userEvent.setup();
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));

      await user.click(screen.getByRole("button", { name: "+ ADD HOST" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "CANCEL" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("selects group from dropdown when adding device", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Existing", mac: "00:11:22:33:44:55", group: "Servers" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Existing")).toBeInTheDocument());

      await user.click(screen.getByRole("button", { name: "+ ADD HOST" }));
      const modal = screen.getByRole("dialog");
      await user.type(within(modal).getByPlaceholderText("e.g. homeserver"), "New Host");
      await user.type(within(modal).getByPlaceholderText("AA:BB:CC:DD:EE:FF"), "AA:BB:CC:DD:EE:FF");
      await user.selectOptions(within(modal).getByRole("combobox"), "Servers");
      await user.click(within(modal).getByRole("button", { name: "ADD HOST" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("save_devices", {
          devices: expect.arrayContaining([
            expect.objectContaining({ name: "New Host", group: "Servers" }),
          ]),
        })
      );
    });

    it("adds device with optional IP address", async () => {
      const user = userEvent.setup();
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));

      await user.click(screen.getByRole("button", { name: "+ ADD HOST" }));
      const modal = screen.getByRole("dialog");
      await user.type(within(modal).getByPlaceholderText("e.g. homeserver"), "My Server");
      await user.type(within(modal).getByPlaceholderText("AA:BB:CC:DD:EE:FF"), "11:22:33:44:55:66");
      await user.type(within(modal).getByPlaceholderText("e.g. 192.168.1.100"), "10.0.0.1");
      await user.click(within(modal).getByRole("button", { name: "ADD HOST" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("save_devices", {
          devices: [expect.objectContaining({ name: "My Server", ip: "10.0.0.1" })],
        })
      );
    });

    it("closes modal via × button", async () => {
      const user = userEvent.setup();
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));

      await user.click(screen.getByRole("button", { name: "+ ADD HOST" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "×" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("shows error toast when add fails", async () => {
      const user = userEvent.setup();
      (invoke as ReturnType<typeof vi.fn>).mockImplementation(async (cmd: string) => {
        if (cmd === "load_devices") return [];
        if (cmd === "load_settings") return DEFAULT_TAURI_SETTINGS;
        if (cmd === "save_devices") throw new Error("Save failed");
        return undefined;
      });
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));

      await user.click(screen.getByRole("button", { name: "+ ADD HOST" }));
      const modal = screen.getByRole("dialog");
      await user.type(within(modal).getByPlaceholderText("e.g. homeserver"), "My Server");
      await user.type(within(modal).getByPlaceholderText("AA:BB:CC:DD:EE:FF"), "11:22:33:44:55:66");
      await user.click(within(modal).getByRole("button", { name: "ADD HOST" }));

      await waitFor(() => expect(screen.getByText(/Failed to add device/i)).toBeInTheDocument());
    });
  });

  describe("updateDevice", () => {
    it("updates device via drawer save", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));

      const nameInput = screen.getByDisplayValue("Server 1");
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Server");

      await user.click(screen.getByRole("button", { name: "SAVE" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("update_device", {
          index: 0,
          device: expect.objectContaining({ name: "Updated Server", mac: "00:11:22:33:44:55" }),
        })
      );
    });

    it("closes drawer when X is clicked", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));
      expect(screen.getByRole("button", { name: "SAVE" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "×" }));
      expect(screen.queryByRole("button", { name: "SAVE" })).not.toBeInTheDocument();
    });

    it("changes group select in drawer", async () => {
      const user = userEvent.setup();
      setupInvoke([
        { name: "Server 1", mac: "00:11:22:33:44:55", group: "Servers" },
        { name: "Server 2", mac: "AA:BB:CC:DD:EE:FF", group: "Servers" },
      ]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));
      const groupSelect = screen.getAllByRole("combobox")[0];
      await user.selectOptions(groupSelect, "Servers");

      await user.click(screen.getByRole("button", { name: "SAVE" }));
      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith(
          "update_device",
          expect.objectContaining({ device: expect.objectContaining({ group: "Servers" }) })
        )
      );
    });

    it("edits IP, MAC, and notes fields in drawer", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));

      await user.type(screen.getByPlaceholderText("e.g. 192.168.1.100"), "10.0.0.5");

      const macInput = screen.getByDisplayValue("00:11:22:33:44:55");
      await user.clear(macInput);
      await user.type(macInput, "FF:EE:DD:CC:BB:AA");

      await user.type(screen.getByPlaceholderText("Optional notes"), "my note");

      await user.click(screen.getByRole("button", { name: "SAVE" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("update_device", {
          index: 0,
          device: expect.objectContaining({ ip: "10.0.0.5", host: "my note" }),
        })
      );
    });

    it("shows error toast when update fails", async () => {
      const user = userEvent.setup();
      (invoke as ReturnType<typeof vi.fn>).mockImplementation(async (cmd: string) => {
        if (cmd === "load_devices") return [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        if (cmd === "load_settings") return DEFAULT_TAURI_SETTINGS;
        if (cmd === "update_device") throw new Error("Update failed");
        return undefined;
      });
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));
      await user.click(screen.getByRole("button", { name: "SAVE" }));

      await waitFor(() => expect(screen.getByText(/Failed to update/i)).toBeInTheDocument());
    });
  });

  describe("deleteDevice", () => {
    it("deletes device when confirmed", async () => {
      const user = userEvent.setup();
      globalThis.confirm = vi.fn().mockReturnValue(true);
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));
      await user.click(screen.getByRole("button", { name: "DELETE" }));

      await waitFor(() => expect(invoke).toHaveBeenCalledWith("delete_device", { index: 0 }));
      expect(screen.queryByText("Server 1")).not.toBeInTheDocument();
    });

    it("does not delete device when confirm is cancelled", async () => {
      const user = userEvent.setup();
      globalThis.confirm = vi.fn().mockReturnValue(false);
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));
      await user.click(screen.getByRole("button", { name: "DELETE" }));

      expect(invoke).not.toHaveBeenCalledWith("delete_device", expect.anything());
      expect(screen.getAllByText("Server 1").length).toBeGreaterThan(0);
    });

    it("handles delete error gracefully", async () => {
      const user = userEvent.setup();
      globalThis.confirm = vi.fn().mockReturnValue(true);
      (invoke as ReturnType<typeof vi.fn>).mockImplementation(async (cmd: string) => {
        if (cmd === "load_devices") return [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        if (cmd === "load_settings") return DEFAULT_TAURI_SETTINGS;
        if (cmd === "delete_device") throw new Error("Delete failed");
        return undefined;
      });
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));
      await user.click(screen.getByRole("button", { name: "DELETE" }));

      await waitFor(() => expect(invoke).toHaveBeenCalledWith("delete_device", { index: 0 }));
      expect(screen.getAllByText("Server 1").length).toBeGreaterThan(0);
    });
  });

  describe("wakeDevice", () => {
    it("sends magic packet when WAKE is clicked", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByRole("button", { name: "WAKE" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("send_magic_packet", {
          macAddress: "00:11:22:33:44:55",
          broadcastAddr: "255.255.255.255",
          udpPort: 9,
          repeatCount: 1,
        })
      );
    });

    it("shows error toast when wake fails", async () => {
      const user = userEvent.setup();
      (invoke as ReturnType<typeof vi.fn>).mockImplementation(async (cmd: string) => {
        if (cmd === "load_devices") return [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        if (cmd === "load_settings") return DEFAULT_TAURI_SETTINGS;
        if (cmd === "send_magic_packet") throw new Error("Network error");
        return undefined;
      });
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByRole("button", { name: "WAKE" }));

      await waitFor(() => expect(screen.getByText(/Failed to wake/i)).toBeInTheDocument());
    });

    it("wakes device from drawer WAKE NOW button", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));
      await user.click(screen.getByRole("button", { name: "WAKE NOW" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith(
          "send_magic_packet",
          expect.objectContaining({ macAddress: "00:11:22:33:44:55" })
        )
      );
    });
  });

  describe("navigation", () => {
    it("switches to Activity screen", async () => {
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));

      await userEvent.click(screen.getByText("Activity"));
      expect(screen.getByText("$ tail -f wol.log")).toBeInTheDocument();
    });

    it("switches to Settings screen", async () => {
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));

      await userEvent.click(screen.getByText("Settings"));
      expect(screen.getByText("Broadcast Address")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "SAVE SETTINGS" })).toBeInTheDocument();
    });
  });

  describe("groupManagement", () => {
    it("adds a group and shows it in sidebar and modal dropdown", async () => {
      const user = userEvent.setup();
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_devices"));

      await user.click(screen.getByTitle("Add group"));
      await user.type(screen.getByPlaceholderText("New group name..."), "Servers");
      await user.keyboard("{Enter}");

      expect(screen.getByText("Servers")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "+ ADD HOST" }));
      const modal = screen.getByRole("dialog");
      expect(within(modal).getByRole("option", { name: "Servers" })).toBeInTheDocument();
    });

    it("deletes a group and saves devices without that group", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55", group: "Servers" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByTitle("Delete"));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("save_devices", {
          devices: [{ name: "Server 1", mac: "00:11:22:33:44:55", group: undefined }],
        })
      );
      expect(screen.queryByText("Servers")).not.toBeInTheDocument();
    });

    it("renames a group and updates devices", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55", group: "Servers" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByTitle("Rename"));
      const input = screen.getByDisplayValue("Servers");
      await user.clear(input);
      await user.type(input, "Renamed");
      await user.keyboard("{Enter}");

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("save_devices", {
          devices: [{ name: "Server 1", mac: "00:11:22:33:44:55", group: "Renamed" }],
        })
      );
      await waitFor(() =>
        expect(within(screen.getByRole("complementary")).getByText("Renamed")).toBeInTheDocument()
      );
    });
  });

  describe("settings", () => {
    it("displays loaded settings in form", async () => {
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_settings"));

      await userEvent.click(screen.getByText("Settings"));

      expect(screen.getByDisplayValue("255.255.255.255")).toBeInTheDocument();
    });

    it("saves settings with correct payload", async () => {
      const user = userEvent.setup();
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_settings"));

      await user.click(screen.getByText("Settings"));

      const broadcastInput = screen.getByDisplayValue("255.255.255.255");
      await user.clear(broadcastInput);
      await user.type(broadcastInput, "192.168.1.255");

      await user.click(screen.getByRole("button", { name: "SAVE SETTINGS" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("save_settings", {
          settings: expect.objectContaining({ broadcast_addr: "192.168.1.255" }),
        })
      );
      await waitFor(() => expect(screen.getByText(/Settings saved/i)).toBeInTheDocument());
    });

    it("shows error toast when settings save fails", async () => {
      const user = userEvent.setup();
      (invoke as ReturnType<typeof vi.fn>).mockImplementation(async (cmd: string) => {
        if (cmd === "load_devices") return [];
        if (cmd === "load_settings") return DEFAULT_TAURI_SETTINGS;
        if (cmd === "save_settings") throw new Error("Save failed");
        return undefined;
      });
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_settings"));

      await user.click(screen.getByText("Settings"));
      await user.click(screen.getByRole("button", { name: "SAVE SETTINGS" }));

      await waitFor(() => expect(screen.getByText(/Failed to save settings/i)).toBeInTheDocument());
    });

    it("changes repeat count in settings", async () => {
      const user = userEvent.setup();
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_settings"));

      await user.click(screen.getByText("Settings"));

      const inputs = screen.getAllByRole("spinbutton");
      const repeatInput = inputs[1]; // port=inputs[0], repeat=inputs[1]
      await user.clear(repeatInput);
      await user.type(repeatInput, "3");

      await user.click(screen.getByRole("button", { name: "SAVE SETTINGS" }));
      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("save_settings", {
          settings: expect.objectContaining({ repeat_count: 3 }),
        })
      );
    });

    it("adjusts UDP port and toggle then saves", async () => {
      const user = userEvent.setup();
      setupInvoke([]);
      render(<App />);
      await waitFor(() => expect(invoke).toHaveBeenCalledWith("load_settings"));

      await user.click(screen.getByText("Settings"));

      const portInput = screen.getByDisplayValue("9");
      await user.clear(portInput);
      await user.type(portInput, "7");

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]); // confirmOnWake: false → true

      await user.click(screen.getByRole("button", { name: "SAVE SETTINGS" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("save_settings", {
          settings: expect.objectContaining({ udp_port: 7, confirm_on_wake: true }),
        })
      );
    });
  });

  describe("search", () => {
    it("filters devices by search query", async () => {
      const user = userEvent.setup();
      setupInvoke([
        { name: "Server Alpha", mac: "00:11:22:33:44:55" },
        { name: "Desktop Beta", mac: "AA:BB:CC:DD:EE:FF" },
      ]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server Alpha")).toBeInTheDocument());

      await user.type(screen.getByPlaceholderText("Search hosts..."), "Alpha");

      expect(screen.getByText("Server Alpha")).toBeInTheDocument();
      expect(screen.queryByText("Desktop Beta")).not.toBeInTheDocument();
    });
  });

  describe("groupFilter", () => {
    it("filters devices by selected group", async () => {
      setupInvoke([
        { name: "Server 1", mac: "00:11:22:33:44:55", group: "Servers" },
        { name: "Desktop 1", mac: "AA:BB:CC:DD:EE:FF", group: "Desktops" },
      ]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      const sidebar = screen.getByRole("complementary");
      await userEvent.click(within(sidebar).getByText("Servers"));

      expect(screen.getByText("Server 1")).toBeInTheDocument();
      expect(screen.queryByText("Desktop 1")).not.toBeInTheDocument();
    });
  });

  describe("activityLog", () => {
    it("logs activity when device is woken", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByRole("button", { name: "WAKE" }));
      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("send_magic_packet", expect.anything())
      );

      await user.click(screen.getByText("Activity"));

      await waitFor(() =>
        expect(
          screen.getByText(/WoL packet sent to Server 1.*00:11:22:33:44:55/i)
        ).toBeInTheDocument()
      );
    });

    it("clears activity log when CLEAR is clicked", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByRole("button", { name: "WAKE" }));
      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("send_magic_packet", expect.anything())
      );

      await user.click(screen.getByText("Activity"));
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "CLEAR" })).toBeInTheDocument()
      );

      await user.click(screen.getByRole("button", { name: "CLEAR" }));

      expect(screen.queryByRole("button", { name: "CLEAR" })).not.toBeInTheDocument();
      expect(screen.getByText(/No activity yet/i)).toBeInTheDocument();
    });
  });

  describe("ping", () => {
    it("shows unknown status for device with no IP when auto-ping is enabled", async () => {
      (invoke as ReturnType<typeof vi.fn>).mockImplementation(async (cmd: string) => {
        if (cmd === "load_devices") return [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        if (cmd === "load_settings") return { ...DEFAULT_TAURI_SETTINGS, auto_ping: true };
        return undefined;
      });
      const { container } = render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await waitFor(() => expect(container.querySelector(".status-dot.unknown")).toBeTruthy());
    });

    it("PING button appears in drawer only when device has IP", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55", ip: "192.168.1.1" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));
      expect(screen.getByRole("button", { name: "PING" })).toBeInTheDocument();
    });

    it("PING button is absent in drawer when device has no IP", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));
      expect(screen.queryByRole("button", { name: "PING" })).not.toBeInTheDocument();
    });

    it("shows online status and ping ms after PING button clicked", async () => {
      const user = userEvent.setup();
      (invoke as ReturnType<typeof vi.fn>).mockImplementation(async (cmd: string) => {
        if (cmd === "load_devices")
          return [{ name: "Server 1", mac: "00:11:22:33:44:55", ip: "192.168.1.1" }];
        if (cmd === "load_settings") return DEFAULT_TAURI_SETTINGS;
        if (cmd === "ping_device") return 42;
        return undefined;
      });
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByText("Server 1"));
      await user.click(screen.getByRole("button", { name: "PING" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith("ping_device", { ip: "192.168.1.1" })
      );
      await waitFor(() => expect(screen.getByText(/42ms/)).toBeInTheDocument());
    });
  });

  describe("viewMode", () => {
    it("switches to list view when list button is clicked", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      const { container } = render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByTitle("List view"));

      expect(container.querySelector(".device-row")).toBeTruthy();
      expect(container.querySelector(".device-card")).not.toBeTruthy();
    });

    it("opens drawer from list view", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByTitle("List view"));
      await user.click(screen.getByText("Server 1"));

      expect(screen.getByRole("button", { name: "WAKE NOW" })).toBeInTheDocument();
    });

    it("wakes device from list view WAKE button", async () => {
      const user = userEvent.setup();
      setupInvoke([{ name: "Server 1", mac: "00:11:22:33:44:55" }]);
      render(<App />);
      await waitFor(() => expect(screen.getByText("Server 1")).toBeInTheDocument());

      await user.click(screen.getByTitle("List view"));
      await user.click(screen.getByRole("button", { name: "WAKE" }));

      await waitFor(() =>
        expect(invoke).toHaveBeenCalledWith(
          "send_magic_packet",
          expect.objectContaining({ macAddress: "00:11:22:33:44:55" })
        )
      );
    });
  });
});
