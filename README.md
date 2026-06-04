# บันทึกรายจ่าย — Expense Tracker

Next.js 14 + TypeScript + Tailwind CSS  
ข้อมูลเก็บใน **localStorage** (ฟรี 100% ไม่ต้องมี backend)

## เริ่มต้น

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Deploy (ฟรี)

```bash
# 1. Push ขึ้น GitHub
# 2. ไปที่ vercel.com → Import repo → Deploy
# ไม่ต้องตั้งค่า env vars
```

## ฟีเจอร์ครบ

- ✅ บันทึกด้วยข้อความ
- ✅ บันทึกด้วยรูป/สลิป/ใบเสร็จ
- ✅ บันทึกด้วยเสียง (Web Speech API)
- ✅ รายการอัตโนมัติ (Auto Record)
- ✅ แจ้งเตือนประจำวัน (Browser Notification)
- ✅ หมวดหมู่ปรับได้
- ✅ ตั้งงบประมาณรายหมวด
- ✅ มุมมองรายเดือน / สัปดาห์ / วัน
- ✅ ตั้งวันเริ่มงบ (1-28)
- ✅ ส่งออก CSV & Excel
- ✅ กราฟ Pie / Bar (6 เดือน) / Trend
- ✅ ภาษาไทย & English

## อัปเกรดเป็น Cloud (ในอนาคต)

ถ้าต้องการ sync ข้ามอุปกรณ์ สามารถเพิ่ม Supabase:
1. สมัคร [supabase.com](https://supabase.com) (ฟรี)
2. สร้าง table `transactions`, `categories`, `budgets`
3. เพิ่ม env vars ใน `.env.local`
4. แก้ `lib/storage.ts` ให้ใช้ Supabase client
