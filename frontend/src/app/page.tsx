export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <main className="relative w-full max-w-xl rounded-3xl border border-slate-800/70 bg-slate-900/70 px-8 py-10 shadow-[0_0_40px_rgba(56,189,248,0.25)] backdrop-blur-xl">
        <div className="absolute -top-6 left-1/2 h-12 w-40 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-orange-400 blur-xl opacity-60" />
        <div className="relative space-y-6">
          <h1 className="text-center text-3xl font-semibold tracking-tight">
            Task <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-orange-300 bg-clip-text text-transparent">Tracker</span>
          </h1>
          <p className="text-center text-sm text-slate-300">
            A funky, minimal task manager with auth, priorities, and filters &mdash; built for the Brew internship assignment.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href="/login"
              className="w-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 px-4 py-2.5 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-110"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="w-full rounded-full border border-dashed border-slate-500/70 bg-slate-900/60 px-4 py-2.5 text-center text-sm font-semibold text-slate-100 hover:border-cyan-400 hover:bg-slate-900/80"
            >
              Sign up
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
