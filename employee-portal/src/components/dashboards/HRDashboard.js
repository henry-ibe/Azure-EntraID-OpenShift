// src/components/dashboards/HRDashboard.js
import React, { useState } from "react";
import DashboardShell from "./DashboardShell";

const COLOR = "#ec4899"; // pink

const employees = [
  { name: "Marcus IT", dept: "IT", status: "Active", joined: "Jan 2024" },
  { name: "Priya Engineer", dept: "Engineering", status: "Active", joined: "Mar 2023" },
  { name: "Sarah HR", dept: "HR", status: "Active", joined: "Jun 2022" },
  { name: "Admin User2", dept: "Admin", status: "Active", joined: "Nov 2021" },
];

const ptoRequests = [
  { name: "Marcus IT", dates: "Jun 24–26", days: 3, status: "pending" },
  { name: "Priya Engineer", dates: "Jul 1–5", days: 5, status: "pending" },
  { name: "Sarah HR", dates: "Jun 30", days: 1, status: "approved" },
];

export default function HRDashboard() {
  const [tab, setTab] = useState("overview");
  const navItems = [
    { key: "overview", label: "Overview", icon: "⊞" },
    { key: "employees", label: "Employees", icon: "◈" },
    { key: "pto", label: "PTO Requests", icon: "📋" },
    { key: "onboarding", label: "Onboarding", icon: "🪪" },
  ];

  return (
    <DashboardShell deptLabel="HR" deptColor={COLOR} navItems={navItems} activeTab={tab} setActiveTab={setTab}>
      {tab === "overview" && (
        <div className="tab-content">
          <div className="welcome-banner" style={{ background: `linear-gradient(135deg, ${COLOR}1f, ${COLOR}08)`, borderColor: COLOR + "33" }}>
            <div className="welcome-text">
              <div className="welcome-eyebrow" style={{ color: COLOR }}>HUMAN RESOURCES</div>
              <h2 className="welcome-name">Workforce Overview</h2>
              <div className="welcome-meta">
                <span className="meta-pill">4 Employees</span>
                <span className="meta-pill">2 Pending PTO</span>
                <span className="meta-pill">1 New Hire (30 days)</span>
              </div>
            </div>
            <div className="welcome-stats">
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>4</div><div className="stat-lbl">Headcount</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>2</div><div className="stat-lbl">Open PTO</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>98%</div><div className="stat-lbl">Retention</div></div>
            </div>
          </div>

          <div className="overview-grid">
            <div className="dash-card">
              <div className="card-header">
                <h3 className="card-title">Pending PTO Requests</h3>
                <span className="card-count" style={{ color: COLOR, background: COLOR + "14", borderColor: COLOR + "33" }}>
                  {ptoRequests.filter((p) => p.status === "pending").length}
                </span>
              </div>
              <div className="announcements-list">
                {ptoRequests.map((p, i) => (
                  <div key={i} className="announcement-item" style={{ borderLeft: p.status === "pending" ? `2px solid ${COLOR}` : "none" }}>
                    <div className="ann-tag" style={{ color: COLOR, background: COLOR + "14" }}>{p.days}D</div>
                    <div className="ann-body">
                      <div className="ann-title">{p.name} · {p.dates}</div>
                      <div className="ann-time">{p.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-card">
              <div className="card-header"><h3 className="card-title">Recent Hires</h3></div>
              <div className="announcements-list">
                <div className="announcement-item">
                  <div className="ann-tag" style={{ color: COLOR, background: COLOR + "14" }}>NEW</div>
                  <div className="ann-body">
                    <div className="ann-title">Priya Engineer joined Engineering</div>
                    <div className="ann-time">22 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "employees" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">Employee Directory</h3></div>
          <div className="dash-card">
            {employees.map((e, i) => (
              <div key={i} className="ticket-row" style={{ marginBottom: i < employees.length - 1 ? ".5rem" : 0 }}>
                <div className="ticket-id" style={{ color: COLOR }}>{e.dept}</div>
                <div className="ticket-body"><div className="ticket-title">{e.name}</div><div className="ticket-date">Joined {e.joined}</div></div>
                <div className="ticket-status open" style={{ background: COLOR + "14", color: COLOR }}>{e.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "pto" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">All PTO Requests</h3></div>
          <div className="dash-card">
            {ptoRequests.map((p, i) => (
              <div key={i} className="ticket-row" style={{ marginBottom: i < ptoRequests.length - 1 ? ".5rem" : 0 }}>
                <div className="ticket-id" style={{ color: COLOR }}>{p.days} day{p.days > 1 ? "s" : ""}</div>
                <div className="ticket-body"><div className="ticket-title">{p.name}</div><div className="ticket-date">{p.dates}</div></div>
                <div className={`ticket-status ${p.status === "approved" ? "resolved" : "open"}`} style={{ background: COLOR + "14", color: COLOR }}>{p.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "onboarding" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">Onboarding Pipeline</h3></div>
          <div className="dash-card">
            <div className="ann-body" style={{ padding: "1rem 0", textAlign: "center", color: "var(--text3)" }}>
              No active onboarding workflows.
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
