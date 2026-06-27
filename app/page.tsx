"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LogoIcon, FixturesIcon, StandingsIcon, AnalyticsIcon,
  ShareIcon, LiveIcon, SimpleIcon, PlusIcon, ArrowRightIcon,
} from "./components/icons";
import { UserNav } from "./components/UserNav";

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const stats = [
  { value: "2,500+", label: "Tournaments" },
  { value: "45K+", label: "Matches" },
  { value: "12K+", label: "Teams" },
  { value: "99.9%", label: "Uptime" },
];

const features = [
  { icon: <FixturesIcon />, title: "Automated Fixtures", desc: "Generate Round Robin and Single Elimination brackets instantly with automatic BYE handling.", color: "emerald" },
  { icon: <StandingsIcon />, title: "Live Standings", desc: "Real-time league tables with points, goal difference, and head-to-head records.", color: "blue" },
  { icon: <AnalyticsIcon />, title: "Match Analytics", desc: "Track possession, shots, corners, fouls, and cards per game with detailed stats.", color: "violet" },
  { icon: <ShareIcon />, title: "Shareable Links", desc: "Generate snapshot links so fans can follow live — no account needed.", color: "cyan" },
  { icon: <LiveIcon />, title: "Live Broadcast", desc: "Real-time match status with live indicators, score updates, and round progression.", color: "red" },
  { icon: <SimpleIcon />, title: "Simple & Fast", desc: "No complex onboarding. Create a tournament in under 30 seconds, start managing instantly.", color: "amber" },
];

export default function LandingPage() {
  return (
    <>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[100px]" />
      </div>

      {/* ─── Navbar ─── */}
      <nav className="relative z-10 w-full px-6 py-4 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={34} />
            <span className="text-lg font-bold text-white tracking-tight">
              Kick<span className="text-emerald-400">Bracket</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <UserNav />
            <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              Dashboard <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative z-10 w-full flex flex-col items-center text-center px-6 pt-28 pb-20">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Professional Tournament Management
        </motion.span>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
        >
          Run Tournaments{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Like a Pro
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="text-lg text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal"
        >
          Enterprise-grade sports competition & fixture management engine. Generate automated round-robin leagues, Swiss stage tournaments, and double-elimination knockout brackets. Broadcast live telemetry, compute automated tie-breaking standings, and share real-time interactive snapshots seamlessly.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="flex flex-wrap items-center justify-center gap-4 mb-24"
        >
          <Link href="/dashboard/create" className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-base transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5">
            <PlusIcon /> Start a Tournament
          </Link>
          <a href="#features" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-base transition-all">
            View Features <ChevronDown />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/5 pt-12"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{s.value}</span>
              <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="relative z-10 w-full px-6 py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need
            </h2>
            <p className="text-slate-400">
              From fixture generation to live score broadcasting — all in one platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all"
              >
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 w-full px-6 py-24 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-500/15 rounded-3xl p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Ready to organize?</h2>
          <p className="text-slate-400 mb-8">Create your first tournament in under 30 seconds — completely free.</p>
          <Link href="/dashboard/create" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5">
            <PlusIcon /> Get Started
          </Link>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 w-full px-6 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoIcon size={20} />
            <span className="text-sm text-slate-500 font-medium">© {new Date().getFullYear()} KickBracket Pro</span>
          </div>
          <div className="flex gap-6 text-xs text-slate-500 font-medium">
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5l4 4 4-4" />
    </svg>
  );
}
