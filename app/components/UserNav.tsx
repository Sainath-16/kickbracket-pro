"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type KBUser = {
  email: string;
  name: string;
  avatar: string;
};

export function UserNav({ onUserChange }: { onUserChange?: (user: KBUser | null) => void }) {
  const [user, setUser] = useState<KBUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"choose" | "google">("choose");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid Gmail or email address.");
      return;
    }
    const finalName = name.trim() || email.split("@")[0];
    const newUser: KBUser = {
      email: email.trim().toLowerCase(),
      name: finalName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email.trim().toLowerCase())}`,
    };
    localStorage.setItem("kb_current_user", JSON.stringify(newUser));
    setUser(newUser);
    if (onUserChange) onUserChange(newUser);
    setShowModal(false);
    setEmail("");
    setName("");
    setError("");
  };

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
        <button
          onClick={() => { setStep("choose"); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          Sign In / Gmail
        </button>
      )}

      {/* Auth Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1117] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm"
              >
                ✕
              </button>

              {step === "choose" ? (
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <svg className="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Welcome to KickBracket</h3>
                  <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                    Sign in to manage your private tournaments, synchronize scores across devices, and unlock organizer tools.
                  </p>

                  <button
                    onClick={() => setStep("google")}
                    className="w-full py-3 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-md active:scale-[0.98] mb-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Continue with Gmail / Google
                  </button>
                  <p className="text-[10px] text-slate-500 mt-4">Fast, frictionless client-side authentication.</p>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <button type="button" onClick={() => setStep("choose")} className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
                      ← Back
                    </button>
                  </div>
                  <div className="flex justify-center mb-4">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white text-center mb-1">Sign in with Google</h3>
                  <p className="text-slate-400 text-xs text-center mb-6">to continue to KickBracket Pro</p>

                  {error && <p className="text-red-400 text-xs bg-red-500/10 p-2.5 rounded-lg mb-4 border border-red-500/20">{error}</p>}

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Gmail / Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex.organizer@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    Next
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
