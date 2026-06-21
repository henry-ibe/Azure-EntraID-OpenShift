// src/components/dashboards/DashboardShell.js
import React from "react";
import { useMsal } from "@azure/msal-react";

export default function DashboardShell({ deptLabel, deptColor, navItems, activeTab, setActiveTab, children }) {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const name = account?.name || "Employee";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dash-root">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo-icon">⬡</span>
          <span className="sidebar-brand-name">NEXUS CORP</span>
        </div>

        <div
          className="dept-tag"
          style={{ color: deptColor, borderColor: deptColor + "33", background: deptColor + "14" }}
        >
          {deptLabel.toUpperCase()} PORTAL
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeTab === item.key ? "active" : ""}`}
              onClick={() => setActiveTab(item.key)}
              style={activeTab === item.key ? { background: deptColor + "1a", color: deptColor, borderColor: deptColor + "33", border: "1px solid" } : {}}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar" style={{ background: `linear-gradient(135deg, ${deptColor}, ${deptColor}aa)` }}>
              {initials}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{name.split(" ")[0]}</div>
              <div className="sidebar-user-role">{deptLabel}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>↪</span> Sign out
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <div className="dash-header-left">
            <div className="dash-greeting">
              {greeting()}, <strong style={{ color: deptColor }}>{name.split(" ")[0]}</strong>
            </div>
            <div className="dash-date">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div className="dash-header-right">
            <div
              className="header-badge"
              style={{ color: deptColor, background: deptColor + "14", borderColor: deptColor + "33" }}
            >
              <span className="badge-dot" style={{ background: deptColor }} />
              Azure AD · {deptLabel} Group
            </div>
            <div className="header-avatar" style={{ background: `linear-gradient(135deg, ${deptColor}, ${deptColor}aa)` }}>
              {initials}
            </div>
          </div>
        </header>

        <div className="dash-content">{children}</div>
      </main>
    </div>
  );
}
