import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { invoke } from "@tauri-apps/api/core";
import { confirm } from "@tauri-apps/plugin-dialog";
import App from "./App";

// Mock Tauri API
vi.mock("@tauri-apps/api/core");
vi.mock("@tauri-apps/plugin-dialog");

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Device Management", () => {
    describe("loadDevices", () => {
      it("should load devices on mount", async () => {
        const mockDevices = [
          { name: "Server 1", mac: "00:11:22:33:44:55" },
          { name: "Server 2", mac: "aa:bb:cc:dd:ee:ff" },
        ];
        (invoke as any).mockResolvedValue(mockDevices);

        render(<App />);

        await waitFor(() => {
          expect(invoke).toHaveBeenCalledWith("load_devices");
        });

        expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
        expect(screen.getByText("Server 2 - aa:bb:cc:dd:ee:ff")).toBeInTheDocument();
      });

      it("should handle empty device list", async () => {
        (invoke as any).mockResolvedValue([]);

        render(<App />);

        await waitFor(() => {
          expect(invoke).toHaveBeenCalledWith("load_devices");
        });

        expect(screen.queryByText(/:/)).not.toBeInTheDocument();
      });

      it("should handle load error gracefully", async () => {
        (invoke as any).mockRejectedValue(new Error("Load failed"));

        render(<App />);

        await waitFor(() => {
          expect(invoke).toHaveBeenCalledWith("load_devices");
        });

        expect(screen.queryByText(/:/)).not.toBeInTheDocument();
      });
    });

    describe("addDevice", () => {
      it("should add a new device", async () => {
        const user = userEvent.setup();
        (invoke as any).mockResolvedValue([]);

        render(<App />);

        const nameInput = screen.getByPlaceholderText("Device Name");
        const macInput = screen.getByPlaceholderText("MAC Address");
        const addButton = screen.getByRole("button", { name: "Add Device" });

        await user.type(nameInput, "New Server");
        await user.type(macInput, "11:22:33:44:55:66");
        await user.click(addButton);

        await waitFor(() => {
          expect(invoke).toHaveBeenCalledWith("save_devices", {
            devices: [{ name: "New Server", mac: "11:22:33:44:55:66" }],
          });
        });

        expect(nameInput).toHaveValue("");
        expect(macInput).toHaveValue("");
      });

      it("should not add device with empty fields", async () => {
        const user = userEvent.setup();
        (invoke as any).mockResolvedValue([]);

        render(<App />);

        const addButton = screen.getByRole("button", { name: "Add Device" });
        await user.click(addButton);

        expect(invoke).not.toHaveBeenCalledWith("save_devices", expect.anything());
      });

      it("should not add device if only name is filled", async () => {
        const user = userEvent.setup();
        (invoke as any).mockResolvedValue([]);

        render(<App />);

        const nameInput = screen.getByPlaceholderText("Device Name");
        const addButton = screen.getByRole("button", { name: "Add Device" });

        await user.type(nameInput, "Server");
        await user.click(addButton);

        expect(invoke).not.toHaveBeenCalledWith("save_devices", expect.anything());
      });
    });

    describe("updateDevice", () => {
      it("should update device when save is clicked", async () => {
        const user = userEvent.setup();
        const mockDevices = [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        (invoke as any).mockResolvedValue(mockDevices);

        render(<App />);

        await waitFor(() => {
          expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
        });

        const editButton = screen.getByRole("button", { name: "Edit" });
        await user.click(editButton);

        const inputs = screen.getAllByRole("textbox");
        const nameInput = inputs[0];
        const macInput = inputs[1];

        await user.clear(nameInput);
        await user.type(nameInput, "Updated Server");
        await user.clear(macInput);
        await user.type(macInput, "ff:ee:dd:cc:bb:aa");

        const saveButton = screen.getByRole("button", { name: "Save" });
        await user.click(saveButton);

        await waitFor(() => {
          expect(invoke).toHaveBeenCalledWith("update_device", {
            index: 0,
            name: "Updated Server",
            mac: "ff:ee:dd:cc:bb:aa",
          });
        });
      });

      it("should cancel editing when cancel button is clicked", async () => {
        const user = userEvent.setup();
        const mockDevices = [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        (invoke as any).mockResolvedValue(mockDevices);

        render(<App />);

        await waitFor(() => {
          expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
        });

        const editButton = screen.getByRole("button", { name: "Edit" });
        await user.click(editButton);

        const cancelButton = screen.getByRole("button", { name: "Cancel" });
        await user.click(cancelButton);

        expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
      });

      it("should not save device with empty fields", async () => {
        const user = userEvent.setup();
        const mockDevices = [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        (invoke as any).mockResolvedValue(mockDevices);

        render(<App />);

        await waitFor(() => {
          expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
        });

        const editButton = screen.getByRole("button", { name: "Edit" });
        await user.click(editButton);

        const inputs = screen.getAllByRole("textbox");
        await user.clear(inputs[0]);
        await user.clear(inputs[1]);

        const saveButton = screen.getByRole("button", { name: "Save" });
        await user.click(saveButton);

        expect(invoke).not.toHaveBeenCalledWith("update_device", expect.anything());
      });
    });

    describe("deleteDevice", () => {
      it("should delete device when confirmed", async () => {
        const user = userEvent.setup();
        const mockDevices = [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        (invoke as any).mockResolvedValue(mockDevices);
        (confirm as any).mockResolvedValue(true);

        render(<App />);

        await waitFor(() => {
          expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
        });

        const deleteButton = screen.getByRole("button", { name: "Delete" });
        await user.click(deleteButton);

        await waitFor(() => {
          expect(confirm).toHaveBeenCalledWith("Are you sure you want to delete this device?");
        });

        await waitFor(() => {
          expect(invoke).toHaveBeenCalledWith("delete_device", { index: 0 });
        });

        expect(screen.queryByText("Server 1")).not.toBeInTheDocument();
      });

      it("should not delete device when cancelled", async () => {
        const user = userEvent.setup();
        const mockDevices = [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        (invoke as any).mockResolvedValue(mockDevices);
        (confirm as any).mockResolvedValue(false);

        render(<App />);

        await waitFor(() => {
          expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
        });

        const deleteButton = screen.getByRole("button", { name: "Delete" });
        await user.click(deleteButton);

        await waitFor(() => {
          expect(confirm).toHaveBeenCalled();
        });

        expect(invoke).not.toHaveBeenCalledWith("delete_device", expect.anything());

        expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
      });

      it("should handle delete error", async () => {
        const user = userEvent.setup();
        const mockDevices = [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        (invoke as any)
          .mockResolvedValueOnce(mockDevices)
          .mockRejectedValueOnce(new Error("Delete failed"));
        (confirm as any).mockResolvedValue(true);

        render(<App />);

        await waitFor(() => {
          expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
        });

        const deleteButton = screen.getByRole("button", { name: "Delete" });
        await user.click(deleteButton);

        await waitFor(() => {
          expect(invoke).toHaveBeenCalledWith("delete_device", { index: 0 });
        });

        expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
      });
    });
  });

  describe("WoL Operations", () => {
    describe("wakeDevice", () => {
      it("should send magic packet when wake button is clicked", async () => {
        const user = userEvent.setup();
        const mockDevices = [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        (invoke as any).mockResolvedValue(mockDevices);

        render(<App />);

        await waitFor(() => {
          expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
        });

        const wakeButton = screen.getByRole("button", { name: "Wake" });
        await user.click(wakeButton);

        await waitFor(() => {
          expect(invoke).toHaveBeenCalledWith("send_magic_packet", {
            macAddress: "00:11:22:33:44:55",
          });
        });

        expect(globalThis.alert).toHaveBeenCalledWith("WoL packet sent to 00:11:22:33:44:55");
      });

      it("should handle wake error", async () => {
        const user = userEvent.setup();
        const mockDevices = [{ name: "Server 1", mac: "00:11:22:33:44:55" }];
        (invoke as any)
          .mockResolvedValueOnce(mockDevices)
          .mockRejectedValueOnce(new Error("Network error"));

        render(<App />);

        await waitFor(() => {
          expect(screen.getByText("Server 1 - 00:11:22:33:44:55")).toBeInTheDocument();
        });

        const wakeButton = screen.getByRole("button", { name: "Wake" });
        await user.click(wakeButton);

        await waitFor(() => {
          expect(invoke).toHaveBeenCalledWith("send_magic_packet", {
            macAddress: "00:11:22:33:44:55",
          });
        });

        expect(globalThis.alert).toHaveBeenCalledWith(
          expect.stringContaining("Failed to send WoL packet")
        );
      });
    });
  });
});
