# Project TODOs

## Email Reminders for Reverse Registry

Currently, the commitment flow collects a user's email but never sends anything.
The success modal promises a confirmation email and reminders every 6 months.

### Steps to implement

1. **Choose an email provider**
   - Recommended: [Resend](https://resend.com) — simple API, generous free tier (100 emails/day)
   - Alternative: SendGrid

2. **Send confirmation email on commit**
   - Install `resend` (`npm install resend`)
   - Add `RESEND_API_KEY` to environment variables
   - Call `resend.emails.send()` in `POST /api/commitments` after saving

3. **Set up recurring reminders (every 6 months)**
   - Add a `lastRemindedAt` field to the `Commitment` interface
   - Create a `/api/reminders/send` route that:
     - Reads all incomplete commitments
     - Filters those due for a reminder (6 months since creation or last reminder)
     - Sends reminder emails
     - Updates `lastRemindedAt`
   - Schedule it via one of:
     - **Vercel Cron Jobs** (`vercel.json` cron config) — requires Pro plan
     - **External cron** (cron-job.org or GitHub Actions scheduled workflow) — free
     - **Upstash QStacks** — free tier, more precise timing

4. **Fix data persistence for deployment**
   - `data/commitments.json` is ephemeral on Vercel (lost on redeploy)
   - Options: Vercel KV, Turso, Supabase (free Postgres), or Neon
