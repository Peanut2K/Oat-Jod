-- Run this in your Supabase SQL Editor

-- Transactions
create table if not exists transactions (
  id text primary key,
  amount numeric not null,
  type text not null check (type in ('expense', 'income')),
  category_id text not null,
  note text default '',
  date timestamptz not null,
  image_url text,
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists categories (
  id text primary key,
  name text not null,
  name_th text not null,
  icon text not null,
  color text not null,
  type text not null check (type in ('expense', 'income'))
);

-- Budgets
create table if not exists budgets (
  category_id text primary key,
  amount numeric not null,
  period text not null default 'monthly'
);

-- Auto Records
create table if not exists auto_records (
  id text primary key,
  name text not null,
  name_th text not null,
  amount numeric not null,
  type text not null check (type in ('expense', 'income')),
  category_id text not null,
  note text default '',
  enabled boolean default true
);

-- Settings (singleton row)
create table if not exists settings (
  id text primary key default 'singleton',
  language text default 'th',
  currency text default 'THB',
  budget_start_day integer default 1,
  notifications_enabled boolean default false,
  notification_time text default '20:00'
);

-- Seed default settings row
insert into settings (id) values ('singleton') on conflict do nothing;

-- Seed default categories
insert into categories (id, name, name_th, icon, color, type) values
  ('food',        'Food & Drink',    'อาหาร & เครื่องดื่ม', '🍔', '#f97316', 'expense'),
  ('transport',   'Transport',       'การเดินทาง',            '🚗', '#3b82f6', 'expense'),
  ('shopping',    'Shopping',        'ช้อปปิ้ง',              '🛍️', '#ec4899', 'expense'),
  ('health',      'Health',          'สุขภาพ',                '💊', '#ef4444', 'expense'),
  ('entertainment','Entertainment',  'บันเทิง',               '🎮', '#8b5cf6', 'expense'),
  ('bills',       'Bills & Utilities','ค่าใช้จ่ายประจำ',      '📱', '#6b7280', 'expense'),
  ('education',   'Education',       'การศึกษา',              '📚', '#0891b2', 'expense'),
  ('other_exp',   'Other',           'อื่นๆ',                 '📦', '#9ca3af', 'expense'),
  ('salary',      'Salary',          'เงินเดือน',             '💰', '#22c55e', 'income'),
  ('freelance',   'Freelance',       'ฟรีแลนซ์',              '💻', '#84cc16', 'income'),
  ('bonus',       'Bonus',           'โบนัส',                 '🎁', '#eab308', 'income'),
  ('other_inc',   'Other Income',    'รายได้อื่นๆ',           '💵', '#14b8a6', 'income')
on conflict do nothing;

-- Disable RLS for now (enable & add policies when you add auth)
alter table transactions disable row level security;
alter table categories disable row level security;
alter table budgets disable row level security;
alter table auto_records disable row level security;
alter table settings disable row level security;
