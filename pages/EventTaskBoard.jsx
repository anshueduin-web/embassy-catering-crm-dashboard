import React, { useState, useEffect, useRef } from "react";
import {
  Plus, X, Bell, Check, Flag, ChevronDown, User,
  Calendar, CheckCircle2, Circle, Clock, AlertTriangle,
  Milestone, Zap, ChevronRight
} from "lucide-react";
import { upcomingEvents } from "../components/embassy/data";

// ─── Constants ────────────────────────────────────────────────────────────────
const COLUMNS = [
  { id: "todo",        label: "To Do",       color: "#6B7280", bg: "#6B72800f" },
  { id: "inprogress",  label: "In Progress", color: "#C9A84C", bg: "#C9A84C0f" },
  { id: "review",      label: "Review",      color: "#7c3aed", bg: "#7c3aed0f" },
  { id: "done",        label: "Done",        color: "#276749", bg: "#2767490f" },
];

const PRIORITY_CONFIG = {
  high:   { label: "High",   color: "#dc2626", bg: "#dc262610" },
  medium: { label: "Medium", color: "#C9A84C", bg: "#C9A84C10" },
  low:    { label: "Low",    color: "#6B7280", bg: "#6B728010" },
};

// Milestone triggers — when a task with this title moves to "done", fire a notification
const MILESTONE_TRIGGERS = [
  { match: "floor plan",       title: "🏛️ Floor Plan Approved",       body: "The venue floor plan has been approved and is ready for setup." },
  { match: "final payment",    title: "💳 Final Payment Received",      body: "Full payment confirmed. Finance team notified." },
  { match: "menu approved",    title: "🍽️ Menu Approved",              body: "Client has approved the final menu. Chef team to proceed." },
  { match: "contract signed",  title: "📝 Contract Signed",            body: "Event contract is signed and locked." },
  { match: "tasting",          title: "👨‍🍳 Tasting Completed",          body: "Food tasting session is done. Awaiting client feedback." },
  { match: "venue confirmed",  title: "📍 Venue Confirmed",            body: "Venue booking is confirmed and deposit paid." },
  { match: "guest list",       title: "👥 Guest List Finalised",       body: "Final headcount confirmed. Procurement team notified." },
  { match: "décor approved",   title: "✨ Décor Approved",             body: "Décor plan approved. Décor team to proceed." },
];

const TEAM = ["Ravi K.", "Priya S.", "Amit D.", "Neha P.", "Suresh M."];

// Seed tasks per event
const seedTasks = (eventId) => [
  { id: `${eventId}-1`, title: "Initial client briefing",       col: "done",       priority: "high",   assignee: "Ravi K.",  due: "2026-05-20", checklist: [] },
  { id: `${eventId}-2`, title: "Venue confirmed",               col: "done",       priority: "high",   assignee: "Priya S.", due: "2026-05-22", checklist: [] },
  { id: `${eventId}-3`, title: "Menu approved by client",       col: "inprogress", priority: "high",   assignee: "Ravi K.",  due: "2026-06-01", checklist: [{ label: "North Indian", done: true }, { label: "Continental", done: false }] },
  { id: `${eventId}-4`, title: "Floor plan approved",           col: "todo",       priority: "high",   assignee: "Amit D.",  due: "2026-06-03", checklist: [] },
  { id: `${eventId}-5`, title: "Tasting session scheduled",     col: "inprogress", priority: "medium", assignee: "Neha P.",  due: "2026-06-05", checklist: [] },
  { id: `${eventId}-6`, title: "Guest list finalised",          col: "todo",       priority: "medium", assignee: "Priya S.", due: "2026-06-07", checklist: [] },
  { id: `${eventId}-7`, title: "Procurement order raised",      col: "todo",       priority: "medium", assignee: "Ravi K.",  due: "2026-06-10", checklist: [] },
  { id: `${eventId}-8`, title: "Final payment received",        col: "todo",       priority: "high",   assignee: "Suresh M.",due: "2026-06-12", checklist: [] },
  { id: `${eventId}-9`, title: "Staff briefing done",           col: "todo",       priority: "low",    assignee: "Amit D.",  due: "2026-06-15", checklist: [] },
  { id: `${eventId}-10`,title: "Décor approved",                col: "review",     priority: "medium", assignee: "Neha P.",  due: "2026-06-02", checklist: [] },
];

let taskUid = 9000;
const mkTaskId = () => `task-${taskUid++}`;

