import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  IndianRupee, Users, Calendar, TrendingUp,
  Phone, Mail, CreditCard, Lightbulb, AlertCircle, Star
} from "lucide-react";
import MetricCard3D from "../components/embassy/MetricCard3D";
import StatusBadge from "../components/embassy/ui/StatusBadge";
import FloatingOrbs from "../components/embassy/FloatingOrbs";
import { revenueMonthly, leadSources, upcomingEvents, recentActivities, aiInsights, revenueSparklines } from "../components/embassy/data";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-card rounded-xl px-4 py-3 border border-[hsl(var(--border))] shadow-luxury">
      <p className="text-xs font-manrope font-bold text-ink dark:text-white mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs font-manrope text-muted-foreground">
          <div className="w-2 h-2 rounded-full" style={{ background: p.stroke || p.fill }} />
          <span>₹{(p.value / 100000).toFixed(1)}L</span>
        </div>
      ))}
    </div>
  );
};

const aiIcons = { TrendingUp, AlertCircle, Star };
const aiColors = { prediction: "#276749", alert: "#C9A84C", action: "#8B1A1A" };

const activityConfig = {
  lead:      { icon: Users,        color: "#8B1A1A" },
  proposal:  { icon: Mail,         color: "#2563EB" },
  tasting:   { icon: Calendar,     color: "#C9A84C" },
  payment:   { icon: CreditCard,   color: "#276749" },
  confirmed: { icon: TrendingUp,   color: "#059669" },
  call:      { icon: Phone,        color: "#7C3AED" },
};

