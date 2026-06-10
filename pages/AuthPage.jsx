import React, { useState } from "react";
import { Eye, EyeOff, LogIn, AlertCircle, Shield, Zap, Star } from "lucide-react";
import FloatingOrbs from "../components/embassy/FloatingOrbs";
import EmbassyLogo from "../components/embassy/EmbassyLogo";

// ─── Registered Users with Login Credentials ─────────────────────────────────
const USERS = [
  {
    id: "admin",
    role: "admin",
    name: "Arjun Mehta",
    username: "admin@embassy1948.in",
    password: "Embassy@Admin#1948",
    designation: "Administrator",
    icon: Shield,
    gradient: "linear-gradient(135deg, #8B1A1A 0%, #5C1111 100%)",
    badge: "FULL ACCESS",
    badgeColor: "#8B1A1A",
  },
  {
    id: "sales",
    role: "sales",
    name: "Ravi Kumar",
    username: "ravi@embassy1948.in",
    password: "Sales@Ravi#2024",
    designation: "Sales Manager",
    icon: Zap,
    gradient: "linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 100%)",
    badge: "SALES OPS",
    badgeColor: "#4F46E5",
  },
  {
    id: "customer",
    role: "customer",
    name: "Rajesh Sharma",
    username: "rajesh@sharmagroup.in",
    password: "Client@Rajesh#VIP",
    designation: "Valued Client — VIP",
    icon: Star,
    gradient: "linear-gradient(135deg, #A88B3A 0%, #7A6428 100%)",
    badge: "CLIENT VIP",
    badgeColor: "#C9A84C",
  },
];

export default function AuthPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreds, setShowCreds] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() &&
          u.password === password
      );
      if (user) {
        onLogin(user.role);
      } else {
        setError("Invalid credentials. Please check your username and password.");
      }
      setLoading(false);
    }, 800);
  };

  const quickFill = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setError("");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F2E8D8 40%, #FAF7F2 100%)" }}
    >
      <FloatingOrbs />
      <div className="absolute inset-0 texture-overlay opacity-60 pointer-events-none z-0" />
      <div
        className="absolute top-0 left-0 right-0 h-0.5 z-10"
        style={{ background: "linear-gradient(90deg, transparent, #C9A84C 30%, #8B1A1A 70%, transparent)" }}
      />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <EmbassyLogo size="lg" variant="dark" />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-[hsl(var(--border))] p-8 luxury-shadow-lg">
          <h2 className="font-playfair font-bold text-2xl text-ink text-center mb-1">Welcome Back</h2>
          <p className="text-xs font-manrope text-muted-foreground text-center mb-7">
            Sign in to your Embassy account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-manrope font-semibold text-muted-foreground mb-1.5 tracking-wide">
                Email / Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="your@email.in"
                className="w-full px-4 py-3 rounded-xl text-sm font-manrope border focus:outline-none transition-all"
                style={{
                  borderColor: error ? "rgba(220,38,38,0.4)" : "hsl(var(--border))",
                  background: "rgba(250,247,242,0.6)",
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-manrope font-semibold text-muted-foreground mb-1.5 tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm font-manrope border focus:outline-none transition-all"
                  style={{
                    borderColor: error ? "rgba(220,38,38,0.4)" : "hsl(var(--border))",
                    background: "rgba(250,247,242,0.6)",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink transition-colors p-1"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#dc2626" }} />
                <p className="text-xs font-manrope" style={{ color: "#dc2626" }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-manrope font-bold text-white transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading
                  ? "rgba(139,26,26,0.5)"
                  : "linear-gradient(135deg, #8B1A1A 0%, #6B1414 100%)",
                boxShadow: loading ? "none" : "0 4px 16px rgba(139,26,26,0.3)",
              }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In to Embassy
                </>
              )}
            </button>
          </form>
        </div>

        {/* Credentials Panel */}
        <div className="mt-4">
          <button
            onClick={() => setShowCreds((s) => !s)}
            className="w-full text-center text-xs font-manrope font-semibold py-2.5 rounded-xl transition-all"
            style={{
              color: "#C9A84C",
              background: "rgba(201,168,76,0.06)",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            {showCreds ? "▲  Hide Login Credentials" : "▼  View All Login Credentials"}
          </button>

          {showCreds && (
            <div className="mt-3 space-y-3">
              {USERS.map((user) => {
                const Icon = user.icon;
                return (
                  <button
                    key={user.id}
                    onClick={() => quickFill(user)}
                    className="w-full text-left bg-white rounded-2xl border border-[hsl(var(--border))] p-4 luxury-shadow hover:-translate-y-0.5 transition-transform"
                  >
                    {/* User header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: user.gradient }}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-manrope font-bold text-ink">{user.name}</p>
                        <p className="text-[10px] font-manrope text-muted-foreground">{user.designation}</p>
                      </div>
                      <span
                        className="ml-auto text-[9px] font-manrope font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: `${user.badgeColor}15`,
                          color: user.badgeColor,
                          border: `1px solid ${user.badgeColor}30`,
                        }}
                      >
                        {user.badge}
                      </span>
                    </div>

                    {/* Credentials */}
                    <div className="space-y-1.5 text-[11px] font-manrope">
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: "rgba(250,247,242,0.9)" }}
                      >
                        <span className="text-muted-foreground w-16 flex-shrink-0">Username</span>
                        <span className="font-semibold text-ink truncate">{user.username}</span>
                      </div>
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: "rgba(250,247,242,0.9)" }}
                      >
                        <span className="text-muted-foreground w-16 flex-shrink-0">Password</span>
                        <span className="font-semibold text-ink font-mono tracking-wide">{user.password}</span>
                      </div>
                    </div>
                    <p className="text-[9px] font-manrope text-muted-foreground text-center mt-2 opacity-60">
                      ↑ Click to auto-fill credentials
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-center text-[10px] font-manrope text-muted-foreground mt-6">
          © 2026 The Embassy Catering · Heritage · Excellence · Innovation
        </p>
      </div>
    </div>
  );
}