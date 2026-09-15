# ShiftSprout OS

**Workforce Operating System** — a focused, modern alternative to ADP and UKG.

Scheduling · Timekeeping · Payroll visibility · PTO · AI insights

Built so rural and mid-market operators can **keep overhead low and put more into paychecks**.

Part of the Spatialytics family of tools for place-based and rural economic strength.

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + premium emerald design system
- **Prisma** + **Neon** (serverless Postgres)
- Lucide icons, date-fns, Zod

## Database (Neon)

1. Create a free project at [console.neon.tech](https://console.neon.tech)
2. Copy the **pooled** connection string
3. Locally:
   ```bash
   cp .env.example .env
   # paste DATABASE_URL into .env
   npx prisma db push
   npx prisma generate
   ```
4. On Vercel: Project → Settings → Environment Variables → add `DATABASE_URL` (same pooled string)

## Getting Started

```bash
npm install
cp .env.example .env   # add your Neon DATABASE_URL
npx prisma db push
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Why this exists

Legacy workforce tools are priced and built for large enterprises. Rural hospitals, clinics, hotels, retailers, and logistics sites need the same core capabilities — scheduling, compliance, timekeeping — without the overhead that eats into wages.

ShiftSprout aims to be the lean operating system for that reality: lower PEPM, faster setup, manager-first UX, and a clear path to AI-assisted scheduling later.

## Project Structure

```
app/
  page.tsx                 # Landing
  dashboard/               # App shell + modules
components/
  ui/                      # Button, Card
  layout/                  # Sidebar
lib/
  prisma.ts                # Prisma client
  utils.ts
prisma/
  schema.prisma            # Tenant → Location → User → Shift → Punch → PTO
```

## Roadmap (high level)

- [x] App shell + navigation + premium UI
- [x] Core schema (multi-tenant ready)
- [ ] Neon / Postgres live + seed data
- [ ] Auth
- [ ] Shift CRUD + calendar
- [ ] Time punches
- [ ] PTO workflow
- [ ] AI insights (later)

## License

Private / proprietary for now.
