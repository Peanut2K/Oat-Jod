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

  const reload = useCallback(() => {
    setTransactions(getTransactions());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTransaction = useCallback(
    (data: {
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
      storageAdd(txn);
      reload();
      return txn;
    },
    [reload]
  );

  const updateTransaction = useCallback(
    (txn: Transaction) => {
      storageUpdate(txn);
      reload();
    },
    [reload]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      storageDelete(id);
      reload();
    },
    [reload]
  );

  return { transactions, addTransaction, updateTransaction, deleteTransaction, reload };
}
