// src/components/dashboards/AdminDashboard.js
import React, { useState } from "react";
import DashboardShell from "./DashboardShell";

const COLOR = "#f59e0b"; // amber

const allUsers = [
  { name: "Sarah HR", group: "Portal-HR", color: "#ec4899" },
  { name: "Marcus IT", group: "Portal-IT", color: "#22c55e" },
  { name: "Priya Engineer", group: "Portal-Engineering", color: "#6366f1" },
  { name: "Admin User2", group: "Portal-Admins", color: "#f59e0b" },
];

const deptSummary = [
  { dept: "HR", color: "#ec4899", users: 1, metric: "2 pending PTO" },
  { dept: "IT", color: "#22c55e", users: 1, metric: "3 open tickets" },
  { dept: "Engineering", color: "#6366f1", users: 1, metric: "Sprint 14 active" },
  { dept: "Admin", color: "#f59e0b", users: 1, metric: "Full access" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const navItems = [
    { key: "overview", label: "Overview", icon: "⊞" },
    { key: "users", label: "All Users", icon: "👥" },
    { key: "groups", label: "Azure AD Groups", icon: "🔐" },
    { key: "audit", label: "Audit Log", icon: "📜" },
  ];

  return (
    <DashboardShell deptLabel="Admin" deptColor={COLOR} navItems={navItems} activeTab={tab} setActiveTab={setTab}>
      {tab === "overview" && (
        <div className="tab-content">
          <div className="welcome-banner" style={{ background: `linear-gradient(135deg, ${COLOR}1f, ${COLOR}08)`, borderColor: COLOR + "33" }}>
            <div className="welcome-text">
              <div className="welcome-eyebrow" style={{ color: COLOR }}>SYSTEM ADMINISTRATOR</div>
              <h2 className="welcome-name">All Departments</h2>
              <div className="welcome-meta">
                <span className="meta-pill">4 Active Users</span>
                <span className="meta-pill">4 Security Groups</span>
                <span className="meta-pill">RBAC Enforced</span>
              </div>
            </div>
            <div className="welcome-stats">
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>4</div><div className="stat-lbl">Departments</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>4</div><div className="stat-lbl">Total Users</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>0</div><div className="stat-lbl">Access Denials</div></div>
            </div>
          </div>

          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">Department Summary</h3></div>
          <div className="team-grid" style={{ marginBottom: "1.5rem" }}>
            {deptSummary.map((d, i) => (
              <div key={i} className="team-card" style={{ borderColor: d.color + "33" }}>
                <div className="team-avatar-wrap">
                  <div className="team-avatar" style={{ background: d.color + "14", color: d.color, border: `1px solid ${d.color}44` }}>
                    {d.dept.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="team-name">{d.dept}</div>
                <div className="team-role">{d.users} user{d.users > 1 ? "s" : ""}</div>
                <div className="team-status" style={{ color: d.color }}>{d.metric}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">All Users Across Departments</h3></div>
          <div className="dash-card">
            {allUsers.map((u, i) => (
              <div key={i} className="ticket-row" style={{ marginBottom: i < allUsers.length - 1 ? ".5rem" : 0 }}>
                <div className="ticket-id" style={{ color: u.color }}>{u.group}</div>
                <div className="ticket-body"><div className="ticket-title">{u.name}</div></div>
                <div className="ticket-status open" style={{ background: u.color + "14", color: u.color }}>active</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "groups" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">Azure AD Security Groups</h3></div>
          <div className="dash-card">
            {deptSummary.map((d, i) => (
              <div key={i} className="ticket-row" style={{ marginBottom: i < deptSummary.length - 1 ? ".5rem" : 0 }}>
                <div className="ticket-id" style={{ color: d.color }}>Portal-{d.dept}</div>
                <div className="ticket-body"><div className="ticket-title">{d.users} member{d.users > 1 ? "s" : ""}</div><div className="ticket-date">Security group</div></div>
                <div className="ticket-status resolved" style={{ background: d.color + "14", color: d.color }}>synced</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">Recent Login Activity</h3></div>
          <div className="dash-card">
            <div className="ann-body" style={{ padding: "1rem 0", textAlign: "center", color: "var(--text3)" }}>
              Audit logging not yet wired to this demo — would pull from Azure AD Sign-in logs in production.
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
