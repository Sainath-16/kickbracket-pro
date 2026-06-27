"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogoIcon, ArrowRightIcon, ArrowLeftIcon, PlusIcon,
  RoundRobinIcon, DoubleRRIcon, SingleElimIcon,
  DoubleElimIcon, SwissIcon, GroupKnockoutIcon, TrashIcon,
} from "../../components/icons";
import { UserNav } from "../../components/UserNav";

type TeamEntry = { id: string; name: string };

const formats = [
  { key: "ROUND_ROBIN", label: "Round Robin", desc: "Every team plays every other team once", icon: RoundRobinIcon, color: "emerald", min: 3 },
  { key: "DOUBLE_ROUND_ROBIN", label: "Double Round Robin", desc: "Home and away — every team meets twice", icon: DoubleRRIcon, color: "teal", min: 3 },
  { key: "SINGLE_ELIMINATION", label: "Single Elimination", desc: "Lose once and you're out — knockout style", icon: SingleElimIcon, color: "blue", min: 2 },
  { key: "DOUBLE_ELIMINATION", label: "Double Elimination", desc: "Second chance — losers bracket included", icon: DoubleElimIcon, color: "violet", min: 4 },
  { key: "SWISS", label: "Swiss System", desc: "Adaptive pairing — balanced competition", icon: SwissIcon, color: "amber", min: 4 },
  { key: "GROUP_KNOCKOUT", label: "Group + Knockout", desc: "Groups then elimination — like the World Cup", icon: GroupKnockoutIcon, color: "rose", min: 4 },
];

const presetTeamSets: Record<string, string[]> = {
  "EPL Top 6": ["Arsenal", "Chelsea", "Liverpool", "Man City", "Man United", "Tottenham"],
  "La Liga Top 4": ["Barcelona", "Real Madrid", "Atl. Madrid", "Real Sociedad"],
  "UCL QFs": ["Real Madrid", "Barcelona", "Bayern Munich", "PSG", "Man City", "Arsenal", "Inter Milan", "Dortmund"],
};

const steps = [
  { num: 1, label: "Details" },
  { num: 2, label: "Format" },
  { num: 3, label: "Teams" },
];

export default function CreateTournamentPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [format, setFormat] = useState("");
  const [teams, setTeams] = useState<TeamEntry[]>([]);
  const [teamInput, setTeamInput] = useState("");

  const formatObj = formats.find((f) => f.key === format);
  const minTeams = formatObj?.min ?? 2;

  const addTeam = () => {
    const n = teamInput.trim();
    if (!n || teams.some((t) => t.name.toLowerCase() === n.toLowerCase())) return;
    setTeams((prev) => [...prev, { id: crypto.randomUUID(), name: n }]);
    setTeamInput("");
    inputRef.current?.focus();
  };

  const removeTeam = (id: string) => setTeams((prev) => prev.filter((t) => t.id !== id));

  const applyPreset = (key: string) => {
    setTeams(presetTeamSets[key].map((n) => ({ id: crypto.randomUUID(), name: n })));
  };

  const canProceedStep1 = name.trim().length > 0;
  const canProceedStep2 = format.length > 0;
  const canSubmit = teams.length >= minTeams;

  const handleSubmit = () => {
    if (!canSubmit || !name.trim() || !format) return;
    const user = JSON.parse(localStorage.getItem("kb_current_user") || "null");
    const tournament = {
      id: crypto.randomUUID(),
      name: name.trim(),
      format,
      teams: teams.map((t) => ({ id: t.id, name: t.name, shortCode: t.name.slice(0, 3).toUpperCase() })),
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      userId: user ? user.email : null,
    };
    const existing = JSON.parse(localStorage.getItem("tournaments") || "[]");
    existing.push(tournament);
    localStorage.setItem("tournaments", JSON.stringify(existing));
    router.push(`/tournament/${tournament.id}`);
  };

  return (
    <>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-emerald-500/[0.03] blur-[120px]" />
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
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-white transition-colors">Dashboard</Link>
            <UserNav />
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full max-w-xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" :
                step > s.num ? "bg-emerald-500/20 text-emerald-400" :
                "bg-white/5 text-slate-600"
              }`}>
                {step > s.num ? <CheckIcon /> : s.num}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${step >= s.num ? "text-white" : "text-slate-600"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`w-10 h-px ${step > s.num ? "bg-emerald-500/40" : "bg-white/5"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: NAME ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">Name your tournament</h2>
                <p className="text-sm text-slate-500">Choose a memorable name for your competition</p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                <label className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Tournament Name</label>
                <input
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Champions League 2025"
                  autoFocus
                  className="w-full py-3 px-4 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-600 text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && canProceedStep1 && setStep(2)}
                />
              </div>
              <button onClick={() => setStep(2)} disabled={!canProceedStep1} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-slate-600 text-white font-bold transition-all disabled:cursor-not-allowed">
                Continue <ArrowRightIcon />
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: FORMAT ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">Choose format</h2>
                <p className="text-sm text-slate-500">Select how matches will be organized</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formats.map((f) => {
                  const active = format === f.key;
                  const Icon = f.icon;
                  return (
                    <button
                      key={f.key}
                      onClick={() => setFormat(f.key)}
                      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                        active ? "bg-white/[0.06] border-emerald-500/40" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                      }`}
                    >
                      <Icon active={active} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${active ? "text-emerald-400" : "text-white"}`}>{f.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{f.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-semibold text-sm transition-all">
                  <ArrowLeftIcon /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!canProceedStep2} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/5 disabled:text-slate-600 text-white font-bold transition-all disabled:cursor-not-allowed">
                  Continue <ArrowRightIcon />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: TEAMS ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">Add your teams</h2>
                <p className="text-sm text-slate-500">Minimum {minTeams} teams required · {teams.length} added</p>
              </div>

              {/* Quick presets */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Quick Add:</span>
                {Object.keys(presetTeamSets).map((key) => (
                  <button key={key} onClick={() => applyPreset(key)} className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-400 hover:text-white font-medium transition-all">
                    {key}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <div className="flex gap-2 mb-4">
                  <input
                    ref={inputRef}
                    value={teamInput} onChange={(e) => setTeamInput(e.target.value)}
                    placeholder="Enter team name..."
                    className="flex-1 py-2.5 px-4 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTeam())}
                  />
                  <button onClick={addTeam} className="px-4 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm hover:bg-emerald-500/30 transition-all">
                    <PlusIcon />
                  </button>
                </div>

                {/* Team list */}
                <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
                  <AnimatePresence>
                    {teams.map((t, i) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 group"
                      >
                        <span className="text-xs text-slate-600 font-bold w-5 text-center">{i + 1}</span>
                        <span className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">{t.name.slice(0, 2).toUpperCase()}</span>
                        <span className="flex-1 text-sm font-medium text-white truncate">{t.name}</span>
                        <button onClick={() => removeTeam(t.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all">
                          <TrashIcon />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {teams.length === 0 && (
                    <p className="text-center text-slate-600 text-xs py-4">No teams added yet. Type above or use quick add.</p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${Math.min((teams.length / minTeams) * 100, 100)}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-semibold text-sm transition-all">
                  <ArrowLeftIcon /> Back
                </button>
                <button onClick={handleSubmit} disabled={!canSubmit} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-bold transition-all disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 disabled:shadow-none">
                  Create Tournament <ArrowRightIcon />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}
