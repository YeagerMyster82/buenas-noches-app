create extension if not exists "pgcrypto";

create table if not exists profiles (
  code text primary key,
  name text not null,
  description text not null
);

create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  parent_email text not null,
  child_name text,
  age_years integer,
  primary_profile text references profiles(code),
  secondary_profile text references profiles(code),
  created_at timestamptz not null default now()
);

create table if not exists quiz_results (
  id uuid primary key default gen_random_uuid(),
  parent_email text not null,
  child_id uuid references children(id) on delete cascade,
  answers jsonb not null,
  primary_profile text not null references profiles(code),
  secondary_profile text references profiles(code),
  created_at timestamptz not null default now()
);

create table if not exists purchase_access (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  product_id text not null,
  order_id text,
  purchase_status text not null default 'paid',
  premium_unlocked boolean not null default false,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email, product_id)
);

create table if not exists daily_plans (
  id uuid primary key default gen_random_uuid(),
  parent_email text not null,
  child_id uuid references children(id) on delete cascade,
  plan_date date not null default current_date,
  wake_time time not null,
  nap_taken boolean not null default false,
  nap_wake_time time,
  dinner_time time not null,
  routine_start time not null,
  bedtime time not null,
  steps jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists nightly_logs (
  id uuid primary key default gen_random_uuid(),
  parent_email text not null,
  child_id uuid references children(id) on delete cascade,
  log_date date not null,
  routine_start_time time,
  in_bed_at time not null,
  fell_asleep_at time not null,
  sleep_latency_minutes integer not null,
  night_wakings text not null default '0',
  notes text,
  ratings jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (child_id, log_date)
);

alter table nightly_logs
  add column if not exists routine_start_time time;

alter table nightly_logs
  add column if not exists night_wakings text not null default '0';

insert into profiles (code, name, description) values
  ('A', 'Segunda energía', 'Niño que en la noche parece activarse más.'),
  ('B', 'Despierto pero quieto', 'Niño que está acostado pero no logra dormirse.'),
  ('C', 'Negociador', 'Niño que retrasa el momento de dormir con pedidos y preguntas.'),
  ('D', 'Colapso nocturno', 'Niño que llega a la noche emocionalmente sobrepasado.'),
  ('E', 'Cuerpo inquieto', 'Niño que se mueve mucho en la cama y sigue buscando input.'),
  ('F', 'Necesita cerquita', 'Niño que necesita presencia y cercanía para bajar revoluciones.'),
  ('G', 'Mente encendida', 'Niño que no logra apagar la mente al dormir.'),
  ('H', 'Se duerme, pero no sostiene el sueño', 'Niño que logra dormirse pero despierta más tarde.')
on conflict (code) do nothing;
