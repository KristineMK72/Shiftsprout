export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          ShiftSprout OS
        </h1>

        <p className="text-muted-foreground max-w-md mx-auto">
          Workforce Operating System for scheduling, timekeeping, payroll, PTO, and AI intelligence.
        </p>

        <div className="mt-6">
          <a
            href="/dashboard"
            className="inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground hover:opacity-90 transition"
          >
            Enter Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
