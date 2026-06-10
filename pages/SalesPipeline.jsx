import React, { useState, useEffect } from "react";
import { Calendar, IndianRupee, Clock, Plus, Flame, ChevronRight } from "lucide-react";
import StatusBadge from "../components/embassy/ui/StatusBadge";
import { pipelineData as initialPipeline } from "../components/embassy/data";

const COLS = [
  { id: "enquiry",   label: "Enquiry",   color: "#8B1A1A", light: "rgba(139,26,26,0.08)" },
  { id: "tasting",   label: "Tasting",   color: "#C9A84C", light: "rgba(201,168,76,0.08)" },
  { id: "proposal",  label: "Proposal",  color: "#2D3748", light: "rgba(45,55,72,0.08)"  },
  { id: "confirmed", label: "Confirmed", color: "#276749", light: "rgba(39,103,73,0.08)" },
];

const priorityConfig = {
  high:   { dot: "bg-red-500",    label: "High"   },
  medium: { dot: "bg-amber-500",  label: "Medium" },
  low:    { dot: "bg-emerald-500",label: "Low"    },
};

const scoreGradient = (s) =>
  s >= 80 ? "from-emerald-500 to-emerald-400" :
  s >= 60 ? "from-gold to-gold-light" :
  "from-crimson to-crimson-light";

function LeadCard({ lead, isDragging }) {
  return (
    <div
      className={`bg-white dark:bg-card rounded-xl border border-[hsl(var(--border))] p-4 mb-3 select-none cursor-grab active:cursor-grabbing transition-all duration-150 group`}
      style={{
        boxShadow: isDragging
          ? "0 28px 56px rgba(139,26,26,0.22), 0 8px 24px rgba(0,0,0,0.12)"
          : "0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
        transform: isDragging ? "rotate(2.5deg) scale(1.04)" : "none",
        opacity: isDragging ? 0.95 : 1,
        zIndex: isDragging ? 999 : "auto",
      }}
    >
      {/* Top */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <p className="font-playfair font-bold text-ink dark:text-white text-sm leading-tight">{lead.client}</p>
          <p className="text-[11px] font-manrope text-muted-foreground mt-0.5">{lead.event}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span className={`w-2 h-2 rounded-full ${priorityConfig[lead.priority]?.dot}`} />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-[11px] font-manrope text-muted-foreground">
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span>{new Date(lead.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-manrope font-semibold" style={{ color: "#C9A84C" }}>
          <IndianRupee className="w-3 h-3 flex-shrink-0" />
          <span>₹{(lead.budget / 100000).toFixed(1)}L</span>
        </div>
      </div>

      {/* AI Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-manrope font-semibold text-muted-foreground uppercase tracking-wider">AI Score</span>
          <span className="text-[10px] font-manrope font-bold text-ink dark:text-white">{lead.score}%</span>
        </div>
        <div className="h-1.5 bg-[hsl(var(--border))] rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${scoreGradient(lead.score)} rounded-full transition-all duration-1000`}
            style={{ width: `${lead.score}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[hsl(var(--border))]/50">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: "#8B1A1A" }}>
            {lead.initials}
          </div>
          <span className="text-[10px] font-manrope text-muted-foreground">{lead.assignee}</span>
        </div>
        <div className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-full">
          <Clock className="w-2.5 h-2.5 text-muted-foreground" />
          <span className="text-[9px] font-manrope text-muted-foreground">{lead.days}d</span>
        </div>
      </div>
    </div>
  );
}

export default function SalesPipeline() {
  const [pipeline, setPipeline] = useState(initialPipeline);
  const [mounted, setMounted] = useState(false);
  const [drag, setDrag] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const totalValue = (colId) => (pipeline[colId] || []).reduce((s, l) => s + l.budget, 0);
  const totalLeads = Object.values(pipeline).reduce((s, col) => s + col.length, 0);

  const onDragStart = (e, lead, fromCol) => {
    setDrag({ lead, fromCol });
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e, colId) => { e.preventDefault(); setDragOver(colId); };
  const onDrop = (e, toCol) => {
    e.preventDefault();
    if (!drag || drag.fromCol === toCol) { setDrag(null); setDragOver(null); return; }
    setPipeline(prev => {
      const next = { ...prev };
      next[drag.fromCol] = prev[drag.fromCol].filter(l => l.id !== drag.lead.id);
      next[toCol] = [...prev[toCol], drag.lead];
      return next;
    });
    setDrag(null); setDragOver(null);
  };
  const onDragEnd = () => { setDrag(null); setDragOver(null); };

  return (
    <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      {/* Summary */}
      <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] px-6 py-4 mb-6 luxury-shadow">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Pipeline Total</p>
            <p className="font-playfair font-bold text-xl text-ink dark:text-white">
              ₹{(Object.values(pipeline).flat().reduce((s, l) => s + l.budget, 0) / 100000).toFixed(0)}L
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {COLS.map(col => (
              <div key={col.id} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold font-manrope" style={{ background: col.color }}>
                  {pipeline[col.id]?.length || 0}
                </div>
                <div>
                  <p className="text-xs font-manrope font-semibold text-ink dark:text-white leading-none">{col.label}</p>
                  <p className="text-[10px] font-manrope mt-0.5" style={{ color: "#C9A84C" }}>₹{(totalValue(col.id) / 100000).toFixed(0)}L</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLS.map(col => {
          const isOver = dragOver === col.id;
          return (
            <div
              key={col.id}
              onDragOver={e => onDragOver(e, col.id)}
              onDrop={e => onDrop(e, col.id)}
              onDragLeave={() => setDragOver(null)}
              className="rounded-2xl transition-all duration-200 overflow-hidden"
              style={{
                border: isOver ? `2px solid ${col.color}60` : "2px solid transparent",
                background: isOver ? `${col.color}04` : "transparent",
              }}
            >
              {/* Column header */}
              <div
                className="px-4 py-3 flex items-center justify-between rounded-t-2xl mb-3"
                style={{ background: `linear-gradient(135deg, ${col.color} 0%, ${col.color}CC 100%)` }}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-manrope font-bold text-white uppercase tracking-[0.12em]">{col.label}</h3>
                  <span className="text-[10px] font-manrope font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                    {pipeline[col.id]?.length || 0}
                  </span>
                </div>
                <span className="text-[10px] font-manrope text-white/70">₹{(totalValue(col.id) / 100000).toFixed(1)}L</span>
              </div>

              {/* Cards */}
              <div className="px-2 min-h-[200px] max-h-[520px] overflow-y-auto">
                {(pipeline[col.id] || []).map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={e => onDragStart(e, lead, col.id)}
                    onDragEnd={onDragEnd}
                  >
                    <LeadCard lead={lead} isDragging={drag?.lead?.id === lead.id} />
                  </div>
                ))}
                {/* Empty state */}
                {(!pipeline[col.id] || pipeline[col.id].length === 0) && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-10 h-10 rounded-xl border-2 border-dashed border-[hsl(var(--border))] flex items-center justify-center mb-2">
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs font-manrope text-muted-foreground">Drop leads here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}