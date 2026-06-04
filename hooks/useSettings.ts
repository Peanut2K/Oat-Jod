"use client";
import { useState, useEffect, useCallback } from "react";
import { getSettings, saveSettings } from "@/lib/storage";
import { AppSettings } from "@/types";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    const current = await getSettings();
    const updated = { ...current, ...patch };
    await saveSettings(updated);
    setSettings(updated);
  }, []);

  return { settings, updateSettings };
}
