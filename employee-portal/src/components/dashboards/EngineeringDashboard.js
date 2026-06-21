// src/components/dashboards/EngineeringDashboard.js
import React, { useState } from "react";
import DashboardShell from "./DashboardShell";

const COLOR = "#6366f1"; // indigo

const sprintItems = [
  { title: "Wire MSAL group claims into route guard", status: "done" },
  { title: "Build 4 department dashboards", status: "in progress" },
  { title: "Dockerize employee-portal", status: "todo" },
  { title: "Deploy to OpenShift CRC", status: "todo" },
];

const deploys = [
  { env: "production", version: "v1.4.2", status: "live", time: "2h ago" },
  { env: "staging", version: "v1.5.0-rc1", status: "live", time: "20m ago" },
];

export default function EngineeringDashboard() {
  const [tab, setTab] = useState("overview");
  const navItems = [
    { key: "overview", label: "Overview", icon: "⊞" },
    { key: "sprint", label: "Sprint Board", icon: "📌" },
    { key: "deploys", label: "Deployments", icon: "🚀" },
    { key: "oncall", label: "On-Call", icon: "📟" },
  ];

  return (
    <DashboardShell deptLabel="Engineering" deptColor={COLOR} navItems={navItems} activeTab={tab} setActiveTab={setTab}>
      {tab === "overview" && (
        <div className="tab-content">
          <div className="welcome-banner" style={{ background: `linear-gradient(135deg, ${COLOR}1f, ${COLOR}08)`, borderColor: COLOR + "33" }}>
            <div className="welcome-text">
              <div className="welcome-eyebrow" style={{ color: COLOR }}>ENGINEERING</div>
              <h2 className="welcome-name">Sprint 14 — In Progress</h2>
              <div className="welcome-meta">
                <span className="meta-pill">2 In Progress</span>
                <span className="meta-pill">2 Todo</span>
                <span className="meta-pill">Staging Deployed</span>
              </div>
            </div>
            <div className="welcome-stats">
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>4</div><div className="stat-lbl">Sprint Items</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>2</div><div className="stat-lbl">Live Envs</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>0</div><div className="stat-lbl">Incidents</div></div>
            </div>
          </div>

          <div className="overview-grid">
            <div className="dash-card">
              <div className="card-header">
                <h3 className="card-title">Sprint Board</h3>
                <span className="card-count" style={{ color: COLOR, background: COLOR + "14", borderColor: COLOR + "33" }}>{sprintItems.length}</span>
              </div>
              <div className="announcements-list">
                {sprintItems.map((s, i) => (
                  <div key={i} className="announcement-item">
                    <div className="ann-tag" style={{ color: COLOR, background: COLOR + "14" }}>{s.status.toUpperCase()}</div>
                    <div className="ann-body"><div className="ann-title">{s.title}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-card">
              <div className="card-header"><h3 className="card-title">Recent Deployments</h3></div>
              <div className="tickets-list">
                {deploys.map((d, i) => (
                  <div key={i} className="ticket-row">
                    <div className="ticket-id">{d.env}</div>
                    <div className="ticket-body"><div className="ticket-title">{d.version}</div><div className="ticket-date">{d.time}</div></div>
                    <div className="ticket-status resolved" style={{ background: COLOR + "14", color: COLOR }}>{d.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "sprint" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">Sprint 14 Board</h3></div>
          <div className="dash-card">
            <div className="announcements-list">
              {sprintItems.map((s, i) => (
                <div key={i} className="announcement-item">
                  <div className="ann-tag" style={{ color: COLOR, background: COLOR + "14" }}>{s.status.toUpperCase()}</div>
                  <div className="ann-body"><div className="ann-title">{s.title}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "deploys" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">Deployment History</h3></div>
          <div className="dash-card">
            <div className="tickets-list">
              {deploys.map((d, i) => (
                <div key={i} className="ticket-row">
                  <div className="ticket-id">{d.env}</div>
                  <div className="ticket-body"><div className="ticket-title">{d.version}</div><div className="ticket-date">{d.time}</div></div>
                  <div className="ticket-status resolved" style={{ background: COLOR + "14", color: COLOR }}>{d.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "oncall" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">On-Call Schedule</h3></div>
          <div className="dash-card">
            <div className="ann-body" style={{ padding: "1rem 0", textAlign: "center", color: "var(--text3)" }}>
              Priya Engineer is on-call this week.
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
