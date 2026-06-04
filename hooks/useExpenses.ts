"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getTransactions,
  addTransaction as storageAdd,
  updateTransaction as storageUpdate,
  deleteTransaction as storageDelete,
  generateId,
} from "@/lib/storage";
import { Transaction, TransactionType } from "@/types";

export function useExpenses() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const reload = useCallback(async () => {
    setTransactions(await getTransactions());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTransaction = useCallback(
    async (data: {
      amount: number;
      type: TransactionType;
      categoryId: string;
      note: string;
      date: string;
      imageUrl?: string;
    }) => {
      const txn: Transaction = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      await storageAdd(txn);
      await reload();
      return txn;
    },
    [reload]
  );

  const updateTransaction = useCallback(
    async (txn: Transaction) => {
      await storageUpdate(txn);
      await reload();
    },
    [reload]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      await storageDelete(id);
      await reload();
    },
    [reload]
  );

  return { transactions, addTransaction, updateTransaction, deleteTransaction, reload };
}