// ─── Toast Notification ───────────────────────────────────────────────────────
function MilestoneToast({ notif, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-2xl shadow-luxury-xl animate-fade-up"
      style={{
        background: "linear-gradient(135deg,#FAF7F2,#F0E8D8)",
        border: "1px solid rgba(201,168,76,0.4)",
        boxShadow: "0 16px 40px rgba(139,26,26,0.15), 0 0 0 1px rgba(201,168,76,0.25)",
        animationFillMode: "forwards",
        minWidth: 300, maxWidth: 360,
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#8B1A1A,#5C1111)" }}>
        <Zap className="w-4 h-4 text-gold" style={{ color: "#C9A84C" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-manrope font-bold text-ink">{notif.title}</p>
        <p className="text-[11px] font-manrope text-muted-foreground mt-0.5 leading-relaxed">{notif.body}</p>
      </div>
      <button onClick={onDismiss} className="text-muted-foreground hover:text-ink transition-colors flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ task, onMove, onDelete, onUpdate, columns }) {
  const [expanded, setExpanded] = useState(false);
  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isOverdue = task.due && new Date(task.due) < new Date() && task.col !== "done";
  const doneChecks = task.checklist.filter(c => c.done).length;

  return (
    <div
      className="bg-white dark:bg-card rounded-xl border border-[hsl(var(--border))] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 luxury-shadow group"
      draggable
      onDragStart={e => e.dataTransfer.setData("taskId", task.id)}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <button onClick={() => onMove(task.id, task.col === "done" ? "inprogress" : "done")} className="mt-0.5 flex-shrink-0">
            {task.col === "done"
              ? <CheckCircle2 className="w-4 h-4" style={{ color: "#276749" }} />
              : <Circle className="w-4 h-4 text-muted-foreground hover:text-green-600 transition-colors" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-manrope font-semibold leading-snug ${task.col === "done" ? "line-through text-muted-foreground" : "text-ink dark:text-white"}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="text-[9px] font-manrope font-bold px-1.5 py-0.5 rounded-full" style={{ background: p.bg, color: p.color }}>{p.label}</span>
              {isOverdue && <span className="text-[9px] font-manrope font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#dc262610", color: "#dc2626" }}>Overdue</span>}
              {task.checklist.length > 0 && (
                <span className="text-[9px] font-manrope text-muted-foreground">{doneChecks}/{task.checklist.length} ✓</span>
              )}
            </div>
          </div>
          <button onClick={() => setExpanded(e => !e)} className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" style={{ transform: expanded ? "rotate(180deg)" : "none" }} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[hsl(var(--border))]/50">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-manrope font-bold text-white" style={{ background: "#8B1A1A" }}>
              {task.assignee.split(" ").map(w => w[0]).join("")}
            </div>
            <span className="text-[10px] font-manrope text-muted-foreground">{task.assignee}</span>
          </div>
          {task.due && (
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" style={{ color: isOverdue ? "#dc2626" : "#9CA3AF" }} />
              <span className="text-[10px] font-manrope" style={{ color: isOverdue ? "#dc2626" : "#9CA3AF" }}>
                {new Date(task.due).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[hsl(var(--border))]/50 px-3 py-2.5 bg-muted/10 space-y-2.5">
          {/* Move to column */}
          <div>
            <p className="text-[9px] font-manrope font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Move to</p>
            <div className="flex flex-wrap gap-1">
              {columns.filter(c => c.id !== task.col).map(c => (
                <button key={c.id} onClick={() => { onMove(task.id, c.id); setExpanded(false); }}
                  className="text-[10px] font-manrope font-semibold px-2 py-1 rounded-lg border transition-all"
                  style={{ borderColor: c.color + "44", color: c.color, background: c.bg }}>
                  → {c.label}
                </button>
              ))}
            </div>
          </div>
          {/* Assignee */}
          <div>
            <p className="text-[9px] font-manrope font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Assignee</p>
            <select value={task.assignee} onChange={e => onUpdate({ ...task, assignee: e.target.value })}
              className="w-full text-[11px] font-manrope border border-[hsl(var(--border))] rounded-lg px-2 py-1.5 bg-transparent focus:outline-none">
              {TEAM.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {/* Due date */}
          <div>
            <p className="text-[9px] font-manrope font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Due Date</p>
            <input type="date" value={task.due} onChange={e => onUpdate({ ...task, due: e.target.value })}
              className="w-full text-[11px] font-manrope border border-[hsl(var(--border))] rounded-lg px-2 py-1.5 bg-transparent focus:outline-none"
            />
          </div>
          {/* Checklist */}
          {task.checklist.length > 0 && (
            <div>
              <p className="text-[9px] font-manrope font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Checklist</p>
              {task.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <button onClick={() => {
                    const updated = task.checklist.map((c, ci) => ci === i ? { ...c, done: !c.done } : c);
                    onUpdate({ ...task, checklist: updated });
                  }}>
                    {item.done ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#276749" }} /> : <Circle className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                  <span className={`text-[11px] font-manrope ${item.done ? "line-through text-muted-foreground" : "text-ink dark:text-white"}`}>{item.label}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => onDelete(task.id)} className="w-full text-center text-[10px] font-manrope text-red-500 hover:text-red-600 py-1 transition-colors">
            Delete task
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EventTaskBoard() {
  const [selectedEvent, setSelectedEvent] = useState(upcomingEvents[0]);
  const [tasks, setTasks] = useState(() => seedTasks(upcomingEvents[0].id));
  const [notifications, setNotifications] = useState([]);
  const [notifLog, setNotifLog] = useState([]);
  const [addingCol, setAddingCol] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [dragOverCol, setDragOverCol] = useState(null);
  const [showLog, setShowLog] = useState(false);
  const inputRef = useRef(null);

  const handleEventChange = (ev) => {
    setSelectedEvent(ev);
    setTasks(seedTasks(ev.id));
    setNotifications([]);
  };

  const checkMilestone = (task, newCol) => {
    if (newCol !== "done") return;
    const trigger = MILESTONE_TRIGGERS.find(t => task.title.toLowerCase().includes(t.match));
    if (trigger) {
      const notif = { id: Date.now(), ...trigger };
      setNotifications(prev => [...prev, notif]);
      setNotifLog(prev => [{ ...notif, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }, ...prev]);
    }
  };

  const moveTask = (taskId, newCol) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) checkMilestone(task, newCol);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, col: newCol } : t));
  };

  const deleteTask = (taskId) => setTasks(prev => prev.filter(t => t.id !== taskId));
  const updateTask = (updated) => setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));

  const addTask = (col) => {
    if (!newTaskTitle.trim()) return;
    setTasks(prev => [...prev, { id: mkTaskId(), title: newTaskTitle.trim(), col, priority: "medium", assignee: "Ravi K.", due: "", checklist: [] }]);
    setNewTaskTitle("");
    setAddingCol(null);
  };

  // Drag & drop
  const handleDrop = (e, colId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) moveTask(taskId, colId);
    setDragOverCol(null);
  };

  const doneCount = tasks.filter(t => t.col === "done").length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="animate-fade-up" style={{ animationFillMode: "forwards" }}>
      {/* Toast notifications */}
      <div className="fixed top-20 right-5 z-[100] space-y-2 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto">
            <MilestoneToast notif={n} onDismiss={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-5 mb-5 luxury-shadow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#8B1A1A,#5C1111)" }}>
              <Milestone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-playfair font-bold text-ink dark:text-white text-xl">Event Task Board</h2>
              <p className="text-xs font-manrope text-muted-foreground mt-0.5">Kanban board with automated milestone notifications</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Notification log */}
            <button onClick={() => setShowLog(l => !l)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[hsl(var(--border))] text-[11px] font-manrope font-semibold text-muted-foreground hover:text-ink transition-all">
              <Bell className="w-3.5 h-3.5" />
              Notifications
              {notifLog.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center" style={{ background: "#8B1A1A" }}>{notifLog.length}</span>
              )}
            </button>

            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 rounded-full overflow-hidden bg-muted">
                <div className="h-full progress-luxury transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-manrope font-bold" style={{ color: "#8B1A1A" }}>{progress}%</span>
            </div>
          </div>
        </div>

        {/* Notification log dropdown */}
        {showLog && (
          <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]/50">
            <p className="text-[10px] font-manrope font-bold text-muted-foreground uppercase tracking-widest mb-2">Milestone Log</p>
            {notifLog.length === 0 ? (
              <p className="text-[11px] font-manrope text-muted-foreground">No milestones reached yet. Move tasks to "Done" to trigger notifications.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {notifLog.map(n => (
                  <div key={n.id} className="flex items-start gap-3 p-2.5 rounded-xl" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}>
                    <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#C9A84C" }} />
                    <div className="flex-1">
                      <p className="text-[11px] font-manrope font-bold text-ink dark:text-white">{n.title}</p>
                      <p className="text-[10px] font-manrope text-muted-foreground">{n.body}</p>
                    </div>
                    <span className="text-[9px] font-manrope text-muted-foreground flex-shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Event selector */}
        <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]/50 flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-manrope text-muted-foreground flex-shrink-0">Event:</span>
          <div className="flex gap-2 flex-wrap">
            {upcomingEvents.slice(0, 5).map(ev => (
              <button key={ev.id} onClick={() => handleEventChange(ev)}
                className="px-3 py-1.5 rounded-full text-[11px] font-manrope font-semibold transition-all whitespace-nowrap"
                style={{
                  background: selectedEvent?.id === ev.id ? "#8B1A1A" : "transparent",
                  color: selectedEvent?.id === ev.id ? "#fff" : "var(--muted-foreground)",
                  border: `1px solid ${selectedEvent?.id === ev.id ? "#8B1A1A" : "hsl(var(--border))"}`,
                }}>
                {ev.event.split(" ").slice(0, 3).join(" ")}
              </button>
            ))}
          </div>
          <div className="ml-auto text-[11px] font-manrope text-muted-foreground">
            {doneCount}/{tasks.length} tasks complete
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.col === col.id);
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              className="rounded-2xl transition-all duration-200"
              style={{
                background: isOver ? col.bg : "transparent",
                border: isOver ? `2px dashed ${col.color}55` : "2px solid transparent",
              }}
              onDragOver={e => { e.preventDefault(); setDragOverCol(col.id); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={e => handleDrop(e, col.id)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-1 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                  <span className="text-xs font-manrope font-bold" style={{ color: col.color }}>{col.label}</span>
                  <span className="text-[10px] font-manrope text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{colTasks.length}</span>
                </div>
                <button
                  onClick={() => { setAddingCol(col.id); setTimeout(() => inputRef.current?.focus(), 50); }}
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-muted/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Add task input */}
              {addingCol === col.id && (
                <div className="mb-2 bg-white dark:bg-card rounded-xl border border-[hsl(var(--border))] p-2.5 luxury-shadow">
                  <input
                    ref={inputRef}
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addTask(col.id); if (e.key === "Escape") { setAddingCol(null); setNewTaskTitle(""); } }}
                    placeholder="Task title..."
                    className="w-full text-xs font-manrope bg-transparent focus:outline-none text-ink dark:text-white"
                  />
                  <div className="flex gap-1.5 mt-2">
                    <button onClick={() => addTask(col.id)} className="px-2.5 py-1 rounded-lg text-[10px] font-manrope font-bold text-white" style={{ background: "#8B1A1A" }}>Add</button>
                    <button onClick={() => { setAddingCol(null); setNewTaskTitle(""); }} className="px-2.5 py-1 rounded-lg text-[10px] font-manrope text-muted-foreground hover:text-ink border border-[hsl(var(--border))]">Cancel</button>
                  </div>
                </div>
              )}

              {/* Task cards */}
              <div className="space-y-2 min-h-[120px]">
                {colTasks.length === 0 && !isOver && (
                  <div className="py-8 flex flex-col items-center justify-center opacity-30">
                    <Circle className="w-5 h-5 mb-1 text-muted-foreground" />
                    <p className="text-[10px] font-manrope text-muted-foreground">Drop tasks here</p>
                  </div>
                )}
                {colTasks.map(task => (
                  <TaskCard key={task.id} task={task} columns={COLUMNS}
                    onMove={moveTask} onDelete={deleteTask} onUpdate={updateTask}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone guide */}
      <div className="mt-5 bg-white dark:bg-card rounded-2xl border border-[hsl(var(--border))] p-5 luxury-shadow">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4" style={{ color: "#C9A84C" }} />
          <h3 className="font-playfair font-bold text-sm text-ink dark:text-white">Automated Milestone Triggers</h3>
          <span className="text-[10px] font-manrope text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Move task to "Done" to fire</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {MILESTONE_TRIGGERS.map(m => (
            <div key={m.match} className="p-3 rounded-xl" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)" }}>
              <p className="text-xs font-manrope font-bold text-ink dark:text-white leading-tight">{m.title}</p>
              <p className="text-[10px] font-manrope text-muted-foreground mt-0.5 leading-snug">{m.body.slice(0, 55)}…</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}