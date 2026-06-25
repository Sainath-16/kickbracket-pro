"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const formats = [
  {
    id: "ROUND_ROBIN",
    name: "Round Robin",
    icon: "🔄",
    desc: "Every team plays every other team. Best for leagues.",
    minTeams: 3,
    color: "emerald",
  },
  {
    id: "DOUBLE_ROUND_ROBIN",
    name: "Double Round Robin",
    icon: "🔁",
    desc: "Two full rounds — home and away for each pairing.",
    minTeams: 3,
    color: "teal",
  },
  {
    id: "SINGLE_ELIMINATION",
    name: "Single Elimination",
    icon: "⚔️",
    desc: "Lose once and you're out. Fast and dramatic.",
    minTeams: 2,
    color: "blue",
  },
  {
    id: "DOUBLE_ELIMINATION",
    name: "Double Elimination",
    icon: "🛡️",
    desc: "Two losses to be eliminated. Losers get a second chance.",
    minTeams: 4,
    color: "violet",
  },
  {
    id: "SWISS",
    name: "Swiss System",
    icon: "🧩",
    desc: "Teams with similar records face each other each round.",
    minTeams: 4,
    color: "amber",
  },
  {
    id: "GROUP_KNOCKOUT",
    name: "Group + Knockout",
    icon: "🏟️",
    desc: "Group stage followed by single-elimination playoffs.",
    minTeams: 8,
    color: "rose",
  },
];

const colorMap: Record<string, { bg: string; border: string; ring: string; text: string; iconBg: string }> = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", ring: "ring-emerald-500", text: "text-emerald-400", iconBg: "bg-emerald-500/20" },
  teal:    { bg: "bg-teal-500/10",    border: "border-teal-500/30",    ring: "ring-teal-500",    text: "text-teal-400",    iconBg: "bg-teal-500/20" },
  blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/30",    ring: "ring-blue-500",    text: "text-blue-400",    iconBg: "bg-blue-500/20" },
  violet:  { bg: "bg-violet-500/10",  border: "border-violet-500/30",  ring: "ring-violet-500",  text: "text-violet-400",  iconBg: "bg-violet-500/20" },
  amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/30",   ring: "ring-amber-500",   text: "text-amber-400",   iconBg: "bg-amber-500/20" },
  rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/30",    ring: "ring-rose-500",    text: "text-rose-400",    iconBg: "bg-rose-500/20" },
};

const presetTeamSets: Record<string, string[]> = {
  "4 Teams": ["Team Alpha", "Team Bravo", "Team Charlie", "Team Delta"],
  "6 Teams": ["Team Alpha", "Team Bravo", "Team Charlie", "Team Delta", "Team Echo", "Team Foxtrot"],
  "8 Teams": ["Team Alpha", "Team Bravo", "Team Charlie", "Team Delta", "Team Echo", "Team Foxtrot", "Team Golf", "Team Hotel"],
  "16 Teams": Array.from({ length: 16 }, (_, i) => `Team ${i + 1}`),
};

