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

See `.env.example` for the full list of variables and setup instructions.

`.env.local` is gitignored and should never be committed. For production (Vercel), set these in the dashboard under Settings > Environment Variables.

### Address Autocomplete (Optional)

To enable Google Maps address autocomplete:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Places API** and **Maps JavaScript API**
3. Create an API key, restrict it to your domain
4. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`

The form works without this — the address field will just be a regular text input.

## Testing the Reverse Registry

When testing commitments, you'll need to clean up test data. There's a delete endpoint that removes the Postgres row and the R2 photo in one go:

```bash
# Locally
curl -X DELETE http://localhost:3000/api/commitments/THE-ID-HERE

# Production
curl -X DELETE https://rickyandrosa.com/api/commitments/THE-ID-HERE
```

To find commitment IDs, either:
- Check the network tab when loading the feed page (`GET /api/commitments` response)
- Run `SELECT id, name, activity_name FROM commitments;` in the Vercel SQL Editor (Storage > your database)

To wipe all test data at once, run in the SQL Editor:
```sql
DELETE FROM commitments;
```
Note: this won't delete photos from R2. To clear those, go to Cloudflare Dashboard > R2 > `rickyandrosa` > `registry-photos/` folder.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
