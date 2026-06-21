-- App subscriptions table driven by RevenueCat webhooks
-- Run this in Supabase SQL editor

create table if not exists app_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  product_id text,
  subscription_status text not null default 'unknown',
  -- 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired' | 'unknown'
  is_active boolean not null default false,
  plan_type text,
  -- 'monthly' | 'annual' | 'unknown'
  expires_at timestamptz,
  renews_at timestamptz,
  revenuecat_event_type text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast lookup by email
create index if not exists app_subscriptions_email_idx on app_subscriptions (email);

-- Row-level security: only service role can write; no public reads
alter table app_subscriptions enable row level security;

create policy "Service role only" on app_subscriptions
  for all using (auth.role() = 'service_role');
