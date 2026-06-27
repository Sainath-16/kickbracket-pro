"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export type KBUser = {
  email: string;
  name: string;
  avatar: string;
};

export function UserNav({ onUserChange }: { onUserChange?: (user: KBUser | null) => void }) {
  const [user, setUser] = useState<KBUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("kb_current_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        if (onUserChange) onUserChange(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kb_current_user");
    setUser(null);
    if (onUserChange) onUserChange(null);
  };

  return (
    <>
      {user ? (
        <div className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-full transition-all shadow-sm">
          <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full bg-slate-700 shrink-0" />
          <div className="flex flex-col text-left mr-1">
            <span className="text-xs font-bold text-white truncate max-w-[110px] leading-tight">{user.name}</span>
            <span className="text-[10px] text-slate-400 truncate max-w-[110px] leading-tight">{user.email}</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-400 font-semibold transition-colors px-1">
            Sign Out
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          Sign In
        </Link>
      )}
    </>
  );
}
