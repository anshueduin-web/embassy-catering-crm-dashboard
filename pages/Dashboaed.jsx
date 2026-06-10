import React, { useState, useEffect } from "react";
import Sidebar from "../components/embassy/Sidebar";
import MobileDrawer from "../components/embassy/MobileDrawer";
import TopNavbar from "../components/embassy/TopNavbar";
import OverviewDashboard from "./OverviewDashboard";
import SalesPipeline from "./SalesPipeline";
import AnalyticsDashboard from "./AnalyticsDashboard";
import EventCalendar from "./EventCalendar";
import LeadDetail from "./LeadDetail";
import ClientProfile from "./ClientProfile";
import ClientsPage from "./ClientsPage";
import FloorPlanner from "./FloorPlanner";
import Invoicing from "./Invoicing";
import MenuBuilder from "./MenuBuilder";
import EventTaskBoard from "./EventTaskBoard";
import BudgetDashboard from "./BudgetDashboard";
import { roleUsers } from "../components/embassy/data";
import {
  LayoutDashboard, Briefcase, BarChart3, Calendar, Users,
  LayoutTemplate, FileText, ChefHat, KanbanSquare, TrendingUp,
  UserCircle, Menu
} from "lucide-react";

const MOBILE_NAV = [
  { id: "overview",    label: "Home",     icon: LayoutDashboard, roles: ["admin","sales","customer"] },
  { id: "pipeline",    label: "Pipeline", icon: Briefcase,       roles: ["admin","sales"] },
  { id: "calendar",   label: "Events",   icon: Calendar,        roles: ["admin","sales","customer"] },
  { id: "invoicing",  label: "Invoices", icon: FileText,        roles: ["admin","sales"] },
  { id: "profile",    label: "Profile",  icon: UserCircle,      roles: ["admin","sales","customer"] },
];

export default function Dashboard({ role, onLogout }) {
  const [activePage, setActivePage] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sidebarWidth = collapsed ? 72 : 260;
  const user = roleUsers[role] || roleUsers.admin;
  const mobileNav = MOBILE_NAV.filter(n => n.roles.includes(role));

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (activePage) {
      case "overview":    return <OverviewDashboard />;
      case "pipeline":    return <SalesPipeline />;
      case "analytics":   return <AnalyticsDashboard />;
      case "calendar":    return <EventCalendar />;
      case "clients":     return <ClientsPage onSelectClient={() => navigate("profile")} />;
      case "floorplan":   return <FloorPlanner />;
      case "invoicing":   return <Invoicing />;
      case "menubuilder": return <MenuBuilder />;
      case "taskboard":   return <EventTaskBoard />;
      case "budget":      return <BudgetDashboard />;
      case "lead":        return <LeadDetail onBack={() => navigate("pipeline")} />;
      case "profile":     return <ClientProfile />;
      default:            return <OverviewDashboard />;
    }
  };

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F0E8D8 100%)" }}
      >
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #8B1A1A, #5C1111)", animation: "breathe 1.5s ease-in-out infinite" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="h-0.5 w-32 mx-auto rounded-full overflow-hidden bg-grey">
            <div className="h-full" style={{ background: "linear-gradient(90deg, #8B1A1A, #C9A84C)", animation: "shimmerLoad 1s ease-out forwards", width: "100%" }} />
          </div>
          <p className="text-xs font-manrope text-muted-foreground mt-3 tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`} style={{ background: darkMode ? "hsl(var(--background))" : "#FAF7F2" }}>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activePage={activePage}
          onNavigate={navigate}
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          role={role}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Drawer (full nav with all pages) */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activePage={activePage}
        onNavigate={navigate}
        role={role}
        onLogout={onLogout}
      />

      {/* Mobile Top Header */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
        style={{
          background: "rgba(250,247,242,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(229,229,229,0.7)",
          boxShadow: "0 2px 12px rgba(139,26,26,0.06)",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
          style={{ background: "rgba(139,26,26,0.08)", color: "#8B1A1A" }}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center">
          <p className="font-playfair font-bold text-sm text-ink leading-none">The Embassy</p>
          <p className="text-[9px] font-manrope text-muted-foreground tracking-widest uppercase mt-0.5">Command Center</p>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(d => !d)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
          style={{ background: darkMode ? "rgba(201,168,76,0.15)" : "rgba(0,0,0,0.06)", color: darkMode ? "#C9A84C" : "#666" }}
        >
          <span className="text-base">{darkMode ? "☀️" : "🌙"}</span>
        </button>
      </header>

      {/* Desktop TopNavbar */}
      <div className="hidden md:block">
        <TopNavbar
          sidebarWidth={sidebarWidth}
          activePage={activePage}
          user={user}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)}
        />
      </div>

      {/* Main content */}
      <main
        className="transition-all duration-300"
        style={{
          marginLeft: 0,
          paddingTop: 56, // mobile header height
        }}
      >
        {/* Desktop margin adjustment */}
        <div
          className="hidden md:block"
          style={{ marginLeft: sidebarWidth, marginTop: 0, paddingTop: 0 }}
        />
        <div
          className="md:hidden"
        />
        <div
          className="md:pl-0 pb-20 md:pb-8"
          style={{ marginLeft: 0 }}
        >
          {/* Desktop layout with sidebar margin */}
          <div className="hidden md:block" style={{ marginLeft: sidebarWidth, paddingTop: 64 }}>
            <div className="p-5 md:p-8 max-w-[1680px] mx-auto">
              {renderPage()}
            </div>
          </div>
          {/* Mobile layout */}
          <div className="md:hidden p-4 pt-3 max-w-full overflow-x-hidden">
            {renderPage()}
          </div>
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(229,229,229,0.8)",
          boxShadow: "0 -4px 24px rgba(139,26,26,0.06)",
        }}
      >
        <div className="flex items-center justify-around px-1 py-1 safe-area-bottom">
          {/* All nav button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl min-w-[52px] transition-all active:scale-95"
            style={{ color: "var(--muted-foreground)" }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-0.5" style={{ background: "rgba(139,26,26,0.08)" }}>
              <Menu className="w-4 h-4" style={{ color: "#8B1A1A" }} />
            </div>
            <span className="text-[9px] font-manrope font-semibold" style={{ color: "#8B1A1A" }}>All</span>
          </button>

          {mobileNav.map(item => {
            const active = activePage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl min-w-[52px] transition-all active:scale-95"
                style={{ color: active ? "#8B1A1A" : "var(--muted-foreground)" }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center mb-0.5 transition-all"
                  style={{
                    background: active ? "rgba(139,26,26,0.12)" : "transparent",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-manrope font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}