"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogoIcon, TrophyIcon, ShareLinkIcon, EmptyStateIcon } from "../../components/icons";

/* ── Types ── */
type Team = { id: string; name: string; shortCode: string };
type MatchStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
type Match = {
  id: string;
  round: number;
  matchNumber: number;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
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

/* ── Generators ── */
function generateRoundRobinFixtures(teams: Team[], doubleRound = false): Match[] {
  const list = [...teams];
  if (list.length % 2 !== 0) list.push({ id: "BYE", name: "BYE", shortCode: "BYE" });
  const n = list.length;
  const rounds = n - 1;
  const matchesPerRound = n / 2;
  const matches: Match[] = [];
  let matchNum = 1;
  const fixed = list[0];
  const rotating = list.slice(1);
  for (let r = 0; r < rounds; r++) {
    const current = [fixed, ...rotating];
    for (let m = 0; m < matchesPerRound; m++) {
      const home = current[m];
      const away = current[n - 1 - m];
      if (home.id !== "BYE" && away.id !== "BYE") {
        matches.push({ id: crypto.randomUUID(), round: r + 1, matchNumber: matchNum++, homeTeamId: home.id, awayTeamId: away.id, homeScore: null, awayScore: null, status: "SCHEDULED" });
      }
    }
    rotating.push(rotating.shift()!);
  }
  if (doubleRound) {
    const secondLeg = matches.map((m) => ({ ...m, id: crypto.randomUUID(), round: m.round + rounds, matchNumber: matchNum++, homeTeamId: m.awayTeamId, awayTeamId: m.homeTeamId }));
    return [...matches, ...secondLeg];
  }
  return matches;
}

function generateEliminationFixtures(teams: Team[]): Match[] {
  let size = 1;
  while (size < teams.length) size *= 2;
  const totalRounds = Math.log2(size);
  const matches: Match[] = [];
  let matchNum = 1;
  for (let i = 0; i < size / 2; i++) {
    const home = teams[i * 2] || null;
    const away = teams[i * 2 + 1] || null;
    matches.push({ id: crypto.randomUUID(), round: 1, matchNumber: matchNum++, homeTeamId: home?.id ?? null, awayTeamId: away?.id ?? null, homeScore: null, awayScore: null, status: home && away ? "SCHEDULED" : "COMPLETED" });
  }
  for (let r = 2; r <= totalRounds; r++) {
    const cnt = size / Math.pow(2, r);
    for (let i = 0; i < cnt; i++) {
      matches.push({ id: crypto.randomUUID(), round: r, matchNumber: matchNum++, homeTeamId: null, awayTeamId: null, homeScore: null, awayScore: null, status: "SCHEDULED" });
    }
  }
  return matches;
}

function generateFixtures(format: string, teams: Team[]): Match[] {
  switch (format) {
    case "ROUND_ROBIN": case "SWISS": return generateRoundRobinFixtures(teams);
    case "DOUBLE_ROUND_ROBIN": return generateRoundRobinFixtures(teams, true);
    default: return generateEliminationFixtures(teams);
  }
}

function computeStandings(teams: Team[], matches: Match[]): Standing[] {
  const map: Record<string, Standing> = {};
  teams.forEach((t) => { map[t.id] = { teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 }; });
  matches.filter((m) => m.status === "COMPLETED" && m.homeTeamId && m.awayTeamId && m.homeScore !== null && m.awayScore !== null).forEach((m) => {
    const h = map[m.homeTeamId!]; const a = map[m.awayTeamId!];
    if (!h || !a) return;
    h.played++; a.played++; h.gf += m.homeScore!; h.ga += m.awayScore!; a.gf += m.awayScore!; a.ga += m.homeScore!;
    if (m.homeScore! > m.awayScore!) { h.won++; h.pts += 3; a.lost++; }
    else if (m.homeScore! < m.awayScore!) { a.won++; a.pts += 3; h.lost++; }
    else { h.drawn++; a.drawn++; h.pts += 1; a.pts += 1; }
    h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
  });
  return Object.values(map).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}

const formatLabels: Record<string, string> = { ROUND_ROBIN: "Round Robin", DOUBLE_ROUND_ROBIN: "Double Round Robin", SINGLE_ELIMINATION: "Single Elimination", DOUBLE_ELIMINATION: "Double Elimination", SWISS: "Swiss System", GROUP_KNOCKOUT: "Group + Knockout" };
const isLeagueFormat = (f: string) => ["ROUND_ROBIN", "DOUBLE_ROUND_ROBIN", "SWISS"].includes(f);

/* ── Confetti ── */
function ConfettiParticle({ index }: { index: number }) {
  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 360;
  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
      animate={{ y: [0, 600 + Math.random() * 400], x: [0, (Math.random() - 0.5) * 200], opacity: [1, 1, 0], rotate: [0, rotation + 720] }}
      transition={{ duration: 3 + Math.random() * 2, delay, ease: "easeOut" }}
      style={{ position: "absolute", left: `${left}%`, top: -10, width: size, height: size * 0.6, backgroundColor: color, borderRadius: 2 }}
    />
  );
}

