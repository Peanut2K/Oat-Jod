export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function scheduleNotification(timeStr: string, titleTh: string, bodyTh: string): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);

  const delay = target.getTime() - now.getTime();
  setTimeout(() => {
    new Notification(titleTh, { body: bodyTh, icon: "/icon.png" });
    // reschedule for next day
    scheduleNotification(timeStr, titleTh, bodyTh);
  }, delay);
}

export function sendTestNotification(lang: "th" | "en"): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification(
    lang === "th" ? "แจ้งเตือนบันทึกรายจ่าย" : "Expense Reminder",
    {
      body:
        lang === "th"
          ? "อย่าลืมบันทึกรายจ่ายวันนี้นะ!"
          : "Don't forget to log your expenses today!",
      icon: "/icon.png",
    }
  );
}
