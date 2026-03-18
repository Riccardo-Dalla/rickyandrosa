This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Required | Side | Purpose |
|----------|----------|------|---------|
| `GOOGLE_APPS_SCRIPT_URL` | Yes | Server | Google Apps Script web app URL for saving guest info to Google Sheets |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | Client | Google Maps API key for address autocomplete on the save-the-date form |

`.env.local` is gitignored and should never be committed. For production (Vercel), set these in the dashboard under Settings > Environment Variables.

### Google Sheets Setup

The save-the-date page collects guest names, emails, and mailing addresses and saves them to a Google Sheet via a Google Apps Script web app.

1. Create a new Google Sheet (or use an existing one with a dedicated tab)
2. Go to **Extensions > Apps Script**
3. Paste the script from the setup instructions (see conversation history or `.env.example` comments)
4. Click **Deploy > New deployment** — choose **Web app**, set "Execute as" to **Me**, "Who has access" to **Anyone**
5. Copy the deployment URL into `GOOGLE_APPS_SCRIPT_URL`

The script is bound to the spreadsheet it was created from, so `getActiveSpreadsheet()` always targets the right sheet. Use `getSheetByName("Tab Name")` if you want to target a specific tab.

### Address Autocomplete (Optional)

To enable Google Maps address autocomplete:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Places API** and **Maps JavaScript API**
3. Create an API key, restrict it to your domain
4. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`

The form works without this — the address field will just be a regular text input.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