/* ── Winner Modal ── */
function WinnerModal({ winnerName, onClose, onViewResults }: { winnerName: string; onClose: () => void; onViewResults: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">{Array.from({ length: 80 }).map((_, i) => <ConfettiParticle key={i} index={i} />)}</div>
      <motion.div initial={{ scale: 0.5, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }} onClick={(e) => e.stopPropagation()} className="relative bg-[#0d1117] border border-white/10 rounded-2xl p-10 max-w-md w-full mx-4 text-center shadow-2xl">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="mb-4 inline-block"><TrophyIcon size={72} animate /></motion.div>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">Tournament Champion</motion.h2>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-3xl font-extrabold text-white mb-6">{winnerName}</motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <button onClick={onViewResults} className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-colors shadow-lg shadow-emerald-500/20">View Results</button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Match Win Toast ── */
function MatchWinToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl shadow-emerald-500/30 font-bold text-sm flex items-center gap-3"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M9 1v4M1 9h4M14 4l-2.5 2.5M4 4l2.5 2.5M14 14l-2.5-2.5M4 14l2.5-2.5M13 9h4M9 13v4" /></svg>
      {message}
    </motion.div>
  );
}

/* ── Score Entry Modal ── */
function ScoreModal({
  homeName, awayName, initialHome, initialAway, onSave, onCancel,
}: { homeName: string; awayName: string; initialHome?: number | null; initialAway?: number | null; onSave: (h: number, a: number) => void; onCancel: () => void }) {
  const [h, setH] = useState(initialHome !== null && initialHome !== undefined ? String(initialHome) : "");
  const [a, setA] = useState(initialAway !== null && initialAway !== undefined ? String(initialAway) : "");
  const valid = h !== "" && a !== "" && !isNaN(Number(h)) && !isNaN(Number(a)) && Number(h) >= 0 && Number(a) >= 0;
  const isEdit = initialHome !== null && initialHome !== undefined;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-[#0d1117] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-bold text-white text-center mb-6">{isEdit ? "Edit Match Score" : "Enter Final Score"}</h3>
        <div className="flex items-center gap-4 justify-center mb-8">
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-sm font-semibold text-slate-300 truncate max-w-[120px]">{homeName}</span>
            <input type="number" min="0" value={h} onChange={(e) => setH(e.target.value)} autoFocus className="w-20 h-14 rounded-xl bg-slate-900 border border-slate-600 text-white text-2xl font-bold text-center focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <span className="text-slate-500 font-bold text-xl mt-6">:</span>
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-sm font-semibold text-slate-300 truncate max-w-[120px]">{awayName}</span>
            <input type="number" min="0" value={a} onChange={(e) => setA(e.target.value)} className="w-20 h-14 rounded-xl bg-slate-900 border border-slate-600 text-white text-2xl font-bold text-center focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              onKeyDown={(e) => e.key === "Enter" && valid && onSave(Number(h), Number(a))}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors">Cancel</button>
          <button onClick={() => valid && onSave(Number(h), Number(a))} disabled={!valid} className="flex-1 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold transition-colors">{isEdit ? "Update Score" : "Save Score"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main ── */
export default function TournamentPublicPage() {
  const params = useParams();
  const id = params.id as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tab, setTab] = useState<"standings" | "fixtures" | "bracket">("standings");
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [scoringMatch, setScoringMatch] = useState<string | null>(null);

  useEffect(() => {
    const stored: Tournament[] = JSON.parse(localStorage.getItem("tournaments") || "[]");
    const found = stored.find((t) => t.id === id);
    if (!found) { setNotFound(true); return; }
    setTournament(found);
    const storedMatches = localStorage.getItem(`matches_${id}`);
    if (storedMatches) { setMatches(JSON.parse(storedMatches)); }
    else {
      const generated = generateFixtures(found.format, found.teams);
      setMatches(generated);
      localStorage.setItem(`matches_${id}`, JSON.stringify(generated));
    }
    if (!isLeagueFormat(found.format)) setTab("bracket");
  }, [id]);

  const teamMap = useMemo(() => {
    if (!tournament) return {};
    const m: Record<string, Team> = {};
    tournament.teams.forEach((t) => (m[t.id] = t));
    return m;
  }, [tournament]);

  const standings = useMemo(() => (tournament ? computeStandings(tournament.teams, matches) : []), [tournament, matches]);

  const roundGroups = useMemo(() => {
    const groups: Record<number, Match[]> = {};
    matches.forEach((m) => { if (!groups[m.round]) groups[m.round] = []; groups[m.round].push(m); });
    return groups;
  }, [matches]);

  const totalRounds = useMemo(() => Math.max(...Object.keys(roundGroups).map(Number), 0), [roundGroups]);

  // Determine which round is active (first round with non-completed matches)
  const activeRound = useMemo(() => {
    for (let r = 1; r <= totalRounds; r++) {
      const rm = roundGroups[r] || [];
      const hasPlayable = rm.some((m) => m.homeTeamId && m.awayTeamId);
      const allDone = rm.filter((m) => m.homeTeamId && m.awayTeamId).every((m) => m.status === "COMPLETED" || m.status === "CANCELLED");
      if (hasPlayable && !allDone) return r;
    }
    return totalRounds; // all done
  }, [roundGroups, totalRounds]);

  const isRoundLocked = (round: number) => round > activeRound;
  const isRoundComplete = (round: number) => {
    const rm = roundGroups[round] || [];
    return rm.filter((m) => m.homeTeamId && m.awayTeamId).every((m) => m.status === "COMPLETED" || m.status === "CANCELLED");
  };

  const persist = (updated: Match[]) => {
    setMatches(updated);
    localStorage.setItem(`matches_${id}`, JSON.stringify(updated));
  };

  const startMatch = (matchId: string) => {
    persist(matches.map((m) => m.id === matchId ? { ...m, status: "LIVE" as MatchStatus } : m));
  };

  const cancelMatch = (matchId: string) => {
    persist(matches.map((m) => m.id === matchId ? { ...m, status: "CANCELLED" as MatchStatus } : m));
  };

  const finishMatch = (matchId: string, homeScore: number, awayScore: number) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;
    let updated = matches.map((m) => m.id === matchId ? { ...m, homeScore, awayScore, status: "COMPLETED" as MatchStatus } : m);

    if (tournament && !isLeagueFormat(tournament.format)) {
      const r = match.round;
      const roundMatches = updated.filter((m) => m.round === r);
      const idx = roundMatches.findIndex((m) => m.id === matchId);
      if (idx !== -1) {
        const nextRoundMatches = updated.filter((m) => m.round === r + 1);
        const nextMatch = nextRoundMatches[Math.floor(idx / 2)];
        if (nextMatch) {
          const winnerId = homeScore > awayScore ? match.homeTeamId : awayScore > homeScore ? match.awayTeamId : null;
          const isHomePos = idx % 2 === 0;
          updated = updated.map((m) => {
            if (m.id === nextMatch.id) {
              const teamChanged = (isHomePos && m.homeTeamId !== winnerId) || (!isHomePos && m.awayTeamId !== winnerId);
              const newHome = isHomePos ? winnerId : m.homeTeamId;
              const newAway = !isHomePos ? winnerId : m.awayTeamId;
              const newStatus = newHome && newAway ? (teamChanged && m.status === "COMPLETED" ? "SCHEDULED" : m.status) : "SCHEDULED";
              return {
                ...m,
                homeTeamId: newHome,
                awayTeamId: newAway,
                homeScore: teamChanged ? null : m.homeScore,
                awayScore: teamChanged ? null : m.awayScore,
                status: newStatus as MatchStatus,
              };
            }
            return m;
          });
        }
      }
    }

    persist(updated);
    setScoringMatch(null);

    // Toast
    const homeName = match.homeTeamId ? teamMap[match.homeTeamId]?.name : "TBD";
    const awayName = match.awayTeamId ? teamMap[match.awayTeamId]?.name : "TBD";
    if (homeScore > awayScore) setToast(`${homeName} wins ${homeScore}–${awayScore}! What a performance!`);
    else if (awayScore > homeScore) setToast(`${awayName} wins ${awayScore}–${homeScore}! Incredible result!`);
    else setToast(`It's a draw ${homeScore}–${awayScore}! Both teams gave it their all!`);

    // Check tournament winner
    setTimeout(() => checkForWinner(updated), 500);
  };

  const checkForWinner = useCallback((updatedMatches: Match[]) => {
    if (!tournament) return;
    const playable = updatedMatches.filter((m) => m.homeTeamId && m.awayTeamId);
    const allDone = playable.every((m) => m.status === "COMPLETED" || m.status === "CANCELLED");
    if (!allDone) return;
    let winner = "";
    if (isLeagueFormat(tournament.format)) {
      const s = computeStandings(tournament.teams, updatedMatches);
      if (s.length > 0 && s[0].played > 0) winner = teamMap[s[0].teamId]?.name ?? "";
    } else {
      const finalRound = Math.max(...updatedMatches.map((m) => m.round));
      const finalMatch = updatedMatches.find((m) => m.round === finalRound && m.status === "COMPLETED");
      if (finalMatch && finalMatch.homeScore !== null && finalMatch.awayScore !== null) {
        const wId = finalMatch.homeScore > finalMatch.awayScore ? finalMatch.homeTeamId : finalMatch.awayTeamId;
        if (wId) winner = teamMap[wId]?.name ?? "";
      }
    }
    if (winner) { setWinnerName(winner); setTimeout(() => setShowWinner(true), 800); }
  }, [tournament, teamMap]);

  const generateShareableLink = () => {
    if (!tournament) return;
    const encoded = btoa(encodeURIComponent(JSON.stringify({ t: tournament, m: matches })));
    navigator.clipboard.writeText(`${window.location.origin}/shared?d=${encoded}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const scoringMatchData = useMemo(() => {
    if (!scoringMatch) return null;
    const m = matches.find((x) => x.id === scoringMatch);
    if (!m) return null;
    return { match: m, homeName: m.homeTeamId ? teamMap[m.homeTeamId]?.name ?? "TBD" : "TBD", awayName: m.awayTeamId ? teamMap[m.awayTeamId]?.name ?? "TBD" : "TBD" };
  }, [scoringMatch, matches, teamMap]);

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <EmptyStateIcon /><h1 className="text-2xl font-bold text-white">Tournament Not Found</h1>
      <p className="text-slate-400">This tournament may have been deleted.</p>
      <Link href="/" className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 transition-colors">Go Home</Link>
    </div>
  );

  if (!tournament) return <div className="min-h-screen flex items-center justify-center"><div className="text-slate-400">Loading...</div></div>;

  return (
    <>
      {/* Modals */}
      <AnimatePresence>{showWinner && <WinnerModal winnerName={winnerName} onClose={() => setShowWinner(false)} onViewResults={() => { setShowWinner(false); setTab(isLeagueFormat(tournament.format) ? "standings" : "bracket"); }} />}</AnimatePresence>
      <AnimatePresence>{scoringMatchData && <ScoreModal homeName={scoringMatchData.homeName} awayName={scoringMatchData.awayName} initialHome={scoringMatchData.match.homeScore} initialAway={scoringMatchData.match.awayScore} onSave={(h, a) => finishMatch(scoringMatchData.match.id, h, a)} onCancel={() => setScoringMatch(null)} />}</AnimatePresence>
      <AnimatePresence>{toast && <MatchWinToast message={toast} onDone={() => setToast(null)} />}</AnimatePresence>

      <nav className="relative z-10 w-full px-6 py-4 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon size={34} />
          <span className="text-lg font-bold text-white tracking-tight">Kick<span className="text-emerald-400">Bracket</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-white transition-colors">Dashboard</Link>
          <button onClick={generateShareableLink} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-400 text-sm font-medium transition-colors">
            {copied ? "\u2713 Copied!" : <><ShareLinkIcon /> Share</>}
          </button>
        </div>
        </div>
      </nav>

      <main className="w-full max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4">{formatLabels[tournament.format]}</span>
          <h1 className="text-4xl font-extrabold text-white mb-2">{tournament.name}</h1>
          <p className="text-slate-400 text-sm">{tournament.teams.length} teams · Round {activeRound} of {totalRounds}</p>
          {winnerName && !showWinner && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <TrophyIcon size={20} /><span className="text-emerald-400 font-bold">Champion: {winnerName}</span>
            </motion.div>
          )}
        </motion.div>

        <div className="flex justify-center gap-1 bg-white/[0.03] rounded-xl p-1 mb-10 max-w-md mx-auto border border-white/5">
          {(isLeagueFormat(tournament.format) ? (["standings", "fixtures"] as const) : (["bracket", "fixtures"] as const)).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-white"}`}>
              {t === "standings" ? "Standings" : t === "bracket" ? "Bracket" : "Fixtures"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── STANDINGS ── */}
          {tab === "standings" && (
            <motion.div key="standings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="text-center py-4 px-3 w-12">#</th><th className="text-left py-4 px-4">Team</th>
                    <th className="text-center py-4 px-2">P</th><th className="text-center py-4 px-2">W</th><th className="text-center py-4 px-2">D</th><th className="text-center py-4 px-2">L</th>
                    <th className="text-center py-4 px-2 hidden sm:table-cell">GF</th><th className="text-center py-4 px-2 hidden sm:table-cell">GA</th><th className="text-center py-4 px-2">GD</th>
                    <th className="text-center py-4 px-4 text-emerald-400">PTS</th>
                  </tr></thead>
                  <tbody>{standings.map((s, i) => (
                    <motion.tr key={s.teamId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className={`border-b border-slate-700/20 hover:bg-slate-700/20 transition-colors ${i === 0 ? "bg-emerald-500/10" : i === 1 ? "bg-emerald-500/5" : ""}`}>
                      <td className="text-center py-3.5 px-3">{i === 0 ? <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold">1</span> : i === 1 ? <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-600 text-white text-xs font-bold">2</span> : <span className="text-slate-500 font-bold">{i+1}</span>}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{teamMap[s.teamId]?.name ?? "—"}</td>
                      <td className="text-center py-3.5 px-2 text-slate-300">{s.played}</td>
                      <td className="text-center py-3.5 px-2 text-emerald-400 font-semibold">{s.won}</td>
                      <td className="text-center py-3.5 px-2 text-slate-300">{s.drawn}</td>
                      <td className="text-center py-3.5 px-2 text-red-400">{s.lost}</td>
                      <td className="text-center py-3.5 px-2 text-slate-300 hidden sm:table-cell">{s.gf}</td>
                      <td className="text-center py-3.5 px-2 text-slate-300 hidden sm:table-cell">{s.ga}</td>
                      <td className="text-center py-3.5 px-2 font-semibold"><span className={s.gd > 0 ? "text-emerald-400" : s.gd < 0 ? "text-red-400" : "text-slate-400"}>{s.gd > 0 ? `+${s.gd}` : s.gd}</span></td>
                      <td className="text-center py-3.5 px-4 font-extrabold text-lg text-emerald-400">{s.pts}</td>
                    </motion.tr>
                  ))}</tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── BRACKET ── */}
          {tab === "bracket" && (
            <motion.div key="bracket" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              <div className="overflow-x-auto pb-6">
                <div className="flex gap-2 min-w-max items-start justify-center">
                  {Array.from({ length: totalRounds }, (_, r) => r + 1).map((round) => {
                    const roundLabel = round === totalRounds ? "🏆 Final" : round === totalRounds - 1 && totalRounds > 2 ? "Semi-Finals" : round === totalRounds - 2 && totalRounds > 3 ? "Quarter-Finals" : `Round ${round}`;
                    const locked = isRoundLocked(round);
                    return (
                      <div key={round} className="flex flex-col items-center" style={{ marginTop: `${(Math.pow(2, round - 1) - 1) * 32}px` }}>
                        <h3 className={`text-xs font-bold uppercase tracking-wider text-center mb-4 px-2 ${locked ? "text-slate-600" : "text-slate-400"}`}>{roundLabel}{locked && " 🔒"}</h3>
                        <div className="flex flex-col" style={{ gap: `${Math.pow(2, round) * 16 - 16}px` }}>
                          {(roundGroups[round] || []).map((match, mi) => {
                            const home = match.homeTeamId ? teamMap[match.homeTeamId] : null;
                            const away = match.awayTeamId ? teamMap[match.awayTeamId] : null;
                            const completed = match.status === "COMPLETED";
                            const live = match.status === "LIVE";
                            const homeWon = completed && match.homeScore! > match.awayScore!;
                            const awayWon = completed && match.awayScore! > match.homeScore!;
                            return (
                              <motion.div key={match.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: round * 0.1 + mi * 0.05 }}
                                onClick={() => !locked && home && away && setScoringMatch(match.id)}
                                title={!locked && home && away ? "Click to enter/edit score" : undefined}
                                className={`w-52 rounded-xl overflow-hidden shadow-lg border transition-all ${!locked && home && away ? "cursor-pointer hover:border-slate-400 hover:shadow-xl" : ""} ${live ? "border-red-500/50 shadow-red-500/10" : round === totalRounds && completed ? "border-emerald-500/50 shadow-emerald-500/10" : locked ? "border-slate-800 opacity-50" : "border-slate-700/50"}`}>
                                {live && <div className="bg-red-500/10 px-3 py-1 flex items-center justify-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Live</span></div>}
                                <div className={`flex items-center justify-between px-3 py-2.5 ${homeWon ? "bg-emerald-500/15" : "bg-slate-800"}`}>
                                  <div className="flex items-center gap-2 min-w-0 flex-1"><span className={`w-1.5 h-1.5 rounded-full shrink-0 ${homeWon ? "bg-emerald-400" : "bg-transparent"}`} /><span className={`text-sm truncate ${homeWon ? "text-emerald-400 font-bold" : home ? "text-slate-200 font-medium" : "text-slate-500 italic"}`}>{home?.name ?? "TBD"}</span></div>
                                  <span className={`text-sm font-bold ml-2 tabular-nums ${homeWon ? "text-emerald-400" : "text-slate-500"}`}>{match.homeScore ?? "–"}</span>
                                </div>
                                <div className="h-px bg-slate-700/50" />
                                <div className={`flex items-center justify-between px-3 py-2.5 ${awayWon ? "bg-emerald-500/15" : "bg-slate-800"}`}>
                                  <div className="flex items-center gap-2 min-w-0 flex-1"><span className={`w-1.5 h-1.5 rounded-full shrink-0 ${awayWon ? "bg-emerald-400" : "bg-transparent"}`} /><span className={`text-sm truncate ${awayWon ? "text-emerald-400 font-bold" : away ? "text-slate-200 font-medium" : "text-slate-500 italic"}`}>{away?.name ?? "TBD"}</span></div>
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

          {/* ── FIXTURES ── */}
          {tab === "fixtures" && (
            <motion.div key="fixtures" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="flex flex-col gap-10">
              {Object.entries(roundGroups).sort(([a], [b]) => Number(a) - Number(b)).map(([roundStr, roundMatches]) => {
                const round = Number(roundStr);
                const locked = isRoundLocked(round);
                const complete = isRoundComplete(round);
                return (
                  <div key={round}>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Round {round}</h3>
                      {locked && <span className="text-xs bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">🔒 Locked</span>}
                      {complete && <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">✓ Complete</span>}
                      {!locked && !complete && <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">▶ Active</span>}
                    </div>

                    <div className="flex flex-col gap-3">
                      {roundMatches.map((match, idx) => {
                        const home = match.homeTeamId ? teamMap[match.homeTeamId] : null;
                        const away = match.awayTeamId ? teamMap[match.awayTeamId] : null;
                        const isLive = match.status === "LIVE";
                        const isCompleted = match.status === "COMPLETED";
                        const isCancelled = match.status === "CANCELLED";
                        const isScheduled = match.status === "SCHEDULED";
                        const noTeams = !match.homeTeamId || !match.awayTeamId;

                        return (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className={`rounded-xl border overflow-hidden transition-all ${
                              isLive ? "border-red-500/40 bg-slate-800 shadow-lg shadow-red-500/5" :
                              isCancelled ? "border-slate-800 bg-slate-800/30 opacity-50" :
                              isCompleted ? "border-slate-700/30 bg-slate-800/80" :
                              locked ? "border-slate-800 bg-slate-800/30 opacity-40" :
                              "border-slate-700/50 bg-slate-800"
                            }`}
                          >
                            {/* Live banner */}
                            {isLive && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-500/10 px-4 py-1.5 flex items-center justify-center gap-2 border-b border-red-500/20"
                              >
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                                </span>
                                <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Match In Progress</span>
                              </motion.div>
                            )}

                            {/* Cancelled banner */}
                            {isCancelled && (
                              <div className="bg-slate-900 px-4 py-1.5 flex items-center justify-center gap-2 border-b border-slate-700/30">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Cancelled</span>
                              </div>
                            )}

                            <div className="p-4 flex items-center gap-4">
                              {/* Home */}
                              <div className="flex-1 text-right">
                                <span className={`font-semibold ${isCompleted && match.homeScore! > match.awayScore! ? "text-emerald-400" : isCancelled ? "text-slate-600" : "text-white"}`}>
                                  {home?.name ?? "TBD"}
                                </span>
                              </div>

                              {/* Center: Score or status */}
                              <div className="shrink-0 min-w-[100px] text-center">
                                {isCompleted ? (
                                  <button onClick={() => setScoringMatch(match.id)} title="Click to edit score" className="px-4 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-white font-bold text-sm inline-block transition-colors cursor-pointer shadow">
                                    {match.homeScore} – {match.awayScore}
                                  </button>
                                ) : isLive ? (
                                  <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-red-400 font-bold text-sm">
                                    LIVE
                                  </motion.span>
                                ) : isCancelled ? (
                                  <span className="text-slate-600 font-bold text-xs">— : —</span>
                                ) : (
                                  <span className="text-slate-500 text-sm font-medium">vs</span>
                                )}
                              </div>

                              {/* Away */}
                              <div className="flex-1">
                                <span className={`font-semibold ${isCompleted && match.awayScore! > match.homeScore! ? "text-emerald-400" : isCancelled ? "text-slate-600" : "text-white"}`}>
                                  {away?.name ?? "TBD"}
                                </span>
                              </div>
                            </div>

                            {/* Action buttons */}
                            {!locked && !noTeams && !isCancelled && (
                              <div className="px-4 pb-3 flex items-center justify-center gap-2">
                                {isScheduled && (
                                  <>
                                    <button onClick={() => startMatch(match.id)} className="px-4 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-600/30 transition-colors">
                                      ▶ Start Match
                                    </button>
                                    <button onClick={() => setScoringMatch(match.id)} className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-600/30 transition-colors">
                                      📝 Enter Score
                                    </button>
                                    <button onClick={() => cancelMatch(match.id)} className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-400 text-xs font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-slate-700 transition-colors">
                                      Cancel
                                    </button>
                                  </>
                                )}
                                {isLive && (
                                  <button onClick={() => setScoringMatch(match.id)} className="px-5 py-1.5 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-600/30 transition-colors">
                                    🏁 Finish Match
                                  </button>
                                )}
                                {isCompleted && (
                                  <div className="flex items-center gap-3">
                                    <span className="text-emerald-400/80 text-xs font-medium">✓ Completed</span>
                                    <button onClick={() => setScoringMatch(match.id)} className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm">
                                      ✏️ Edit Score
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
