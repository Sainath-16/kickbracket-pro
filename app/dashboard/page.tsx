"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LogoIcon, PlusIcon, EmptyStateIcon, TrophyIcon,
  ShareLinkIcon, TrashIcon, ArrowRightIcon,
} from "../components/icons";
import { UserNav, KBUser } from "../components/UserNav";

type Team = { id: string; name: string; shortCode: string };
type Tournament = {
  id: string; name: string; format: string; teams: Team[];
  status: string; createdAt: string; userId?: string;
};

const formatLabels: Record<string, string> = {
  ROUND_ROBIN: "Round Robin", DOUBLE_ROUND_ROBIN: "Double Round Robin",
  SINGLE_ELIMINATION: "Single Elimination", DOUBLE_ELIMINATION: "Double Elimination",
  SWISS: "Swiss System", GROUP_KNOCKOUT: "Group + Knockout",
};

const formatColors: Record<string, string> = {
  ROUND_ROBIN: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  DOUBLE_ROUND_ROBIN: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  SINGLE_ELIMINATION: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  DOUBLE_ELIMINATION: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  SWISS: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  GROUP_KNOCKOUT: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function DashboardPage() {
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [user, setUser] = useState<KBUser | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadTournaments = (currentUser: KBUser | null) => {
    const stored: Tournament[] = JSON.parse(localStorage.getItem("tournaments") || "[]");
    if (currentUser) {
      let changed = false;
      const updated = stored.map((t) => {
        if (!t.userId) {
          changed = true;
          return { ...t, userId: currentUser.email };
        }
        return t;
      });
      if (changed) {
        localStorage.setItem("tournaments", JSON.stringify(updated));
        setAllTournaments(updated);
        return;
      }
    }
    setAllTournaments(stored);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("kb_current_user") || "null");
    setUser(storedUser);
    loadTournaments(storedUser);
  }, []);

  const handleUserChange = (newUser: KBUser | null) => {
    setUser(newUser);
    loadTournaments(newUser);
  };

  const tournaments = allTournaments.filter((t) => !user || !t.userId || t.userId === user.email);

  const copyShareLink = (id: string) => {
    const url = `${window.location.origin}/tournament/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteTournament = (id: string) => {
    const updated = allTournaments.filter((t) => t.id !== id);
    setAllTournaments(updated);
    localStorage.setItem("tournaments", JSON.stringify(updated));
    localStorage.removeItem(`matches_${id}`);
  };

  const totalMatches = tournaments.reduce((acc, t) => {
    const m = JSON.parse(localStorage.getItem(`matches_${t.id}`) || "[]");
    return acc + m.length;
  }, 0);

  const totalTeams = tournaments.reduce((acc, t) => acc + t.teams.length, 0);

  return (
    <>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoIcon size={34} />
            <span className="text-lg font-bold text-white tracking-tight">
              Kick<span className="text-emerald-400">Bracket</span>
            </span>
          </Link>
          <UserNav onUserChange={handleUserChange} />
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12">
        {!user && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0">🔐</div>
              <div>
                <h3 className="text-base font-bold text-white">Sign in to claim your tournaments</h3>
                <p className="text-xs text-slate-400">Log in with Gmail to securely bind brackets to your organizer account across devices.</p>
              </div>
            </div>
            <div className="shrink-0">
              <UserNav onUserChange={handleUserChange} />
            </div>
          </motion.div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage your tournaments</p>
          </div>
          <Link href="/dashboard/create" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/20">
            <PlusIcon /> New Tournament
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            ["Tournaments", String(tournaments.length)],
            ["Matches", String(totalMatches)],
            ["Teams", String(totalTeams)],
          ].map(([label, value], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center"
            >
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mb-2">{label}</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tournaments or Empty */}
        {tournaments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border-2 border-dashed border-white/10 rounded-2xl p-16 flex flex-col items-center text-center"
          >
            <EmptyStateIcon />
            <h2 className="text-xl font-bold text-white mb-2 mt-6">No Tournaments Yet</h2>
            <p className="text-slate-500 text-sm max-w-xs mb-8 leading-relaxed">
              Create your first tournament to start managing teams and generating fixtures.
            </p>
            <Link href="/dashboard/create" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold transition-all hover:shadow-lg hover:shadow-emerald-500/20">
              <PlusIcon /> Create Tournament
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Tournaments</h2>
            {tournaments.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-lg font-bold text-white truncate">{t.name}</h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${formatColors[t.format] || "text-slate-400 bg-slate-800 border-slate-700"}`}>
                      {formatLabels[t.format] || t.format}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t.teams.length} teams · Created {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/tournament/${t.id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white text-sm font-medium transition-all">
                    View <ArrowRightIcon />
                  </Link>
                  <button onClick={() => copyShareLink(t.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-400 text-sm font-medium transition-all">
                    {copied === t.id ? "✓ Copied" : <><ShareLinkIcon /> Share</>}
                  </button>
                  <button onClick={() => deleteTournament(t.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-500 hover:text-red-400 transition-all" title="Delete">
                    <TrashIcon />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
