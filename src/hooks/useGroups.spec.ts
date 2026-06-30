import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGroups } from "./useGroups";
import { Device } from "../types/device";

const makeDevice = (name: string, group?: string): Device => ({
  name,
  mac: "AA:BB:CC:DD:EE:FF",
  group,
});

describe("useGroups", () => {
  const saveDevices = vi.fn().mockResolvedValue(undefined);
  const addToast = vi.fn();
  const setSelectedGroup = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  function setup(devices: Device[] = [], selectedGroup: string | null = null) {
    return renderHook(() =>
      useGroups(devices, selectedGroup, setSelectedGroup, saveDevices, addToast)
    );
  }

  describe("allGroups", () => {
    it("includes groups from devices", () => {
      const { result } = setup([makeDevice("PC", "home")]);
      expect(result.current.allGroups).toContain("home");
    });

    it("deduplicates groups shared by devices and extraGroups", () => {
      const { result } = setup([makeDevice("PC", "home")]);
      act(() => result.current.setNewGroupName("home"));
      act(() => result.current.handleAddGroup());
      expect(result.current.allGroups.filter((g) => g === "home")).toHaveLength(1);
    });
  });

  describe("handleAddGroup", () => {
    it("adds a new group name", () => {
      const { result } = setup();
      act(() => result.current.setNewGroupName("work"));
      act(() => result.current.handleAddGroup());
      expect(result.current.allGroups).toContain("work");
    });

    it("ignores empty name", () => {
      const { result } = setup();
      act(() => result.current.setNewGroupName("  "));
      act(() => result.current.handleAddGroup());
      expect(result.current.allGroups).toHaveLength(0);
    });

    it("ignores duplicate name", () => {
      const { result } = setup();
      act(() => result.current.setNewGroupName("home"));
      act(() => result.current.handleAddGroup());
      act(() => result.current.setNewGroupName("home"));
      act(() => result.current.handleAddGroup());
      expect(result.current.allGroups.filter((g) => g === "home")).toHaveLength(1);
    });

    it("resets addingGroup and newGroupName after add", () => {
      const { result } = setup();
      act(() => {
        result.current.setAddingGroup(true);
        result.current.setNewGroupName("work");
      });
      act(() => result.current.handleAddGroup());
      expect(result.current.addingGroup).toBe(false);
      expect(result.current.newGroupName).toBe("");
    });
  });

  describe("handleDeleteGroup", () => {
    it("removes the group from extraGroups", async () => {
      const { result } = setup();
      act(() => result.current.setNewGroupName("work"));
      act(() => result.current.handleAddGroup());
      await act(() => result.current.handleDeleteGroup("work"));
      expect(result.current.allGroups).not.toContain("work");
    });

    it("clears group on devices that belonged to it and calls saveDevices", async () => {
      const devices = [makeDevice("PC", "home")];
      const { result } = setup(devices);
      await act(() => result.current.handleDeleteGroup("home"));
      expect(saveDevices).toHaveBeenCalledWith([{ ...devices[0], group: undefined }]);
    });

    it("resets selectedGroup when deleting the active group", async () => {
      const { result } = setup([], "home");
      act(() => result.current.setNewGroupName("home"));
      act(() => result.current.handleAddGroup());
      await act(() => result.current.handleDeleteGroup("home"));
      expect(setSelectedGroup).toHaveBeenCalledWith(null);
    });

    it("does not reset selectedGroup when deleting a different group", async () => {
      const { result } = setup([], "work");
      act(() => result.current.setNewGroupName("home"));
      act(() => result.current.handleAddGroup());
      await act(() => result.current.handleDeleteGroup("home"));
      expect(setSelectedGroup).not.toHaveBeenCalled();
    });
  });

  describe("handleRenameGroup", () => {
    it("renames an extraGroup", async () => {
      const { result } = setup();
      act(() => result.current.setNewGroupName("old"));
      act(() => result.current.handleAddGroup());
      await act(() => result.current.handleRenameGroup("old", "new"));
      expect(result.current.allGroups).toContain("new");
      expect(result.current.allGroups).not.toContain("old");
    });

    it("is a no-op when new name equals old name", async () => {
      const { result } = setup();
      act(() => result.current.setNewGroupName("home"));
      act(() => result.current.handleAddGroup());
      await act(() => result.current.handleRenameGroup("home", "home"));
      expect(saveDevices).not.toHaveBeenCalled();
    });

    it("is a no-op when new name is empty", async () => {
      const { result } = setup();
      act(() => result.current.setNewGroupName("home"));
      act(() => result.current.handleAddGroup());
      await act(() => result.current.handleRenameGroup("home", "  "));
      expect(saveDevices).not.toHaveBeenCalled();
      expect(result.current.allGroups).toContain("home");
    });

    it("clears editingGroupName after rename", async () => {
      const { result } = setup();
      act(() => result.current.setEditingGroupName("home"));
      await act(() => result.current.handleRenameGroup("home", "work"));
      expect(result.current.editingGroupName).toBeNull();
    });

    it("updates selectedGroup when renaming the active group", async () => {
      const { result } = setup([], "old");
      act(() => result.current.setNewGroupName("old"));
      act(() => result.current.handleAddGroup());
      await act(() => result.current.handleRenameGroup("old", "new"));
      expect(setSelectedGroup).toHaveBeenCalledWith("new");
    });
  });
});
