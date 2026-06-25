"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Team = { id: string; name: string; shortCode: string };
type Tournament = {
  id: string;
  name: string;
  format: string;
  teams: Team[];
  status: string;
  createdAt: string;
};

const formatLabels: Record<string, string> = {
  ROUND_ROBIN: "Round Robin",
  DOUBLE_ROUND_ROBIN: "Double Round Robin",
  SINGLE_ELIMINATION: "Single Elimination",
  DOUBLE_ELIMINATION: "Double Elimination",
  SWISS: "Swiss System",
  GROUP_KNOCKOUT: "Group + Knockout",
};

const formatEmoji: Record<string, string> = {
  ROUND_ROBIN: "🔄",
  DOUBLE_ROUND_ROBIN: "🔁",
  SINGLE_ELIMINATION: "⚔️",
  DOUBLE_ELIMINATION: "🛡️",
  SWISS: "🧩",
  GROUP_KNOCKOUT: "🏟️",
};

export default function DashboardPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tournaments") || "[]");
    setTournaments(stored);
  }, []);

  const copyShareLink = (id: string) => {
    const url = `${window.location.origin}/tournament/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteTournament = (id: string) => {
    const updated = tournaments.filter((t) => t.id !== id);
    setTournaments(updated);
    localStorage.setItem("tournaments", JSON.stringify(updated));
  };

  return (
    <>
      {/* Navbar */}
      <nav className="w-full px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
            K
          </div>
          <span className="text-lg font-bold text-white">
            KickBracket <span className="text-emerald-400">Pro</span>
          </span>
        </Link>
      </nav>

      <main className="w-full max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-slate-400 text-sm">Manage your tournaments</p>
          </div>
          <Link
            href="/dashboard/create"
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
          >
            + New Tournament
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            ["Tournaments", String(tournaments.length)],
            [
              "Matches",
              String(
                tournaments.reduce((acc, t) => {
                  const matches = JSON.parse(
                    localStorage.getItem(`matches_${t.id}`) || "[]"
                  );
                  return acc + matches.length;
                }, 0)
              ),
            ],
            [
              "Teams",
              String(tournaments.reduce((acc, t) => acc + t.teams.length, 0)),
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-slate-800 border border-slate-700/50 rounded-xl p-5 text-center"
            >
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
                {label}
              </p>
              <p className="text-3xl font-bold text-emerald-400">{value}</p>
            </div>
          ))}
        </div>

        {/* Tournament list or empty state */}
        {tournaments.length === 0 ? (
          <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl p-14 flex flex-col items-center text-center">
            <span className="text-5xl mb-5">🏆</span>
            <h2 className="text-xl font-bold text-white mb-2">
              No Tournaments Yet
            </h2>
            <p className="text-slate-400 text-sm max-w-xs mb-8 leading-relaxed">
              Create your first tournament to start managing teams and
              generating fixtures.
            </p>
            <Link
              href="/dashboard/create"
              className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
            >
              Create Tournament
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-300 mb-1">
              Your Tournaments
            </h2>
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="bg-slate-800 border border-slate-700/50 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {formatEmoji[t.format] || "🏆"}
                    </span>
                    <h3 className="text-lg font-bold text-white truncate">
                      {t.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="bg-slate-700/60 px-2 py-0.5 rounded-full">
                      {formatLabels[t.format] || t.format}
                    </span>
                    <span>{t.teams.length} teams</span>
                    <span>
                      Created{" "}
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/tournament/${t.id}`}
                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => copyShareLink(t.id)}
                    className="px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-sm font-medium transition-colors"
                  >
                    {copied === t.id ? "✓ Copied!" : "🔗 Share"}
                  </button>
                  <button
                    onClick={() => deleteTournament(t.id)}
                    className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-400 text-sm transition-colors"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
