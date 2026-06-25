"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogoIcon, ArrowLeftIcon } from "../components/icons";

export default function TermsPage() {
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
          <h1 className="text-4xl font-extrabold text-white mb-4">Terms of Service</h1>
          <p className="text-sm text-slate-500 mb-10 pb-8 border-b border-white/10">Last updated: June 2026</p>

          <div className="flex flex-col gap-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h2>
              <p className="text-slate-400">
                By accessing or utilizing KickBracket Pro to organize sports leagues, knockout brackets, or broadcast live fixtures, you agree to comply with these enterprise platform terms of service. If you do not accept these terms, please discontinue use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Platform Usage & Fair Conduct</h2>
              <p className="text-slate-400">
                KickBracket Pro provides automated sports competition management utilities. You agree to utilize our fixture generators and live status indicators responsibly. Automated abusive scraping, attempts to bypass CDN rate limits, or injecting malicious payloads into snapshot links is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Intellectual Property & Brand Assets</h2>
              <p className="text-slate-400">
                The KickBracket Pro brand name, logo iconography, proprietary animation routines, and tie-breaking algorithms remain the exclusive intellectual property of KickBracket Technologies. You are granted a limited, revocable license to display our public broadcast snapshots for your tournaments.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Disclaimer of Warranties</h2>
              <p className="text-slate-400">
                Our platform is provided <q>as is</q> and <q>as available</q> without warranties of any kind. While we strive for 99.9% uptime and mathematical tie-breaking precision, KickBracket Pro shall not be held liable for match scheduling disputes, temporary data loss due to local browser storage clearing, or network latency during live broadcasts.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </>
  );
}