export default function CreateTournamentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [format, setFormat] = useState("");
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [newTeam, setNewTeam] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedFormat = formats.find((f) => f.id === format);
  const minTeams = selectedFormat?.minTeams ?? 2;

  const addTeam = () => {
    const trimmed = newTeam.trim();
    if (!trimmed) return;
    if (teams.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }
    setTeams((prev) => [...prev, { id: crypto.randomUUID(), name: trimmed }]);
    setNewTeam("");
    inputRef.current?.focus();
  };

  const removeTeam = (id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  };

  const applyPreset = (key: string) => {
    const presetNames = presetTeamSets[key];
    setTeams(presetNames.map((n) => ({ id: crypto.randomUUID(), name: n })));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTeam();
    }
  };

  const canProceedStep1 = name.trim().length > 0;
  const canProceedStep2 = format.length > 0;
  const canSubmit = teams.length >= minTeams;

  const handleSubmit = () => {
    if (!canSubmit || !name.trim() || !format) return;

    const tournament = {
      id: crypto.randomUUID(),
      name: name.trim(),
      format,
      teams: teams.map((t) => ({
        id: t.id,
        name: t.name,
        shortCode: t.name.slice(0, 3).toUpperCase(),
      })),
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("tournaments") || "[]");
    existing.push(tournament);
    localStorage.setItem("tournaments", JSON.stringify(existing));

    router.push(`/tournament/${tournament.id}`);
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
        <Link
          href="/dashboard"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </nav>

      <main className="w-full max-w-2xl mx-auto px-6 py-12">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <motion.div
                animate={{
                  backgroundColor: step >= s ? "#10b981" : "#1e293b",
                  scale: step === s ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border border-slate-700"
                style={{ color: step >= s ? "white" : "#64748b" }}
              >
                {step > s ? "✓" : s}
              </motion.div>
              {s < 3 && (
                <div className="w-16 h-0.5 rounded-full bg-slate-700 overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: "0%" }}
                    animate={{ width: step > s ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ─── STEP 1: Name ─── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <span className="text-4xl mb-4">🏆</span>
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Name Your Tournament
              </h1>
              <p className="text-slate-400 text-sm text-center mb-8">
                Give it a name everyone will remember.
              </p>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canProceedStep1 && setStep(2)}
                placeholder="e.g. Summer Cup 2026"
                autoFocus
                className="w-full max-w-md px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-lg text-center placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />

              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="mt-8 px-10 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold transition-colors"
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* ─── STEP 2: Format ─── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Choose Format
              </h1>
              <p className="text-slate-400 text-sm text-center mb-8">
                Select how your tournament will be structured.
              </p>

              <div className="w-full grid sm:grid-cols-2 gap-3">
                {formats.map((f) => {
                  const c = colorMap[f.color];
                  const selected = format === f.id;
                  return (
                    <motion.button
                      key={f.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormat(f.id)}
                      className={`
                        text-left p-4 rounded-xl border transition-all
                        ${selected
                          ? `${c.bg} ${c.border} ring-2 ${c.ring}`
                          : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`text-2xl w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0`}>
                          {f.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold ${selected ? c.text : "text-white"}`}>
                            {f.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {f.desc}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="px-10 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold transition-colors"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: Teams ─── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                Add Teams
              </h1>
              <p className="text-slate-400 text-sm text-center mb-2">
                Minimum {minTeams} teams required for {selectedFormat?.name}.
              </p>
              <p className="text-emerald-400 text-sm font-semibold mb-6">
                {teams.length} team{teams.length !== 1 ? "s" : ""} added
              </p>

              {/* Quick presets */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {Object.keys(presetTeamSets).map((key) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
                  >
                    Quick: {key}
                  </button>
                ))}
              </div>

              {/* Add team input */}
              <div className="w-full flex gap-2 mb-5">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type team name & press Enter"
                  autoFocus
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <button
                  onClick={addTeam}
                  disabled={!newTeam.trim()}
                  className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold transition-colors shrink-0"
                >
                  + Add
                </button>
              </div>

              {/* Teams list */}
              <div className="w-full max-h-72 overflow-y-auto rounded-xl border border-slate-700 bg-slate-800/40 mb-6">
                {teams.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No teams yet. Type a name above or use a quick preset.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/50">
                    <AnimatePresence>
                      {teams.map((team, idx) => (
                        <motion.div
                          key={team.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between px-4 py-3 group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-white font-medium">{team.name}</span>
                            <span className="text-[10px] text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded font-mono">
                              {team.name.slice(0, 3).toUpperCase()}
                            </span>
                          </div>
                          <button
                            onClick={() => removeTeam(team.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg"
                            title="Remove team"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex-1 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-base transition-colors"
                >
                  {canSubmit
                    ? `🚀 Create Tournament with ${teams.length} Teams`
                    : `Add ${minTeams - teams.length} more team${minTeams - teams.length !== 1 ? "s" : ""}`}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
