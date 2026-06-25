import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      {/* ─── Navbar ─── */}
      <nav className="w-full px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
            K
          </div>
          <span className="text-lg font-bold text-white">
            KickBracket <span className="text-emerald-400">Pro</span>
          </span>
        </div>
        <Link
          href="/dashboard"
          className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
        >
          Dashboard
        </Link>
      </nav>

      {/* ─── Hero ─── */}
      <section className="w-full flex flex-col items-center text-center px-6 pt-24 pb-20">
        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-sm font-medium mb-8">
          ⚡ Professional Tournament Management
        </span>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
          Run Tournaments{" "}
          <span className="text-emerald-400">Like a Pro</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl leading-relaxed mb-10">
          Create round-robin leagues and knockout brackets in seconds.
          Track live scores, share real-time standings, and manage
          every match.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <Link
            href="/dashboard/create"
            className="px-8 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-colors"
          >
            + Start a Tournament
          </Link>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-base transition-colors"
          >
            View Features ↓
          </a>
        </div>

        {/* Stats row */}
        <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-slate-800 pt-10">
          {[
            ["2,500+", "Tournaments"],
            ["45K+", "Matches"],
            ["12K+", "Teams"],
            ["99%", "Uptime"],
          ].map(([value, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-emerald-400">{value}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="w-full bg-slate-800/60 px-6 py-24">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">
            Everything you need
          </h2>
          <p className="text-slate-400 text-base">
            From fixture generation to live score broadcasting.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
          {[
            ["🗓️", "Automated Fixtures", "Generate Round Robin and Single Elimination brackets instantly with automatic BYE handling."],
            ["📊", "Live Standings", "Real-time league tables with points, goal difference, and head-to-head records."],
            ["📈", "Match Analytics", "Track possession, shots, corners, fouls, and cards per game."],
            ["🔗", "Shareable Links", "Generate public share links so fans can follow live — no account needed."],
          ].map(([emoji, title, desc]) => (
            <div
              key={title}
              className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 flex flex-col gap-3"
            >
              <span className="text-2xl">{emoji}</span>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="w-full px-6 py-6 border-t border-slate-800 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} KickBracket Pro. All rights reserved.
        </p>
      </footer>
    </>
  );
}
