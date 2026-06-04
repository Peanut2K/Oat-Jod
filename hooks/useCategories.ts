"use client";
import { useState, useEffect, useCallback } from "react";
import { getCategories } from "@/lib/storage";
import { Category } from "@/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const reload = useCallback(async () => {
    setCategories(await getCategories());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { categories, reload };
}
