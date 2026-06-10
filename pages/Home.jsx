import React, { useState } from "react";
import AuthPage from "./AuthPage";
import Dashboard from "./Dashboard";

export default function Home() {
  const [role, setRole] = useState(null);

  if (!role) return <AuthPage onLogin={setRole} />;
  return <Dashboard role={role} onLogout={() => setRole(null)} />;
}