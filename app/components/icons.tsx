"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

/* ── Wrapper for consistent icon animation ── */
function AnimatedIcon({
  children,
  className = "",
  pulse = false,
}: {
  children: ReactNode;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.1, rotate: 3 }}
      whileTap={{ scale: 0.95 }}
      animate={pulse ? { scale: [1, 1.05, 1] } : undefined}
      transition={
        pulse
          ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
          : { type: "spring", stiffness: 300 }
      }
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   BRAND LOGO
   ────────────────────────────────────────────── */
export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      whileHover={{ rotate: 12 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06d6a0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />
      <path
        d="M20 8L12 24h6v8l8-16h-6V8z"
        fill="white"
        fillOpacity="0.95"
      />
    </motion.svg>
  );
}

/* ──────────────────────────────────────────────
   LANDING PAGE FEATURE ICONS
   ────────────────────────────────────────────── */

export function FixturesIcon() {
  return (
    <AnimatedIcon className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#fixtGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="fixtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06d6a0" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <path d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" />
      </svg>
    </AnimatedIcon>
  );
}

export function StandingsIcon() {
  return (
    <AnimatedIcon className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#standGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="standGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    </AnimatedIcon>
  );
}

export function AnalyticsIcon() {
  return (
    <AnimatedIcon className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#analyGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="analyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 2 5-6" />
        <circle cx="20" cy="8" r="1.5" fill="#a78bfa" stroke="none" />
      </svg>
    </AnimatedIcon>
  );
}

export function ShareIcon() {
  return (
    <AnimatedIcon className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#shareGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="shareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
      </svg>
    </AnimatedIcon>
  );
}

export function LiveIcon() {
  return (
    <AnimatedIcon className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center" pulse>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#liveGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="liveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </AnimatedIcon>
  );
}

export function SimpleIcon() {
  return (
    <AnimatedIcon className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#simpGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="simpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </AnimatedIcon>
  );
}

/* ──────────────────────────────────────────────
   TOURNAMENT FORMAT ICONS (Create Wizard)
   ────────────────────────────────────────────── */

export function RoundRobinIcon({ active = false }: { active?: boolean }) {
  return (
    <motion.div
      animate={active ? { rotate: 360 } : { rotate: 0 }}
      transition={{ duration: 8, repeat: active ? Infinity : 0, ease: "linear" }}
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-emerald-500/20" : "bg-slate-700/50"}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#64748b"} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 019 9" />
        <polygon points="21,12 18,10 18,14" fill={active ? "#10b981" : "#64748b"} stroke="none" />
      </svg>
    </motion.div>
  );
}

export function DoubleRRIcon({ active = false }: { active?: boolean }) {
  return (
    <motion.div
      animate={active ? { rotate: [0, 360] } : {}}
      transition={{ duration: 6, repeat: active ? Infinity : 0, ease: "linear" }}
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-teal-500/20" : "bg-slate-700/50"}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#14b8a6" : "#64748b"} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" strokeDasharray="3 2" />
      </svg>
    </motion.div>
  );
}

export function SingleElimIcon({ active = false }: { active?: boolean }) {
  return (
    <motion.div
      animate={active ? { y: [0, -2, 0] } : {}}
      transition={{ duration: 1.5, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-blue-500/20" : "bg-slate-700/50"}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#3b82f6" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4v4h4M20 4v4h-4M4 20v-4h4M20 20v-4h-4" />
        <path d="M8 4h2v4h4v4h-4v4H8" />
        <path d="M16 4h-2v4h-4v4h4v4h2" />
      </svg>
    </motion.div>
  );
}

export function DoubleElimIcon({ active = false }: { active?: boolean }) {
  return (
    <motion.div
      animate={active ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-violet-500/20" : "bg-slate-700/50"}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#8b5cf6" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
        <path d="M12 22V12" />
        <path d="M20 7L12 12 4 7" />
      </svg>
    </motion.div>
  );
}

export function SwissIcon({ active = false }: { active?: boolean }) {
  return (
    <motion.div
      animate={active ? { rotateY: [0, 180, 360] } : {}}
      transition={{ duration: 4, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      style={{ perspective: 100 }}
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-amber-500/20" : "bg-slate-700/50"}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#f59e0b" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M12 3v18M3 12h18" />
        <circle cx="7.5" cy="7.5" r="1.5" fill={active ? "#f59e0b" : "#64748b"} stroke="none" />
        <circle cx="16.5" cy="16.5" r="1.5" fill={active ? "#f59e0b" : "#64748b"} stroke="none" />
      </svg>
    </motion.div>
  );
}

export function GroupKnockoutIcon({ active = false }: { active?: boolean }) {
  return (
    <motion.div
      animate={active ? { rotate: [0, 5, -5, 0] } : {}}
      transition={{ duration: 2, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-rose-500/20" : "bg-slate-700/50"}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#f43f5e" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 8 12 8s5-4 7.5-4a2.5 2.5 0 010 5H18" />
        <path d="M6 9v5.5A6.5 6.5 0 0012 21v0a6.5 6.5 0 006-6.5V9" />
        <path d="M6 9h12" />
      </svg>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   DASHBOARD / UI ICONS
   ────────────────────────────────────────────── */

export function TrophyIcon({ size = 48, animate = false }: { size?: number; animate?: boolean }) {
  return (
    <motion.div
      animate={animate ? { y: [0, -4, 0], scale: [1, 1.05, 1] } : undefined}
      transition={animate ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="trophyGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <path d="M14 10H10a4 4 0 00-4 4v2a6 6 0 006 6h2" stroke="url(#trophyGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M34 10h4a4 4 0 014 4v2a6 6 0 01-6 6h-2" stroke="url(#trophyGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M14 6h20v16a10 10 0 01-10 10v0a10 10 0 01-10-10V6z" stroke="url(#trophyGrad)" strokeWidth="2.5" fill="rgba(251, 191, 36, 0.1)" />
        <path d="M20 32v4M28 32v4" stroke="url(#trophyGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="16" y="36" width="16" height="4" rx="2" stroke="url(#trophyGrad)" strokeWidth="2.5" fill="rgba(251, 191, 36, 0.1)" />
        <path d="M20 14l2 3 3-1-1 3 3 1-3 2 1 3-3-1-2 3-2-3-3 1 1-3-3-1 3-2-1-3 3 1z" fill="#fbbf24" fillOpacity="0.6" />
      </svg>
    </motion.div>
  );
}

export function EmptyStateIcon() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center shadow-lg"
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        <rect x="6" y="10" width="28" height="20" rx="3" stroke="url(#emptyGrad)" strokeWidth="2" fill="none" />
        <path d="M6 16h28" stroke="url(#emptyGrad)" strokeWidth="2" />
        <circle cx="20" cy="24" r="3" stroke="url(#emptyGrad)" strokeWidth="2" fill="none" />
        <path d="M20 21v-2M20 29v-2" stroke="url(#emptyGrad)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

export function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M9 3v12M3 9h12" />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 8H3M7 4L3 8l4 4" />
    </svg>
  );
}

export function ShareLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8.5a3 3 0 004.24 0l2-2a3 3 0 00-4.24-4.24l-1 1" />
      <path d="M10 7.5a3 3 0 00-4.24 0l-2 2a3 3 0 004.24 4.24l1-1" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M13 4v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4" />
    </svg>
  );
}

export function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5l4 4 4-4" />
    </svg>
  );
}
