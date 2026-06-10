import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, IndianRupee } from "lucide-react";
import { calendarEvents } from "../components/embassy/data";

const typeStyle = {
  Wedding:   { bg: "#8B1A1A", text: "#fff" },
  Reception: { bg: "#A02020", text: "#fff" },
  Corporate: { bg: "#1E3A5F", text: "#fff" },
  Engagement:{ bg: "#C9A84C", text: "#1A1A1A" },
  Birthday:  { bg: "#C9A84C", text: "#1A1A1A" },
  Religious: { bg: "#553C9A", text: "#fff" },
  Social:    { bg: "#276749", text: "#fff" },
};

export default function EventCalendar() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date(2026, 5, 1));

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const getDay = (day) => {
    const str = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarEvents.filter(e => e.date === str);
  };

  const totalRev = calendarEvents.reduce((s, e) => s + e.amount, 0);
  const isToday = (d) => new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;

  return (
    <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Events This Month", value: calendarEvents.length },
          { label: "Monthly Revenue",  value: `₹${(totalRev / 100000).toFixed(0)}L` },
          { label: "Busiest Day",      value: "June 2" },
          { label: "Next Event In",    value: "3 Days" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] px-5 py-4 luxury-shadow">
            <p className="text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className="font-playfair font-bold text-lg text-ink dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Calendar card */}
      <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-6 luxury-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setDate(new Date(year, month - 1, 1))} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4 text-ink dark:text-white" />
            </button>
            <h3 className="font-playfair font-bold text-ink dark:text-white text-xl min-w-[180px] text-center">{monthLabel}</h3>
            <button onClick={() => setDate(new Date(year, month + 1, 1))} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4 text-ink dark:text-white" />
            </button>
          </div>
          <div className="flex gap-1 bg-muted/50 rounded-full p-1">
            {["month", "agenda"].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-4 py-1.5 rounded-full text-[11px] font-manrope font-semibold capitalize transition-all duration-200"
                style={{
                  background: view === v ? "#8B1A1A" : "transparent",
                  color: view === v ? "#fff" : "var(--muted-foreground)",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === "month" ? (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="text-center text-[10px] font-manrope font-semibold text-muted-foreground py-2 uppercase tracking-wider">{d}</div>
              ))}
            </div>
            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="min-h-[88px]" />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const evs = getDay(day);
                const today = isToday(day);
                return (
                  <div
                    key={day}
                    className={`min-h-[88px] p-1.5 rounded-xl border transition-all hover:shadow-sm ${
                      today ? "cal-day-today" : "border-transparent hover:border-[hsl(var(--border))]"
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-manrope font-medium ${
                      today ? "bg-gold text-ink font-bold" : "text-ink dark:text-white"
                    }`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {evs.slice(0, 2).map(ev => {
                        const ts = typeStyle[ev.type] || typeStyle.Social;
                        return (
                          <div
                            key={ev.id}
                            title={`${ev.title}\n₹${(ev.amount / 100000).toFixed(1)}L · ${ev.venue}`}
                            className="text-[9px] px-1.5 py-0.5 rounded-md truncate font-manrope font-semibold cursor-default hover:opacity-80 transition-opacity"
                            style={{ background: ts.bg, color: ts.text }}
                          >
                            {ev.title}
                          </div>
                        );
                      })}
                      {evs.length > 2 && (
                        <p className="text-[9px] font-manrope text-muted-foreground pl-1">+{evs.length - 2} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-[hsl(var(--border))]">
              {Object.entries(typeStyle).map(([type, s]) => (
                <div key={type} className="flex items-center gap-1.5 text-[10px] font-manrope text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.bg }} />
                  {type}
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Agenda */
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {calendarEvents
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(ev => {
                const ts = typeStyle[ev.type] || typeStyle.Social;
                return (
                  <div key={ev.id} className="flex gap-4 items-start group">
                    <div className="flex-shrink-0 w-14 text-center">
                      <p className="text-2xl font-playfair font-bold text-ink dark:text-white leading-none">{new Date(ev.date).getDate()}</p>
                      <p className="text-[10px] font-manrope text-muted-foreground mt-0.5">{new Date(ev.date).toLocaleDateString("en-IN", { month: "short" })}</p>
                    </div>
                    <div className="w-0.5 self-stretch flex-shrink-0 relative bg-[hsl(var(--border))]">
                      <div className="absolute top-2 -left-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-card" style={{ background: ts.bg }} />
                    </div>
                    <div
                      className="flex-1 rounded-xl p-4 group-hover:-translate-y-0.5 group-hover:shadow-luxury transition-all duration-200 border border-[hsl(var(--border))]"
                      style={{ background: "rgba(250,247,242,0.5)" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-playfair font-bold text-ink dark:text-white text-sm">{ev.title}</p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className="flex items-center gap-1 text-[10px] font-manrope text-muted-foreground">
                              <MapPin className="w-3 h-3" />{ev.venue}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-manrope font-bold" style={{ color: "#C9A84C" }}>
                              <IndianRupee className="w-3 h-3" />₹{(ev.amount / 100000).toFixed(1)}L
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-manrope font-bold px-2 py-1 rounded-full flex-shrink-0" style={{ background: ts.bg, color: ts.text }}>
                          {ev.type}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}