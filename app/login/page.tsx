"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogoIcon } from "../components/icons";
import { KBUser } from "../components/UserNav";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showGooglePicker, setShowGooglePicker] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Criteria checks for signup
  const isLengthValid = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isSignupValid = email.includes("@") && isLengthValid && hasNumber && passwordsMatch;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email or Gmail address.");
      return;
    }

    const accounts = JSON.parse(localStorage.getItem("kb_accounts") || "{}");

    if (tab === "signup") {
      if (!isLengthValid) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (!hasNumber) {
        setError("Password must contain at least one number.");
        return;
      }
      if (!passwordsMatch) {
        setError("Passwords do not match.");
        return;
      }

      const finalName = name.trim() || email.split("@")[0];
      accounts[email.trim().toLowerCase()] = { password, name: finalName };
      localStorage.setItem("kb_accounts", JSON.stringify(accounts));

      const newUser: KBUser = {
        email: email.trim().toLowerCase(),
        name: finalName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email.trim().toLowerCase())}`,
      };
      localStorage.setItem("kb_current_user", JSON.stringify(newUser));
      router.push("/dashboard");
    } else {
      // Sign in mode
      const acc = accounts[email.trim().toLowerCase()];
      if (acc && acc.password && acc.password !== password) {
        setError("Incorrect password. Please try again or sign in with Google.");
        return;
      }

      const finalName = acc?.name || email.split("@")[0];
      const newUser: KBUser = {
        email: email.trim().toLowerCase(),
        name: finalName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email.trim().toLowerCase())}`,
      };
      localStorage.setItem("kb_current_user", JSON.stringify(newUser));
      router.push("/dashboard");
    }
  };

  const handleQuickGoogle = (quickEmail: string, quickName: string) => {
    const newUser: KBUser = {
      email: quickEmail,
      name: quickName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(quickEmail)}`,
    };
    localStorage.setItem("kb_current_user", JSON.stringify(newUser));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e14] text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/[0.04] blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-4 border-b border-white/5 backdrop-blur-md flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoIcon size={34} />
          <span className="text-lg font-bold text-white tracking-tight">
            Kick<span className="text-emerald-400">Bracket</span>
          </span>
        </Link>
        <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 my-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f141c]/90 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl backdrop-blur-xl"
        >
          {/* Title Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-white mb-1">Welcome Back</h1>
            <p className="text-xs text-slate-400">Sign in to manage brackets and synchronize live scores</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/5 mb-6">
            <button
              type="button"
              onClick={() => { setTab("signin"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tab === "signin" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab("signup"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tab === "signup" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-400 hover:text-white"}`}
            >
              Create Account
            </button>
          </div>

          {/* Google Sign In Section */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowGooglePicker(!showGooglePicker)}
              className="w-full py-3 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              {showGooglePicker ? "Close Google Options ✕" : "Continue with Google / Gmail"}
            </button>

            {/* Google Picker Expansion */}
            <AnimatePresence>
              {showGooglePicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-white/10"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Pick a quick test account:</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { email: "organizer.pro@gmail.com", name: "Pro Organizer" },
                      { email: "alex.manager@gmail.com", name: "Alex Manager" },
                      { email: "pro.referee@gmail.com", name: "Pro Referee" },
                    ].map((g) => (
                      <button
                        key={g.email}
                        type="button"
                        onClick={() => handleQuickGoogle(g.email, g.name)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 text-xs text-left transition-all group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(g.email)}`} alt="" className="w-6 h-6 rounded-full bg-slate-800 shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-white text-[11px] group-hover:text-emerald-400">{g.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{g.email}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">1-Click ➔</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">OR WITH EMAIL</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="flex flex-col gap-3.5">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Organizer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email / Gmail Address</label>
              <input
                type="email"
                required
                placeholder="e.g. organizer.pro@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {tab === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm your password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />

                {/* Password Criteria Checklist */}
                <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Password Criteria:</span>
                  <div className={`text-[11px] flex items-center gap-2 ${isLengthValid ? "text-emerald-400" : "text-slate-500"}`}>
                    <span>{isLengthValid ? "✓" : "○"}</span>
                    <span>At least 6 characters</span>
                  </div>
                  <div className={`text-[11px] flex items-center gap-2 ${hasNumber ? "text-emerald-400" : "text-slate-500"}`}>
                    <span>{hasNumber ? "✓" : "○"}</span>
                    <span>Contains at least one number</span>
                  </div>
                  <div className={`text-[11px] flex items-center gap-2 ${passwordsMatch ? "text-emerald-400" : "text-slate-500"}`}>
                    <span>{passwordsMatch ? "✓" : "○"}</span>
                    <span>Passwords match</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={tab === "signup" && !isSignupValid}
              className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {tab === "signin" ? "Sign In to Account ➔" : "Create Account & Continue ➔"}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
