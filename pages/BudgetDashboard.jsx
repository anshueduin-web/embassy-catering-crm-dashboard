import React, { useState } from "react";
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  IndianRupee, BarChart3, ChevronDown, Info
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend, ReferenceLine
} from "recharts";
import { upcomingEvents, pipelineData } from "../components/embassy/data";
import StatusBadge from "../components/embassy/ui/StatusBadge";

// ─── Simulated cost data per event ───────────────────────────────────────────
const generateEventFinancials = (events) =>
  events.map(ev => {
    const quote = ev.amount;
    const foodCost = Math.round(quote * (0.28 + Math.random() * 0.1));
    const staffCost = Math.round(quote * (0.12 + Math.random() * 0.05));
    const venueCost = Math.round(quote * (0.08 + Math.random() * 0.04));
    const decorCost = Math.round(quote * (0.06 + Math.random() * 0.04));
    const miscCost  = Math.round(quote * (0.03 + Math.random() * 0.03));
    const totalCost = foodCost + staffCost + venueCost + decorCost + miscCost;
    const profit    = quote - totalCost;
    const margin    = ((profit / quote) * 100).toFixed(1);
    const budget    = Math.round(quote * 0.55); // 55% cost threshold
    const overBudget = totalCost > budget;
    return {
      id: ev.id, event: ev.event, client: ev.client, date: ev.date,
      status: ev.status, venue: ev.venue, guests: ev.guests,
      quote, totalCost, profit, margin: parseFloat(margin),
      budget, overBudget,
      breakdown: { food: foodCost, staff: staffCost, venue: venueCost, decor: decorCost, misc: miscCost },
    };
  });

const EVENTS_DATA = generateEventFinancials(upcomingEvents);

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtL = (n) => `₹${(n / 100000).toFixed(1)}L`;

