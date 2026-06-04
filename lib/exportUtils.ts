import { Transaction, Category } from "@/types";
import { format } from "date-fns";

export function exportToCSV(transactions: Transaction[], categories: Category[]): void {
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const header = ["Date", "Type", "Category", "Amount", "Note"];
  const rows = transactions.map((t) => {
    const cat = catMap[t.categoryId];
    return [
      format(new Date(t.date), "yyyy-MM-dd"),
      t.type,
      cat ? cat.name : t.categoryId,
      t.amount.toString(),
      t.note,
    ];
  });

  const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `expenses-${format(new Date(), "yyyy-MM")}.csv`);
}

export async function exportToXLSX(
  transactions: Transaction[],
  categories: Category[]
): Promise<void> {
  const { utils, writeFile } = await import("xlsx");
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  const data = transactions.map((t) => {
    const cat = catMap[t.categoryId];
    return {
      Date: format(new Date(t.date), "yyyy-MM-dd"),
      Type: t.type === "expense" ? "รายจ่าย" : "รายรับ",
      Category: cat ? cat.nameTh : t.categoryId,
      Amount: t.amount,
      Note: t.note,
    };
  });

  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Expenses");

  // Column widths
  ws["!cols"] = [
    { wch: 12 },
    { wch: 10 },
    { wch: 20 },
    { wch: 12 },
    { wch: 30 },
  ];

  writeFile(wb, `expenses-${format(new Date(), "yyyy-MM")}.xlsx`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