export default function OverviewDashboard() {
  const [mounted, setMounted] = useState(false);
  const [timeFilter, setTimeFilter] = useState("1Y");

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const filtered = timeFilter === "3M" ? revenueMonthly.slice(-3)
    : timeFilter === "6M" ? revenueMonthly.slice(-6) : revenueMonthly;

  const cards = [
    { title: "Total Revenue",    value: 4832000, prefix: "₹",  decimals: 0, change: "+18%", changeLabel: " MoM",    sparkData: revenueSparklines.revenue,    sparkColor: "#C9A84C", icon: IndianRupee, delay: 0 },
    { title: "Active Leads",     value: 124,     prefix: "",   decimals: 0, change: "+7",   changeLabel: " this wk", sparkData: revenueSparklines.leads,      sparkColor: "#8B1A1A", icon: Users,       delay: 80 },
    { title: "Events This Month",value: 31,      prefix: "",   decimals: 0, change: "+12%", changeLabel: " vs last", sparkData: revenueSparklines.events,     sparkColor: "#C9A84C", icon: Calendar,    delay: 160 },
    { title: "Conversion Rate",  value: 68.4,    prefix: "",   suffix: "%", decimals: 1,    change: "+4.2%",         sparkData: revenueSparklines.conversion, sparkColor: "#8B1A1A", icon: TrendingUp,  delay: 240, changeLabel: "" },
  ];

  return (
    <div
      className="relative"
      style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
    >
      <FloatingOrbs dense />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7 relative z-10">
        {cards.map((c, i) => (
          <div key={i} className="animate-fade-up" style={{ animationDelay: `${c.delay}ms`, opacity: 0, animationFillMode: "forwards" }}>
            <MetricCard3D {...c} />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-7 relative z-10">
        {/* Revenue chart */}
        <div
          className="lg:col-span-3 bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-playfair font-bold text-ink dark:text-white text-lg">Revenue Overview</h3>
              <p className="text-xs font-manrope text-muted-foreground mt-0.5">Monthly revenue performance</p>
            </div>
            <div className="flex gap-1 bg-ivory dark:bg-muted rounded-full p-1">
              {["3M", "6M", "1Y"].map(f => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className="px-3 py-1 rounded-full text-[11px] font-manrope font-semibold transition-all duration-200"
                  style={{
                    background: timeFilter === f ? "#8B1A1A" : "transparent",
                    color: timeFilter === f ? "#fff" : "var(--muted-foreground)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={filtered} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B1A1A" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#8B1A1A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 100000}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="revenue" stroke="#C9A84C"
                strokeWidth={2.5} fill="url(#areaGrad)"
                animationDuration={1800} animationEasing="ease-out"
                dot={false} activeDot={{ r: 5, fill: "#C9A84C", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="lg:col-span-2 bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white text-lg mb-1">Lead Sources</h3>
          <p className="text-xs font-manrope text-muted-foreground mb-3">Acquisition breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={leadSources} cx="50%" cy="50%" innerRadius={52} outerRadius={80}
                paddingAngle={3} dataKey="value"
                animationBegin={400} animationDuration={1200}
              >
                {leadSources.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} contentStyle={{ borderRadius: 10, border: "1px solid rgba(201,168,76,0.3)", fontSize: 12, fontFamily: "Manrope" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {leadSources.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-manrope">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="text-muted-foreground truncate">{s.name}</span>
                <span className="font-semibold text-ink dark:text-white ml-auto">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7 relative z-10">
        {aiInsights.map((insight, i) => {
          const IconComp = aiIcons[insight.icon] || Lightbulb;
          const c = aiColors[insight.type] || "#C9A84C";
          return (
            <div
              key={insight.id}
              className="ai-card rounded-2xl p-4 cursor-pointer group transition-all duration-200 hover:-translate-y-1"
              style={{ boxShadow: "0 4px 16px rgba(201,168,76,0.06)", animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c}12` }}>
                  <IconComp className="w-4.5 h-4.5 flex-shrink-0" style={{ color: c, width: 18, height: 18 }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[11px] font-manrope font-bold text-ink dark:text-white">{insight.title}</p>
                    <span className="text-[9px] font-manrope font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider" style={{ background: `${c}15`, color: c }}>AI</span>
                  </div>
                  <p className="text-[11px] font-manrope text-muted-foreground leading-relaxed">{insight.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 relative z-10">
        {/* Events table */}
        <div className="lg:col-span-3 bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] overflow-hidden luxury-shadow">
          <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
            <h3 className="font-playfair font-bold text-ink dark:text-white text-base">Upcoming Events</h3>
            <span className="text-[10px] font-manrope text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{upcomingEvents.length} scheduled</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(250,247,242,0.6)" }} className="dark:bg-muted/20">
                  {["Event & Client", "Date", "Amount", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-[0.08em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map(ev => (
                  <tr key={ev.id} className="table-row-hover border-t border-[hsl(var(--border))]/40">
                    <td className="px-4 py-3">
                      <p className="text-xs font-manrope font-semibold text-ink dark:text-white leading-tight">{ev.event}</p>
                      <p className="text-[10px] font-manrope text-muted-foreground mt-0.5">{ev.client} · {ev.venue}</p>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-manrope text-muted-foreground whitespace-nowrap">
                      {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3 text-[11px] font-manrope font-bold whitespace-nowrap" style={{ color: "#C9A84C" }}>
                      ₹{(ev.amount / 100000).toFixed(1)}L
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="lg:col-span-2 bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white text-base mb-5">Recent Activity</h3>
          <div className="relative space-y-4">
            <div className="absolute left-[15px] top-2 bottom-2 w-px" style={{ background: "linear-gradient(180deg, #8B1A1A40, #C9A84C40)" }} />
            {recentActivities.map((a, i) => {
              const cfg = activityConfig[a.type] || activityConfig.lead;
              const ActivityIcon = cfg.icon;
              return (
                <div key={a.id} className="relative flex items-start gap-4 group pl-1">
                  <div
                    className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-card transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `${cfg.color}12` }}
                  >
                    <ActivityIcon className="w-3.5 h-3.5" style={{ color: cfg.color, width: 14, height: 14 }} />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs font-manrope text-ink dark:text-white leading-snug">{a.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-manrope text-muted-foreground">{a.time}</span>
                      <span className="text-[10px] font-manrope font-semibold" style={{ color: "#C9A84C" }}>· {a.user}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}