const COST_COLORS = {
  food: "#8B1A1A", staff: "#C9A84C", venue: "#2D3748",
  decor: "#7c3aed", misc: "#6B7280",
};

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl px-4 py-3 border border-[hsl(var(--border))] shadow-luxury text-xs font-manrope">
      <p className="font-bold text-ink mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold text-ink">{fmtL(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

function PLRow({ ev, onSelect, selected }) {
  const profitColor = ev.profit >= 0 ? "#276749" : "#dc2626";
  const marginColor = ev.margin >= 35 ? "#276749" : ev.margin >= 20 ? "#C9A84C" : "#dc2626";
  const costPct = Math.round((ev.totalCost / ev.quote) * 100);

  return (
    <tr
      onClick={() => onSelect(ev.id === selected ? null : ev.id)}
      className="table-row-hover border-t border-[hsl(var(--border))]/40 cursor-pointer transition-colors"
      style={{ background: selected ? "rgba(201,168,76,0.04)" : undefined }}
    >
      <td className="px-4 py-3">
        <p className="text-xs font-manrope font-semibold text-ink dark:text-white leading-tight">{ev.event}</p>
        <p className="text-[10px] font-manrope text-muted-foreground">{ev.client}</p>
      </td>
      <td className="px-4 py-3 text-[11px] font-manrope text-muted-foreground whitespace-nowrap hidden md:table-cell">
        {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
      </td>
      <td className="px-4 py-3 text-xs font-manrope font-bold whitespace-nowrap" style={{ color: "#C9A84C" }}>{fmtL(ev.quote)}</td>
      <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full overflow-hidden bg-muted">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(costPct, 100)}%`, background: ev.overBudget ? "#dc2626" : "#C9A84C" }} />
          </div>
          <span className="text-[11px] font-manrope font-semibold" style={{ color: ev.overBudget ? "#dc2626" : "var(--muted-foreground)" }}>{fmtL(ev.totalCost)} ({costPct}%)</span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs font-manrope font-bold whitespace-nowrap" style={{ color: profitColor }}>{fmtL(ev.profit)}</td>
      <td className="px-4 py-3 text-xs font-manrope font-bold whitespace-nowrap" style={{ color: marginColor }}>{ev.margin}%</td>
      <td className="px-4 py-3">
        {ev.overBudget
          ? <span className="inline-flex items-center gap-1 text-[10px] font-manrope font-bold px-2 py-0.5 rounded-full" style={{ background: "#dc262610", color: "#dc2626", border: "1px solid #dc262630" }}><AlertTriangle className="w-2.5 h-2.5" />Over Budget</span>
          : <span className="inline-flex items-center gap-1 text-[10px] font-manrope font-bold px-2 py-0.5 rounded-full" style={{ background: "#27674910", color: "#276749", border: "1px solid #27674930" }}><CheckCircle2 className="w-2.5 h-2.5" />On Track</span>
        }
      </td>
    </tr>
  );
}

export default function BudgetDashboard() {
  const [selectedId, setSelectedId] = useState(null);
  const [sortKey, setSortKey] = useState("margin");

  const selectedEvent = EVENTS_DATA.find(e => e.id === selectedId);

  const totalRevenue = EVENTS_DATA.reduce((s, e) => s + e.quote, 0);
  const totalCost    = EVENTS_DATA.reduce((s, e) => s + e.totalCost, 0);
  const totalProfit  = totalRevenue - totalCost;
  const avgMargin    = (EVENTS_DATA.reduce((s, e) => s + e.margin, 0) / EVENTS_DATA.length).toFixed(1);
  const overBudgetCount = EVENTS_DATA.filter(e => e.overBudget).length;

  const sorted = [...EVENTS_DATA].sort((a, b) => {
    if (sortKey === "margin") return b.margin - a.margin;
    if (sortKey === "profit") return b.profit - a.profit;
    if (sortKey === "quote")  return b.quote - a.quote;
    return 0;
  });

  // Chart data
  const barData = EVENTS_DATA.slice(0, 6).map(e => ({
    name: e.event.split(" ").slice(0, 2).join(" "),
    Quote: e.quote,
    Cost: e.totalCost,
    Profit: e.profit,
  }));

  const breakdownData = EVENTS_DATA.slice(0, 6).map(e => ({
    name: e.event.split(" ")[0],
    Food:  e.breakdown.food,
    Staff: e.breakdown.staff,
    Venue: e.breakdown.venue,
    Decor: e.breakdown.decor,
    Misc:  e.breakdown.misc,
  }));

  const kpis = [
    { label: "Total Revenue",   val: fmtL(totalRevenue),  change: "+18% MoM",    pos: true,  icon: IndianRupee, color: "#C9A84C" },
    { label: "Total Cost",      val: fmtL(totalCost),     change: "+12% MoM",    pos: false, icon: TrendingDown, color: "#8B1A1A" },
    { label: "Net Profit",      val: fmtL(totalProfit),   change: "+24% MoM",    pos: true,  icon: TrendingUp,  color: "#276749" },
    { label: "Avg Margin",      val: `${avgMargin}%`,     change: "Healthy",     pos: true,  icon: BarChart3,   color: "#7c3aed" },
    { label: "Over Budget",     val: `${overBudgetCount}`, change: "events flagged", pos: overBudgetCount === 0, icon: AlertTriangle, color: overBudgetCount > 0 ? "#dc2626" : "#276749" },
  ];

  return (
    <div className="animate-fade-up space-y-5" style={{ animationFillMode: "forwards" }}>

      {/* Header */}
      <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-5 luxury-shadow">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8B1A1A,#5C1111)" }}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-playfair font-bold text-ink dark:text-white text-xl">Budget & P&L Dashboard</h2>
              <p className="text-xs font-manrope text-muted-foreground mt-0.5">Real-time profit & loss view across all events</p>
            </div>
          </div>
          {overBudgetCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl animate-pulse-glow" style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)" }}>
              <AlertTriangle className="w-4 h-4" style={{ color: "#dc2626" }} />
              <span className="text-xs font-manrope font-bold" style={{ color: "#dc2626" }}>{overBudgetCount} event{overBudgetCount > 1 ? "s" : ""} exceeding budget threshold</span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-4 luxury-shadow card-hover-lift">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: kpi.color, width: 16, height: 16 }} />
                </div>
                <span className="text-[9px] font-manrope font-semibold px-1.5 py-0.5 rounded-full" style={{ background: kpi.pos ? "#27674910" : "#dc262610", color: kpi.pos ? "#276749" : "#dc2626" }}>
                  {kpi.change}
                </span>
              </div>
              <p className="font-playfair font-bold text-xl text-ink dark:text-white">{kpi.val}</p>
              <p className="text-[10px] font-manrope text-muted-foreground mt-0.5">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quote vs Cost vs Profit */}
        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-5 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white mb-1">Quote vs. Cost vs. Profit</h3>
          <p className="text-[11px] font-manrope text-muted-foreground mb-4">Per event financial comparison</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/100000}L`} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="Quote"  fill="#C9A84C" radius={[4,4,0,0]} maxBarSize={20} />
              <Bar dataKey="Cost"   fill="#8B1A1A" radius={[4,4,0,0]} maxBarSize={20} />
              <Bar dataKey="Profit" fill="#276749" radius={[4,4,0,0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[["Quote","#C9A84C"],["Cost","#8B1A1A"],["Profit","#276749"]].map(([l,c]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                <span className="text-[10px] font-manrope text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost breakdown stacked */}
        <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-5 luxury-shadow">
          <h3 className="font-playfair font-bold text-ink dark:text-white mb-1">Cost Breakdown by Category</h3>
          <p className="text-[11px] font-manrope text-muted-foreground mb-4">Stacked cost composition per event</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={breakdownData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9CA3AF", fontFamily: "Manrope" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/100000}L`} />
              <Tooltip content={<ChartTip />} />
              {Object.keys(COST_COLORS).map(k => (
                <Bar key={k} dataKey={k.charAt(0).toUpperCase()+k.slice(1)} stackId="a" fill={COST_COLORS[k]} maxBarSize={28} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {Object.entries(COST_COLORS).map(([k,c]) => (
              <div key={k} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                <span className="text-[10px] font-manrope text-muted-foreground capitalize">{k}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* P&L Table */}
      <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] overflow-hidden luxury-shadow">
        <div className="px-5 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-playfair font-bold text-ink dark:text-white">Event P&L Breakdown</h3>
            <p className="text-[11px] font-manrope text-muted-foreground mt-0.5">Click any row to expand cost details</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-manrope text-muted-foreground">Sort:</span>
            {["margin","profit","quote"].map(k => (
              <button key={k} onClick={() => setSortKey(k)}
                className="px-2.5 py-1 rounded-full text-[10px] font-manrope font-semibold capitalize transition-all"
                style={{ background: sortKey === k ? "#8B1A1A" : "transparent", color: sortKey === k ? "#fff" : "var(--muted-foreground)", border: `1px solid ${sortKey === k ? "#8B1A1A" : "hsl(var(--border))"}` }}>
                {k}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(250,247,242,0.6)" }} className="dark:bg-muted/20">
                {["Event", "Date", "Quote", "Actual Cost", "Profit", "Margin", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-[0.08em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(ev => (
                <React.Fragment key={ev.id}>
                  <PLRow ev={ev} onSelect={setSelectedId} selected={selectedId} />
                  {selectedId === ev.id && (
                    <tr>
                      <td colSpan={7} className="px-4 pb-4 pt-2">
                        <div className="rounded-xl p-4 border" style={{ background: "rgba(250,247,242,0.7)", borderColor: "rgba(201,168,76,0.2)" }}>
                          <p className="text-[10px] font-manrope font-bold text-muted-foreground uppercase tracking-widest mb-3">Cost Breakdown — {ev.event}</p>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {Object.entries(ev.breakdown).map(([k, v]) => (
                              <div key={k} className="text-center p-3 rounded-xl" style={{ background: `${COST_COLORS[k]}0f`, border: `1px solid ${COST_COLORS[k]}25` }}>
                                <p className="font-playfair font-bold text-sm" style={{ color: COST_COLORS[k] }}>{fmtL(v)}</p>
                                <p className="text-[10px] font-manrope text-muted-foreground capitalize mt-0.5">{k}</p>
                                <p className="text-[9px] font-manrope mt-0.5" style={{ color: COST_COLORS[k] }}>{((v / ev.quote) * 100).toFixed(1)}% of quote</p>
                              </div>
                            ))}
                          </div>
                          {ev.overBudget && (
                            <div className="mt-3 flex items-start gap-2 p-3 rounded-xl" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}>
                              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#dc2626" }} />
                              <div>
                                <p className="text-xs font-manrope font-bold" style={{ color: "#dc2626" }}>Budget Threshold Exceeded</p>
                                <p className="text-[11px] font-manrope text-muted-foreground mt-0.5">
                                  Actual cost ({fmtL(ev.totalCost)}) exceeds the 55% budget threshold ({fmtL(ev.budget)}) by {fmtL(ev.totalCost - ev.budget)}.
                                  Review food and staff costs for optimization.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Budget threshold guide */}
      <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-5 luxury-shadow">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4" style={{ color: "#C9A84C" }} />
          <h3 className="font-playfair font-bold text-sm text-ink dark:text-white">Budget Threshold Guide</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "Healthy Margin", range: "≥ 35%", desc: "Event is well within budget. Profit target achieved.", color: "#276749" },
            { label: "At Risk",        range: "20–35%", desc: "Monitor costs closely. Review food and staff allocations.", color: "#C9A84C" },
            { label: "Over Budget",    range: "< 20%", desc: "Cost exceeds threshold. Immediate review required.", color: "#dc2626" },
          ].map(g => (
            <div key={g.label} className="p-3 rounded-xl" style={{ background: `${g.color}0a`, border: `1px solid ${g.color}25` }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
                <span className="text-xs font-manrope font-bold" style={{ color: g.color }}>{g.label}</span>
                <span className="text-[10px] font-manrope font-semibold ml-auto px-2 py-0.5 rounded-full" style={{ background: `${g.color}15`, color: g.color }}>{g.range}</span>
              </div>
              <p className="text-[11px] font-manrope text-muted-foreground leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}