"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogoIcon, ArrowLeftIcon } from "../components/icons";

export default function PrivacyPage() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
      </div>

      <nav className="relative z-10 w-full px-6 py-4 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoIcon size={34} />
            <span className="text-lg font-bold text-white tracking-tight">
              Kick<span className="text-emerald-400">Bracket</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeftIcon /> Back Home
          </Link>
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-3xl mx-auto px-6 py-16 text-slate-300">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 block">Legal & Governance</span>
          <h1 className="text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-10 pb-8 border-b border-white/10">Last updated: June 2026</p>

          <div className="flex flex-col gap-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Data Collection & Client Storage</h2>
              <p className="text-slate-400">
                KickBracket Pro is designed with privacy-first architecture. Tournament brackets, team registries, match schedules, and score logs created via our quick-start dashboard are stored directly within your local browser storage (<code className="text-emerald-400">localStorage</code>). We do not harvest or track individual participant data on central database clusters without explicit authentication.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Snapshot Telemetry & Sharing</h2>
              <p className="text-slate-400">
                When you generate a live shareable snapshot link (<code className="text-emerald-400">?d=...</code>), the state of your competition is serialized and encoded directly into the URL query parameters. This allows your spectators to render live standings and broadcast brackets on mobile and desktop devices without requiring cookies or server-side user tracking.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Third-Party Analytics & Hosting</h2>
              <p className="text-slate-400">
                Our application infrastructure is hosted on secure global content delivery networks (Vercel edge network). Standard anonymous HTTP request telemetry (such as IP region and browser user-agent) may be processed strictly for DDoS mitigation, uptime monitoring, and network performance optimization.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Your Data Control Rights</h2>
              <p className="text-slate-400">
                Because your active competition data resides locally on your client machine, you maintain complete ownership and deletion authority. Clearing your browser cache or deleting a competition from your dashboard permanently erases all associated telemetry records.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </>
  );
}
