# ShiftSprout OS

**Workforce Operating System** — a focused, modern alternative to ADP and UKG.

Scheduling · Timekeeping · Payroll visibility · PTO · AI insights

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + shadcn-style components
- **Prisma** + PostgreSQL
- **Supabase** (auth & client ready)
- Lucide icons, date-fns, Zod, etc.

## Getting Started

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env
# fill in DATABASE_URL (and optionally Supabase keys)

# 3. Database
npx prisma generate
npx prisma db push          # or migrate when ready

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  page.tsx                 # Landing
  dashboard/
    layout.tsx             # Sidebar shell
    page.tsx               # Overview + stats
    schedule/              # Shift scheduling
    timekeeping/           # Punches & approvals
    team/                  # Employee directory
    payroll/               # Labor cost & export
    pto/                   # Leave requests & balances
    ai/                    # Future insights
    settings/
components/
  ui/                      # Button, Card, …
  layout/                  # Sidebar
lib/
  utils.ts                 # cn() helper
prisma/
  schema.prisma            # Core models
```

## Core Models (Prisma)

- **User** – employees, managers, admins
- **Location** – sites / stores
- **Shift** – scheduled work blocks
- **CoverageRequest** – open shift / swap requests
- **Punch** – clock in/out & breaks
- **PtoRequest** + **PtoBalance** – leave management

## Roadmap (high level)

- [x] App shell + navigation
- [x] Dashboard overview
- [ ] Auth (Supabase)
- [ ] Full CRUD for shifts & punches
- [ ] Mobile-friendly time clock
- [ ] PTO approval workflow
- [ ] Payroll export (CSV / API)
- [ ] AI recommendations layer

## License

Private / proprietary for now.
