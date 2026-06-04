"use client";
import { useState, useEffect, useCallback } from "react";
import { getSettings, saveSettings } from "@/lib/storage";
import { AppSettings } from "@/types";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    const current = getSettings();
    const updated = { ...current, ...patch };
    saveSettings(updated);
    setSettings(updated);
  }, []);

  return { settings, updateSettings };
}
