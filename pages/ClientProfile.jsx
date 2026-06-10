import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Users, Calendar, IndianRupee, Building2, Star, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import AnimatedCounter from "../components/embassy/ui/AnimatedCounter";
import StatusBadge from "../components/embassy/ui/StatusBadge";
import { clientProfile } from "../components/embassy/data";

export default function ClientProfile() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);
  const client = clientProfile;

  const vipGradient = "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #A88B3A 100%)";

  return (
    <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      {/* Hero */}
      <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-8 mb-6 luxury-shadow relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-5" style={{ background: "#C9A84C" }} />
        </div>
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-playfair font-bold"
              style={{ background: "linear-gradient(135deg, #8B1A1A, #5C1111)" }}
            >
              {client.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-manrope font-bold" style={{ background: vipGradient, color: "#fff" }}>
              VIP
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-playfair text-3xl font-bold text-ink dark:text-white">{client.name}</h2>
            <p className="text-sm font-manrope text-muted-foreground mt-0.5">{client.company}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
              <StatusBadge status={client.tag.toLowerCase()} size="md" />
              <div className="flex items-center gap-1.5 bg-gold/10 px-3 py-1 rounded-full">
                <IndianRupee className="w-3.5 h-3.5 text-gold" />
                <span className="font-manrope font-bold text-sm" style={{ color: "#C9A84C" }}>
                  ₹{(client.totalSpend / 100000).toFixed(0)}L Total Spend
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-muted/30 px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-gold" />
                <span className="text-xs font-manrope font-bold text-ink dark:text-white">NPS {client.nps}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Events",    val: client.totalEvents,                    suffix: "",  prefix: "",   icon: Calendar },
          { label: "Total Spend",     val: client.totalSpend / 100000,             suffix: "L", prefix: "₹",  icon: IndianRupee, decimals: 0 },
          { label: "Last Event",      val: client.lastEvent,   isText: true,                                 icon: Star },
          { label: "Referrals Given", val: client.referralsGiven,                 suffix: "",  prefix: "",   icon: Users },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-5 text-center luxury-shadow">
            <s.icon className="w-5 h-5 mx-auto mb-2 text-gold" style={{ width: 20, height: 20, color: "#C9A84C" }} />
            <p className="text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            {s.isText
              ? <p className="font-playfair font-bold text-lg text-ink dark:text-white">{s.val}</p>
              : <p className="font-playfair font-bold text-xl text-ink dark:text-white">
                  <AnimatedCounter end={s.val} prefix={s.prefix || ""} suffix={s.suffix || ""} decimals={s.decimals || 0} />
                </p>
            }
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Contact */}
        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white text-base mb-5">Contact Details</h3>
          <div className="space-y-3.5">
            {[
              { icon: Phone,      label: "Phone",       val: client.phone },
              { icon: Mail,       label: "Email",       val: client.email },
              { icon: MapPin,     label: "Address",     val: client.address },
              { icon: Building2,  label: "Company",     val: client.company },
              { icon: Users,      label: "Referred By", val: client.referredBy },
              { icon: Calendar,   label: "Client Since",val: client.since },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(139,26,26,0.07)" }}>
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#8B1A1A", width: 14, height: 14 }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-manrope text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-manrope font-medium text-ink dark:text-white mt-0.5 break-words">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white text-base mb-5">Preferences</h3>
          <div className="mb-5">
            <p className="text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Cuisine Preferences</p>
            <div className="flex flex-wrap gap-2">
              {client.cuisinePrefs.map(c => (
                <span key={c} className="text-[11px] font-manrope font-semibold px-2.5 py-1 rounded-full border" style={{ background: "rgba(201,168,76,0.1)", color: "#A88B3A", borderColor: "rgba(201,168,76,0.25)" }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <p className="text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Dietary Restrictions</p>
            <div className="flex flex-wrap gap-2">
              {client.dietary.map(d => (
                <span key={d} className="text-[11px] font-manrope font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(139,26,26,0.08)", color: "#8B1A1A" }}>
                  {d}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-wider mb-2">Special Notes</p>
            <p className="text-xs font-manrope text-ink dark:text-white leading-relaxed p-3 rounded-xl" style={{ background: "rgba(250,247,242,0.8)" }}>
              {client.specialNotes}
            </p>
          </div>
        </div>

        {/* Referral network */}
        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white text-base mb-4">Referral Network</h3>
          <div className="flex justify-center py-4">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="32" fill="#8B1A1A" />
              <text x="100" y="96" textAnchor="middle" fill="white" fontSize="9" fontFamily="Playfair Display" fontWeight="bold">
                {client.name.split(" ")[0]}
              </text>
              <text x="100" y="109" textAnchor="middle" fill="white" fontSize="9" fontFamily="Playfair Display" fontWeight="bold">
                {client.name.split(" ")[1]}
              </text>
              {client.referrals.map((ref, i) => {
                const angle = (i / client.referrals.length) * Math.PI * 2 - Math.PI / 2;
                const x = 100 + Math.cos(angle) * 72;
                const y = 100 + Math.sin(angle) * 72;
                return (
                  <g key={ref}>
                    <line x1="100" y1="100" x2={x} y2={y} stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="4 3" opacity={0.6} />
                    <circle cx={x} cy={y} r="22" fill="white" stroke="#C9A84C" strokeWidth="1.5" />
                    <text x={x} y={y + 4} textAnchor="middle" fill="#1A1A1A" fontSize="8" fontFamily="Manrope" fontWeight="600">
                      {ref.split(" ").map(n => n[0]).join("")}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="space-y-2 mt-2">
            {client.referrals.map(r => (
              <div key={r} className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-manrope flex-shrink-0" style={{ background: "rgba(201,168,76,0.15)", color: "#A88B3A" }}>
                  {r.split(" ").map(n => n[0]).join("")}
                </div>
                <span className="text-xs font-manrope text-ink dark:text-white">{r}</span>
                <span className="ml-auto text-[9px] font-manrope text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">Referral</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spend chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white text-base mb-4">Spending by Year</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={client.spendByYear}>
              <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: "Manrope", fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: "Manrope", fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/100000}L`} />
              <Tooltip formatter={v => `₹${(v/100000).toFixed(1)}L`} contentStyle={{ borderRadius: 10, fontSize: 12, fontFamily: "Manrope", border: "1px solid rgba(201,168,76,0.3)" }} />
              <Bar dataKey="amount" fill="#8B1A1A" radius={[5, 5, 0, 0]} animationDuration={1400} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Event history */}
        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] overflow-hidden luxury-shadow">
          <div className="px-6 py-4 border-b border-[hsl(var(--border))]">
            <h3 className="font-playfair font-bold text-ink dark:text-white text-base">Event History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/20">
                  {["Event","Date","Guests","Amount","Status"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-[0.08em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {client.events.map((ev, i) => (
                  <tr key={i} className="table-row-hover border-t border-[hsl(var(--border))]/40">
                    <td className="px-4 py-2.5 text-xs font-manrope font-semibold text-ink dark:text-white">{ev.event}</td>
                    <td className="px-4 py-2.5 text-[11px] font-manrope text-muted-foreground whitespace-nowrap">
                      {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-2.5 text-[11px] font-manrope text-muted-foreground">{ev.guests}</td>
                    <td className="px-4 py-2.5 text-[11px] font-manrope font-bold" style={{ color: "#C9A84C" }}>₹{(ev.amount / 100000).toFixed(1)}L</td>
                    <td className="px-4 py-2.5"><StatusBadge status={ev.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}