"use client";
import { useState, useEffect } from "react";
import { Bell, Globe, Calendar, Tag, DollarSign } from "lucide-react";
import { useLang } from "@/components/LanguageContext";
import { useSettings } from "@/hooks/useSettings";
import CategoryManager from "@/components/CategoryManager";
import BudgetManager from "@/components/BudgetManager";
import {
  requestNotificationPermission,
  scheduleNotification,
  sendTestNotification,
} from "@/lib/notifications";
import clsx from "clsx";

type Tab = "categories" | "budgets" | "preferences";

export default function SettingsPage() {
  const { t, lang, setLang } = useLang();
  const { settings, updateSettings } = useSettings();
  const [tab, setTab] = useState<Tab>("preferences");
  const [notifGranted, setNotifGranted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setNotifGranted(Notification?.permission === "granted");
    }
  }, []);

  const tabs: { key: Tab; icon: React.ReactNode; label: string }[] = [
    { key: "preferences", icon: <Globe size={16} />, label: t("preferences") },
    { key: "categories", icon: <Tag size={16} />, label: t("categories") },
    { key: "budgets", icon: <DollarSign size={16} />, label: t("budgets") },
  ];

  const handleEnableNotifs = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
    if (granted && settings) {
      updateSettings({ notificationsEnabled: true });
      scheduleNotification(
        settings.notificationTime,
        lang === "th" ? "แจ้งเตือนบันทึกรายจ่าย" : "Expense Reminder",
        lang === "th" ? "อย่าลืมบันทึกรายจ่ายวันนี้!" : "Don't forget to log today!"
      );
    }
  };

  if (!settings) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900">{t("settings")}</h1>
      </div>

      {/* Tab nav */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all",
              tab === key ? "bg-white text-green-600 shadow-sm" : "text-gray-500"
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
        {tab === "preferences" && (
          <>
            {/* Language */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Globe size={16} className="text-green-500" />
                {t("language")}
              </label>
              <div className="flex gap-2">
                {(["th", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={clsx(
                      "flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all",
                      lang === l
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    {l === "th" ? "🇹🇭 ภาษาไทย" : "🇬🇧 English"}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget start day */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="text-green-500" />
                {t("budgetStartDay")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={28}
                  value={settings.budgetStartDay}
                  onChange={(e) =>
                    updateSettings({ budgetStartDay: parseInt(e.target.value) || 1 })
                  }
                  className="w-20 rounded-xl border border-gray-200 px-3 py-2 text-center font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <span className="text-sm text-gray-500">
                  {lang === "th" ? "ของทุกเดือน (1-28)" : "of every month (1-28)"}
                </span>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Bell size={16} className="text-green-500" />
                {t("notifications")}
              </label>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t("enableNotifications")}</span>
                  <button
                    onClick={handleEnableNotifs}
                    className={clsx(
                      "relative w-12 h-6 rounded-full transition-colors",
                      notifGranted && settings.notificationsEnabled
                        ? "bg-green-500"
                        : "bg-gray-300"
                    )}
                  >
                    <span
                      className={clsx(
                        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                        notifGranted && settings.notificationsEnabled
                          ? "translate-x-6"
                          : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {notifGranted && settings.notificationsEnabled && (
                  <>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-600 flex-1">{t("notificationTime")}</label>
                      <input
                        type="time"
                        value={settings.notificationTime}
                        onChange={(e) => updateSettings({ notificationTime: e.target.value })}
                        className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                    <button
                      onClick={() => sendTestNotification(lang)}
                      className="w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      {t("testNotification")}
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {tab === "categories" && <CategoryManager />}
        {tab === "budgets" && <BudgetManager />}
      </div>

      {/* App info */}
      <div className="text-center text-xs text-gray-400 pb-2">
        Expense Tracker v1.0 · {lang === "th" ? "ข้อมูลเก็บในเครื่องของคุณ" : "Data stored locally"}
      </div>
    </div>
  );
}
