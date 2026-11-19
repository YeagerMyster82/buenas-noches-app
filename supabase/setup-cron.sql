-- Run this once in the Supabase SQL editor to schedule the daily-push function.
--
-- Prerequisites:
--   1. Enable pg_cron and pg_net extensions in the Supabase dashboard
--      (Database → Extensions → enable "pg_cron" and "pg_net")
--   2. Deploy the daily-push Edge Function:
--      supabase functions deploy daily-push --project-ref wcmpbgcrglduwguxytui
--   3. Replace <SERVICE_ROLE_KEY> below with your project's service role key
--      (Settings → API → service_role key)

SELECT cron.schedule(
  'daily-push-every-5min',
  '*/5 * * * *',
  $$
    SELECT net.http_post(
      url     := 'https://wcmpbgcrglduwguxytui.supabase.co/functions/v1/daily-push',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
      ),
      body    := '{}'::jsonb
    );
  $$
);

-- To check scheduled jobs:
-- SELECT * FROM cron.job;

-- To remove the job:
-- SELECT cron.unschedule('daily-push-every-5min');
