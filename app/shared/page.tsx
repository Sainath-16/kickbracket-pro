"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogoIcon, TrophyIcon } from "../components/icons";

/* ── Types ── */
type Team = { id: string; name: string; shortCode: string };
type Match = {
  id: string;
  round: number;
  matchNumber: number;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: "SCHEDULED" | "COMPLETED";
};
type Tournament = {
  id: string;
  name: string;
  format: string;
  teams: Team[];
  status: string;
  createdAt: string;
};
type Standing = {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
};

function computeStandings(teams: Team[], matches: Match[]): Standing[] {
  const map: Record<string, Standing> = {};
  teams.forEach((t) => {
    map[t.id] = { teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });
  matches
    .filter((m) => m.status === "COMPLETED" && m.homeTeamId && m.awayTeamId && m.homeScore !== null && m.awayScore !== null)
    .forEach((m) => {
      const h = map[m.homeTeamId!];
      const a = map[m.awayTeamId!];
      if (!h || !a) return;
      h.played++; a.played++;
      h.gf += m.homeScore!; h.ga += m.awayScore!;
      a.gf += m.awayScore!; a.ga += m.homeScore!;
      if (m.homeScore! > m.awayScore!) { h.won++; h.pts += 3; a.lost++; }
      else if (m.homeScore! < m.awayScore!) { a.won++; a.pts += 3; h.lost++; }
      else { h.drawn++; a.drawn++; h.pts += 1; a.pts += 1; }
      h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
    });
  return Object.values(map).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}

const formatLabels: Record<string, string> = {
  ROUND_ROBIN: "Round Robin", DOUBLE_ROUND_ROBIN: "Double Round Robin",
  SINGLE_ELIMINATION: "Single Elimination", DOUBLE_ELIMINATION: "Double Elimination",
  SWISS: "Swiss System", GROUP_KNOCKOUT: "Group + Knockout",
};
const isLeagueFormat = (f: string) => ["ROUND_ROBIN", "DOUBLE_ROUND_ROBIN", "SWISS"].includes(f);

function SharedPageContent() {
  const searchParams = useSearchParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tab, setTab] = useState<"standings" | "fixtures" | "bracket">("standings");
  const [error, setError] = useState(false);
  const [isLiveSync, setIsLiveSync] = useState(false);

  useEffect(() => {
    const liveId = searchParams.get("live");
    if (liveId) {
      setIsLiveSync(true);
      const fetchLive = () => {
        fetch(`https://jsonblob.com/api/jsonBlob/${liveId}`)
          .then((r) => r.json())
          .then((decoded) => {
            if (decoded && decoded.t && decoded.m) {
              setTournament(decoded.t);
              setMatches(decoded.m);
              if (!isLeagueFormat(decoded.t.format)) setTab((prev) => prev || "bracket");
            }
          })
          .catch(() => {});
      };
      fetchLive();
      const interval = setInterval(fetchLive, 4000);
      return () => clearInterval(interval);
    } else {
      try {
        const data = searchParams.get("d");
        if (!data) { setError(true); return; }
        const decoded = JSON.parse(decodeURIComponent(atob(data)));
        setTournament(decoded.t);
        setMatches(decoded.m);
        if (!isLeagueFormat(decoded.t.format)) setTab("bracket");
      } catch {
        setError(true);
      }
    }
  }, [searchParams]);

  const teamMap = useMemo(() => {
    if (!tournament) return {};
    const m: Record<string, Team> = {};
    tournament.teams.forEach((t) => (m[t.id] = t));
    return m;
  }, [tournament]);

  const standings = useMemo(
    () => (tournament ? computeStandings(tournament.teams, matches) : []),
    [tournament, matches]
  );

  const roundGroups = useMemo(() => {
    const groups: Record<number, Match[]> = {};
    matches.forEach((m) => {
      if (!groups[m.round]) groups[m.round] = [];
      groups[m.round].push(m);
    });
    return groups;
  }, [matches]);

  const totalRounds = useMemo(
    () => Math.max(...Object.keys(roundGroups).map(Number), 0),
    [roundGroups]
  );

  // Find winner
  const winnerName = useMemo(() => {
    if (!tournament) return "";
    if (isLeagueFormat(tournament.format)) {
      if (standings.length > 0 && standings[0].played > 0) {
        const allDone = matches.every((m) => m.status === "COMPLETED" || !m.homeTeamId || !m.awayTeamId);
        if (allDone) return teamMap[standings[0].teamId]?.name ?? "";
      }
    } else {
      const finalRound = Math.max(...matches.map((m) => m.round), 0);
      const finalMatch = matches.find((m) => m.round === finalRound && m.status === "COMPLETED");
      if (finalMatch && finalMatch.homeScore !== null && finalMatch.awayScore !== null) {
        const wId = finalMatch.homeScore > finalMatch.awayScore ? finalMatch.homeTeamId : finalMatch.awayTeamId;
        if (wId) return teamMap[wId]?.name ?? "";
      }
    }
    return "";
  }, [tournament, standings, matches, teamMap]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <span className="text-6xl">⚠️</span>
        <h1 className="text-2xl font-bold text-white">Invalid Share Link</h1>
        <p className="text-slate-400 max-w-sm">This link is expired or corrupted. Ask the tournament organizer for a new one.</p>
        <Link href="/" className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Loading shared tournament...</div>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 border-b border-white/5 backdrop-blur-md flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon size={34} />
          <span className="text-lg font-bold text-white tracking-tight">
            Kick<span className="text-emerald-400">Bracket</span>
          </span>
        </Link>
        {isLiveSync ? (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider animate-pulse shadow-sm shadow-red-500/10">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Live Auto-Updating
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            📎 Shared View (Static)
          </span>
        )}
      </nav>

      <main className="w-full max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4">
            {formatLabels[tournament.format] || tournament.format}
          </span>
          <h1 className="text-4xl font-extrabold text-white mb-2">{tournament.name}</h1>
          <p className="text-slate-400 text-sm">{tournament.teams.length} teams</p>
          {winnerName && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <TrophyIcon size={20} />
              <span className="text-emerald-400 font-bold">Champion: {winnerName}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-1 bg-slate-800/60 rounded-xl p-1 mb-10 max-w-md mx-auto">
          {(isLeagueFormat(tournament.format)
            ? (["standings", "fixtures"] as const)
            : (["bracket", "fixtures"] as const)
          ).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                tab === t ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-slate-400 hover:text-white"
              }`}
            >
              {t === "standings" ? "📊 Standings" : t === "bracket" ? "🏆 Bracket" : "📅 Fixtures"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STANDINGS */}
          {tab === "standings" && (
            <motion.div key="standings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="text-center py-4 px-3 w-12">#</th>
                      <th className="text-left py-4 px-4">Team</th>
                      <th className="text-center py-4 px-2">P</th>
                      <th className="text-center py-4 px-2">W</th>
                      <th className="text-center py-4 px-2">D</th>
                      <th className="text-center py-4 px-2">L</th>
                      <th className="text-center py-4 px-2">GD</th>
                      <th className="text-center py-4 px-4 text-emerald-400">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((s, i) => (
                      <motion.tr key={s.teamId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className={`border-b border-slate-700/20 ${i === 0 ? "bg-emerald-500/10" : i === 1 ? "bg-emerald-500/5" : ""}`}
                      >
                        <td className="text-center py-3.5 px-3">
                          {i === 0 ? <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold">1</span>
                            : <span className="text-slate-500 font-bold">{i + 1}</span>}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">{teamMap[s.teamId]?.name ?? "—"}</td>
                        <td className="text-center py-3.5 px-2 text-slate-300">{s.played}</td>
                        <td className="text-center py-3.5 px-2 text-emerald-400 font-semibold">{s.won}</td>
                        <td className="text-center py-3.5 px-2 text-slate-300">{s.drawn}</td>
                        <td className="text-center py-3.5 px-2 text-red-400">{s.lost}</td>
                        <td className="text-center py-3.5 px-2 font-semibold">
                          <span className={s.gd > 0 ? "text-emerald-400" : s.gd < 0 ? "text-red-400" : "text-slate-400"}>
                            {s.gd > 0 ? `+${s.gd}` : s.gd}
                          </span>
                        </td>
                        <td className="text-center py-3.5 px-4 font-extrabold text-lg text-emerald-400">{s.pts}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* BRACKET */}
          {tab === "bracket" && (
            <motion.div key="bracket" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <div className="overflow-x-auto pb-6">
                <div className="flex gap-2 min-w-max items-start justify-center">
                  {Array.from({ length: totalRounds }, (_, r) => r + 1).map((round) => {
                    const roundLabel = round === totalRounds ? "🏆 Final" : round === totalRounds - 1 && totalRounds > 2 ? "Semi-Finals" : `Round ${round}`;
                    return (
                      <div key={round} className="flex flex-col items-center" style={{ marginTop: `${(Math.pow(2, round - 1) - 1) * 32}px` }}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-4 px-2">{roundLabel}</h3>
                        <div className="flex flex-col" style={{ gap: `${Math.pow(2, round) * 16 - 16}px` }}>
                          {(roundGroups[round] || []).map((match, mi) => {
                            const home = match.homeTeamId ? teamMap[match.homeTeamId] : null;
                            const away = match.awayTeamId ? teamMap[match.awayTeamId] : null;
                            const completed = match.status === "COMPLETED";
                            const homeWon = completed && match.homeScore! > match.awayScore!;
                            const awayWon = completed && match.awayScore! > match.homeScore!;
                            return (
                              <motion.div key={match.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: round * 0.1 + mi * 0.05 }}
                                className={`w-52 rounded-xl overflow-hidden shadow-lg border ${round === totalRounds && completed ? "border-emerald-500/50" : "border-slate-700/50"}`}
                              >
                                <div className={`flex items-center justify-between px-3 py-2.5 ${homeWon ? "bg-emerald-500/15" : "bg-slate-800"}`}>
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${homeWon ? "bg-emerald-400" : "bg-transparent"}`} />
                                    <span className={`text-sm truncate ${homeWon ? "text-emerald-400 font-bold" : home ? "text-slate-200 font-medium" : "text-slate-500 italic"}`}>
                                      {home?.name ?? "TBD"}
                                    </span>
                                  </div>
                                  <span className={`text-sm font-bold ml-2 tabular-nums ${homeWon ? "text-emerald-400" : "text-slate-500"}`}>{match.homeScore ?? "–"}</span>
                                </div>
                                <div className="h-px bg-slate-700/50" />
                                <div className={`flex items-center justify-between px-3 py-2.5 ${awayWon ? "bg-emerald-500/15" : "bg-slate-800"}`}>
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${awayWon ? "bg-emerald-400" : "bg-transparent"}`} />
                                    <span className={`text-sm truncate ${awayWon ? "text-emerald-400 font-bold" : away ? "text-slate-200 font-medium" : "text-slate-500 italic"}`}>
                                      {away?.name ?? "TBD"}
                                    </span>
                                  </div>
                                  <span className={`text-sm font-bold ml-2 tabular-nums ${awayWon ? "text-emerald-400" : "text-slate-500"}`}>{match.awayScore ?? "–"}</span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* FIXTURES */}
          {tab === "fixtures" && (
            <motion.div key="fixtures" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="flex flex-col gap-8">
              {Object.entries(roundGroups).sort(([a], [b]) => Number(a) - Number(b)).map(([round, roundMatches]) => (
                <div key={round}>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Round {round}</h3>
                  <div className="flex flex-col gap-2">
                    {roundMatches.map((match, idx) => {
                      const home = match.homeTeamId ? teamMap[match.homeTeamId] : null;
                      const away = match.awayTeamId ? teamMap[match.awayTeamId] : null;
                      const completed = match.status === "COMPLETED";
                      return (
                        <motion.div key={match.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                          className="bg-slate-800 rounded-xl border border-slate-700/30 p-4 flex items-center gap-4"
                        >
                          <div className="flex-1 text-right">
                            <span className={`font-semibold ${completed && match.homeScore! > match.awayScore! ? "text-emerald-400" : "text-white"}`}>
                              {home?.name ?? "TBD"}
                            </span>
                          </div>
                          <div className={`px-4 py-1.5 rounded-lg text-sm font-bold min-w-[80px] text-center ${completed ? "bg-slate-700/80 text-white" : "bg-slate-700/40 text-slate-500"}`}>
                            {completed ? `${match.homeScore} – ${match.awayScore}` : "vs"}
                          </div>
                          <div className="flex-1">
                            <span className={`font-semibold ${completed && match.awayScore! > match.homeScore! ? "text-emerald-400" : "text-white"}`}>
                              {away?.name ?? "TBD"}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

export default function SharedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}>
      <SharedPageContent />
    </Suspense>
  );
}
