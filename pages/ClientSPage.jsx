import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import StatusBadge from "../components/embassy/ui/StatusBadge";

const clientsData = [
  { id: 1, name: "Rajesh Sharma",    company: "Sharma Industries",   events: 5,  spend: 8250000,  tag: "vip",     phone: "+91 98765 43210", email: "rajesh@sharmagroup.in",   city: "Delhi",      lastEvent: "Jun 2026" },
  { id: 2, name: "Priya Kapoor",     company: "Kapoor Textiles",     events: 3,  spend: 2800000,  tag: "vip",     phone: "+91 87654 32109", email: "priya@kapoortextiles.com", city: "Mumbai",     lastEvent: "Jun 2026" },
  { id: 3, name: "Arjun Mehta",      company: "Mehta Corporation",   events: 8,  spend: 6400000,  tag: "vip",     phone: "+91 91234 56789", email: "arjun@mehtacorp.com",      city: "Delhi",      lastEvent: "Jun 2026" },
  { id: 4, name: "Neha Gupta",       company: "Gupta Jewellers",     events: 2,  spend: 1200000,  tag: "regular", phone: "+91 76543 21098", email: "neha@guptajewels.in",      city: "Gurgaon",    lastEvent: "Jun 2026" },
  { id: 5, name: "Vikram Patel",     company: "Patel Group",         events: 4,  spend: 3100000,  tag: "vip",     phone: "+91 99887 76543", email: "vikram@patelgroup.in",     city: "Ahmedabad",  lastEvent: "Jun 2026" },
  { id: 6, name: "Srinivas Reddy",   company: "Reddy Constructions", events: 2,  spend: 980000,   tag: "regular", phone: "+91 98123 45678", email: "srinivas@reddycon.in",     city: "Hyderabad",  lastEvent: "Jun 2026" },
  { id: 7, name: "Anita Joshi",      company: "Joshi & Associates",  events: 6,  spend: 2400000,  tag: "vip",     phone: "+91 77654 32100", email: "anita@joshilaw.in",        city: "Pune",       lastEvent: "Jun 2026" },
  { id: 8, name: "Harpreet Singh",   company: "Singh Pharma",        events: 1,  spend: 2200000,  tag: "new",     phone: "+91 96543 21001", email: "harpreet@singhpharma.com", city: "Chandigarh", lastEvent: "Jun 2026" },
];

export default function ClientsPage({ onSelectClient }) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("spend");
  const [sortDir, setSortDir] = useState(-1);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const handleSort = (key) => { if (sortBy === key) setSortDir(d => -d); else { setSortBy(key); setSortDir(-1); } };

  const filtered = clientsData
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1) * sortDir);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-9 pr-4 py-2.5 rounded-full text-xs font-manrope search-luxury focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[hsl(var(--border))] text-xs font-manrope font-semibold text-muted-foreground hover:text-ink hover:border-gold/30 transition-all">
            <SlidersHorizontal className="w-3.5 h-3.5" />Filter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Clients",   val: clientsData.length },
          { label: "VIP Clients",     val: clientsData.filter(c => c.tag === "vip").length },
          { label: "Total Revenue",   val: `₹${(clientsData.reduce((s,c)=>s+c.spend,0)/100000).toFixed(0)}L` },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] px-5 py-4 luxury-shadow text-center">
            <p className="text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className="font-playfair font-bold text-xl text-ink dark:text-white">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] overflow-hidden luxury-shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/20 border-b border-[hsl(var(--border))]">
                {[
                  { key: "name",   label: "Client" },
                  { key: "city",   label: "City" },
                  { key: "events", label: "Events" },
                  { key: "spend",  label: "Total Spend" },
                  { key: "tag",    label: "Tier" },
                  { key: "lastEvent", label: "Last Event" },
                  { key: "action", label: "" },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.key !== "action" && handleSort(col.key)}
                    className="text-left px-5 py-3 text-[10px] font-manrope font-semibold text-muted-foreground uppercase tracking-[0.08em] cursor-pointer hover:text-ink dark:hover:text-white transition-colors select-none"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key !== "action" && <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((client, i) => (
                <tr
                  key={client.id}
                  className="table-row-hover border-t border-[hsl(var(--border))]/40 cursor-pointer"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold font-manrope flex-shrink-0" style={{ background: "linear-gradient(135deg, #8B1A1A, #5C1111)" }}>
                        {client.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-manrope font-semibold text-ink dark:text-white">{client.name}</p>
                        <p className="text-[10px] font-manrope text-muted-foreground">{client.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-manrope text-muted-foreground">{client.city}</td>
                  <td className="px-5 py-3.5 text-xs font-manrope text-muted-foreground">{client.events}</td>
                  <td className="px-5 py-3.5 text-xs font-manrope font-bold" style={{ color: "#C9A84C" }}>
                    ₹{(client.spend / 100000).toFixed(1)}L
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={client.tag} /></td>
                  <td className="px-5 py-3.5 text-xs font-manrope text-muted-foreground">{client.lastEvent}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onSelectClient && onSelectClient(client.id)}
                      className="text-[11px] font-manrope font-semibold text-crimson hover:underline"
                      style={{ color: "#8B1A1A" }}
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}