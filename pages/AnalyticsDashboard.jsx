import React, { useState, useEffect } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart
} from "recharts";
import { TrendingUp, Users, Target, IndianRupee, Award, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import AnimatedCounter from "../components/embassy/ui/AnimatedCounter";
import { revenueMonthly, salesTeam, funnelData, eventCategories, leadSourcesOverTime } from "../components/embassy/data";

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-card rounded-xl px-4 py-3 border border-[hsl(var(--border))] shadow-luxury">
      <p className="text-xs font-manrope font-bold text-ink dark:text-white mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs font-manrope text-muted-foreground">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.stroke }} />
          <span>{p.name}: {p.value > 10000 ? `₹${(p.value / 100000).toFixed(1)}L` : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const kpis = [
  { label: "Total Revenue",  value: "₹48.3L",  icon: IndianRupee, color: "#C9A84C" },
  { label: "Total Leads",    value: "312",       icon: Users,       color: "#8B1A1A" },
  { label: "Conversion",     value: "68.4%",     icon: Target,      color: "#276749" },
  { label: "Avg Deal Size",  value: "₹4.6L",    icon: TrendingUp,  color: "#2563EB" },
  { label: "Team Rating",    value: "4.5★",      icon: Award,       color: "#C9A84C" },
];

function Funnel() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 400); return () => clearTimeout(t); }, []);
  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
      <h3 className="font-playfair font-bold text-ink dark:text-white text-base mb-5">Conversion Funnel</h3>
      <div className="space-y-2 px-4">
        {funnelData.map((stage, i) => {
          const convPct = i > 0 ? Math.round((stage.count / funnelData[i - 1].count) * 100) : 100;
          return (
            <div key={stage.stage}>
              <div
                className="funnel-stage relative mx-auto rounded-xl overflow-hidden h-12 flex items-center justify-between px-4 cursor-default"
                style={{
                  width: show ? `${stage.pct}%` : "0%",
                  minWidth: show ? 80 : 0,
                  background: `linear-gradient(135deg, ${stage.color} 0%, ${stage.color}CC 100%)`,
                  transition: `all 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 120}ms`,
                  opacity: show ? 1 : 0,
                }}
              >
                <span className="text-white font-manrope font-bold text-xs">{stage.stage}</span>
                <span className="text-white font-manrope text-xs font-bold">{stage.count}</span>
              </div>
              {i < funnelData.length - 1 && (
                <div className="text-center py-1">
                  <span className="text-[10px] font-manrope font-semibold" style={{ color: "#C9A84C" }}>
                    {convPct}% →
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeamTable() {
  const [sort, setSort] = useState("revenue");
  const [dir, setDir] = useState(-1);
  const sorted = [...salesTeam].sort((a, b) => (a[sort] - b[sort]) * dir);
  const handleSort = (key) => { if (sort === key) setDir(d => -d); else { setSort(key); setDir(-1); } };

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] overflow-hidden luxury-shadow">
      <div className="px-6 py-4 border-b border-[hsl(var(--border))]">
        <h3 className="font-playfair font-bold text-ink dark:text-white text-base">Team Performance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/20">
              {[
                { key: "name", label: "Sales Person" },
                { key: "leads", label: "Leads" },
                { key: "converted", label: "Converted" },
                { key: "revenue", label: "Revenue" },
                { key: "target", label: "Target %" },
                { key: "rating", label: "Rating" },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="text-left px-4 py-2.5 text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-[0.08em] cursor-pointer hover:text-ink dark:hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sort === col.key
                      ? dir === -1 ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
                      : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p.id} className="table-row-hover border-t border-[hsl(var(--border))]/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold font-manrope flex-shrink-0" style={{ background: p.color }}>
                      {p.initials}
                    </div>
                    <span className="text-xs font-manrope font-semibold text-ink dark:text-white">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-manrope text-muted-foreground">{p.leads}</td>
                <td className="px-4 py-3 text-xs font-manrope text-muted-foreground">{p.converted}</td>
                <td className="px-4 py-3 text-xs font-manrope font-bold" style={{ color: "#C9A84C" }}>
                  ₹{(p.revenue / 100000).toFixed(0)}L
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[hsl(var(--border))] rounded-full overflow-hidden max-w-[80px]">
                      <div className="h-full progress-luxury transition-all duration-1000 delay-200" style={{ width: `${p.target}%` }} />
                    </div>
                    <span className="text-[10px] font-manrope text-muted-foreground whitespace-nowrap">{p.target}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-gold text-xs">{"★".repeat(Math.floor(p.rating))}</span>
                    <span className="text-[10px] font-manrope font-bold text-ink dark:text-white">{p.rating}</span>
                    <span className={`text-[9px] font-manrope font-bold ml-1 ${p.trend > 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {p.trend > 0 ? "+" : ""}{p.trend}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      {/* KPI Strip */}
      <div className="flex gap-3 mb-7 overflow-x-auto pb-1">
        {kpis.map(k => (
          <div
            key={k.label}
            className="flex items-center gap-3 bg-white dark:bg-card rounded-full px-5 py-2.5 border border-[hsl(var(--border))] flex-shrink-0 luxury-shadow"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${k.color}12` }}>
              <k.icon className="w-4 h-4 flex-shrink-0" style={{ color: k.color, width: 16, height: 16 }} />
            </div>
            <div>
              <p className="text-[9px] font-manrope font-semibold text-muted-foreground uppercase tracking-wider leading-none">{k.label}</p>
              <p className="text-sm font-playfair font-bold text-ink dark:text-white mt-0.5 leading-none">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white text-base mb-4">Revenue vs Target</h3>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={revenueMonthly}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B1A1A" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#5C1111" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} tickFormatter={v => `${v/100000}L`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="revenue" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name="Revenue" animationDuration={1600} />
              <Line type="monotone" dataKey="target" stroke="#C9A84C" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Target" animationDuration={1800} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white text-base mb-4">Year-over-Year</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueMonthly}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} tickFormatter={v => `${v/100000}L`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="revenue" fill="#8B1A1A" radius={[3, 3, 0, 0]} name="This Year" animationDuration={1600} />
              <Bar dataKey="lastYear" fill="#E5E5E5" radius={[3, 3, 0, 0]} name="Last Year" animationDuration={1600} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "Manrope" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funnel */}
      <div className="mb-7"><Funnel /></div>

      {/* Team */}
      <div className="mb-7"><TeamTable /></div>

      {/* Source charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white text-base mb-4">Lead Sources Over Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={leadSourcesOverTime}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="referral"  stackId="a" fill="#8B1A1A" name="Referral" animationDuration={1400} />
              <Bar dataKey="social"    stackId="a" fill="#C9A84C" name="Social" animationDuration={1400} />
              <Bar dataKey="corporate" stackId="a" fill="#2D3748" name="Corporate" animationDuration={1400} />
              <Bar dataKey="walkin"    stackId="a" fill="#9CA3AF" name="Walk-in" radius={[3, 3, 0, 0]} animationDuration={1400} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "Manrope" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white text-base mb-4">Event Categories</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={eventCategories}>
              <PolarGrid stroke="rgba(0,0,0,0.07)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "Manrope" }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} />
              <Radar name="Events" dataKey="A" stroke="#8B1A1A" fill="#8B1A1A" fillOpacity={0.18} animationDuration={1600} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}