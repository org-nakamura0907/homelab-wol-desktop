import { useState } from "react";
import { Device } from "../types/device";

/** デバイスとは独立した追加グループ、グループ編集状態、グループ CRUD ハンドラを管理する。 */
export function useGroups(
  devices: Device[],
  selectedGroup: string | null,
  setSelectedGroup: (group: string | null) => void,
  saveDevices: (devices: Device[]) => Promise<void>,
  addToast: (message: string, type: "success" | "error" | "info") => void
) {
  const [extraGroups, setExtraGroups] = useState<string[]>([]);
  const [addingGroup, setAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const [editingGroupValue, setEditingGroupValue] = useState("");

  const allGroups = Array.from(
    new Set([...extraGroups, ...devices.flatMap((d) => (d.group ? [d.group] : []))])
  );

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
        await saveDevices(updated);
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
        await saveDevices(updated);
      } catch (e) {
        addToast(`Failed to rename group: ${e}`, "error");
        return;
      }
    }
    setExtraGroups((prev) => prev.map((g) => (g === oldName ? trimmed : g)));
    if (selectedGroup === oldName) setSelectedGroup(trimmed);
  }

  return {
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
  };
}
