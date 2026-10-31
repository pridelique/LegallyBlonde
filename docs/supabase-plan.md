# แผนต่อ Supabase (ร่าง)

## ตาราง

```sql
-- ผู้ใช้ (ผูกกับ auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  role text not null default 'user' check (role in ('user','verified','admin')),
  verified_type text check (verified_type in ('lawyer','law_student','org')),
  verified_org text,
  plan text not null default 'free' check (plan in ('free','pro')),
  created_at timestamptz default now()
);

-- ความคืบหน้า Roadmap (F_03, F_06)
create table roadmap_progress (
  user_id uuid references profiles on delete cascade,
  problem_id text not null,
  data jsonb not null,          -- โครงสร้างเดียวกับ RoadmapProgress ใน lib/repos.ts
  updated_at timestamptz default now(),
  primary key (user_id, problem_id)
);

-- แชทถึงแอดมิน (F_04)
create table chat_tickets (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  owner_id uuid references profiles,   -- null = ผู้ใช้ไม่ login (ใช้ owner_token แทน)
  owner_token text,
  status text not null default 'waiting',
  priority boolean default false,
  created_at timestamptz default now()
);
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references chat_tickets on delete cascade,
  sender text check (sender in ('user','admin')),
  body text not null,
  created_at timestamptz default now()
);

-- กระทู้ (F_05)
create table forum_threads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  tags text[] default '{}',
  owner_token_hash text,        -- ให้คนตั้งกระทู้แบบ anonymous ลบได้
  hidden boolean default false,
  created_at timestamptz default now()
);
create table forum_answers (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references forum_threads on delete cascade,
  author_id uuid references profiles not null,
  body text not null,
  created_at timestamptz default now()
);

-- คำขอยืนยันตัวตน (F_07)
create table verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
  method text not null,
  detail text not null,
  status text not null default 'pending',
  reviewed_by uuid references profiles,
  created_at timestamptz default now()
);
```

## RLS ที่สำคัญ

- `profiles`: ผู้ใช้อ่าน/แก้ `display_name` ของตัวเองได้ แต่แก้ `role`, `verified_*`, `plan` ไม่ได้ (ให้ admin หรือ server function เท่านั้น)
- `forum_answers`: insert ได้เมื่อ `role in ('verified','admin')` ของผู้ใช้ปัจจุบัน
- `forum_threads`: insert ผ่าน API route/Edge Function ที่ตรวจ Cloudflare Turnstile + rate limit (ผู้ใช้ไม่ต้อง login)
- `chat_tickets/messages`: เจ้าของอ่านของตัวเองได้, admin อ่าน/ตอบได้ทั้งหมด
- `roadmap_progress`: อ่าน/เขียนได้เฉพาะ `user_id = auth.uid()`

## ไม่ต้องย้ายขึ้น server

- ร่างแบบฟอร์ม (`form:*` ใน localStorage) เป็นข้อมูลอ่อนไหว เก็บในเครื่องต่อได้ หรือถ้าจะสำรองบนคลาวด์ให้เข้ารหัสฝั่ง client ก่อน
