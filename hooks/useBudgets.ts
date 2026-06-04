"use client";
import { useState, useEffect, useCallback } from "react";
import { getBudgets } from "@/lib/storage";
import { Budget } from "@/types";

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const reload = useCallback(async () => {
    setBudgets(await getBudgets());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { budgets, reload };
}
