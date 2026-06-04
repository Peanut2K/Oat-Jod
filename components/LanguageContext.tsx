"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, AppSettings } from "@/types";
import { getSettings, saveSettings } from "@/lib/storage";

type T = Record<string, string>;

export const translations: Record<Language, T> = {
  th: {
    // Nav
    home: "หน้าหลัก",
    record: "บันทึก",
    reports: "รายงาน",
    settings: "ตั้งค่า",
    // Dashboard
    totalExpense: "รายจ่ายรวม",
    totalIncome: "รายรับรวม",
    balance: "คงเหลือ",
    recentTransactions: "รายการล่าสุด",
    budgetOverview: "ภาพรวมงบประมาณ",
    thisMonth: "เดือนนี้",
    // Record
    addExpense: "เพิ่มรายจ่าย",
    addIncome: "เพิ่มรายรับ",
    amount: "จำนวนเงิน",
    category: "หมวดหมู่",
    note: "หมายเหตุ",
    date: "วันที่",
    save: "บันทึก",
    byText: "พิมพ์",
    byVoice: "เสียง",
    byImage: "รูปภาพ",
    autoRecord: "รายการอัตโนมัติ",
    expense: "รายจ่าย",
    income: "รายรับ",
    // Voice
    startRecording: "เริ่มพูด",
    stopRecording: "หยุดพูด",
    voiceHint: "พูดจำนวนเงิน เช่น 'ข้าวมันไก่ 50 บาท'",
    // Image
    uploadImage: "อัปโหลดภาพ/สลิป",
    imageHint: "อัปโหลดสลิปหรือใบเสร็จแล้วกรอกข้อมูล",
    // Settings
    categories: "หมวดหมู่",
    budgets: "งบประมาณ",
    preferences: "การตั้งค่า",
    language: "ภาษา",
    currency: "สกุลเงิน",
    budgetStartDay: "วันเริ่มงบประมาณ",
    notifications: "การแจ้งเตือน",
    notificationTime: "เวลาแจ้งเตือน",
    enableNotifications: "เปิดการแจ้งเตือน",
    testNotification: "ทดสอบการแจ้งเตือน",
    addCategory: "เพิ่มหมวดหมู่",
    setBudget: "ตั้งงบ",
    monthlyBudget: "งบรายเดือน",
    // Reports
    monthly: "รายเดือน",
    weekly: "รายสัปดาห์",
    daily: "รายวัน",
    export: "ส่งออก",
    exportCSV: "ส่งออก CSV",
    exportExcel: "ส่งออก Excel",
    byCategory: "ตามหมวดหมู่",
    trend: "แนวโน้ม",
    noData: "ไม่มีข้อมูล",
    // Auto records
    addAutoRecord: "เพิ่มรายการอัตโนมัติ",
    applyAll: "ใช้ทั้งหมด",
    // Common
    cancel: "ยกเลิก",
    delete: "ลบ",
    edit: "แก้ไข",
    confirm: "ยืนยัน",
    name: "ชื่อ",
    of: "จาก",
    used: "ใช้ไป",
    remaining: "คงเหลือ",
    day: "วันที่",
    addNew: "เพิ่มใหม่",
    selectImage: "เลือกรูปภาพ",
    voiceNotSupported: "เบราว์เซอร์นี้ไม่รองรับการบันทึกเสียง",
    saved: "บันทึกแล้ว!",
    deleted: "ลบแล้ว!",
    applied: "ใช้งานแล้ว!",
    topSpending: "หมวดที่ใช้มากสุด",
    vsLastMonth: "เทียบเดือนที่แล้ว",
    over: "เกินงบ",
  },
  en: {
    home: "Home",
    record: "Record",
    reports: "Reports",
    settings: "Settings",
    totalExpense: "Total Expense",
    totalIncome: "Total Income",
    balance: "Balance",
    recentTransactions: "Recent Transactions",
    budgetOverview: "Budget Overview",
    thisMonth: "This Month",
    addExpense: "Add Expense",
    addIncome: "Add Income",
    amount: "Amount",
    category: "Category",
    note: "Note",
    date: "Date",
    save: "Save",
    byText: "Text",
    byVoice: "Voice",
    byImage: "Image",
    autoRecord: "Auto Record",
    expense: "Expense",
    income: "Income",
    startRecording: "Start Speaking",
    stopRecording: "Stop",
    voiceHint: "Say the amount, e.g. 'lunch 50 baht'",
    uploadImage: "Upload Image/Slip",
    imageHint: "Upload a slip or receipt then fill in details",
    categories: "Categories",
    budgets: "Budgets",
    preferences: "Preferences",
    language: "Language",
    currency: "Currency",
    budgetStartDay: "Budget Start Day",
    notifications: "Notifications",
    notificationTime: "Notification Time",
    enableNotifications: "Enable Notifications",
    testNotification: "Test Notification",
    addCategory: "Add Category",
    setBudget: "Set Budget",
    monthlyBudget: "Monthly Budget",
    monthly: "Monthly",
    weekly: "Weekly",
    daily: "Daily",
    export: "Export",
    exportCSV: "Export CSV",
    exportExcel: "Export Excel",
    byCategory: "By Category",
    trend: "Trend",
    noData: "No Data",
    addAutoRecord: "Add Auto Record",
    applyAll: "Apply All",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    confirm: "Confirm",
    name: "Name",
    of: "of",
    used: "Used",
    remaining: "Remaining",
    day: "Day",
    addNew: "Add New",
    selectImage: "Select Image",
    voiceNotSupported: "Voice recording not supported in this browser",
    saved: "Saved!",
    deleted: "Deleted!",
    applied: "Applied!",
    topSpending: "Top Spending",
    vsLastMonth: "vs Last Month",
    over: "Over budget",
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "th",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("th");
  const [fullSettings, setFullSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    getSettings().then((s) => {
      setLangState(s.language);
      setFullSettings(s);
    });
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    const updated = { ...(fullSettings ?? {}), language: l } as AppSettings;
    setFullSettings(updated);
    saveSettings(updated);
  };

  const t = (key: string) => translations[lang][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
