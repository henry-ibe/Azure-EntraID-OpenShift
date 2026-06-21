// src/components/dashboards/ITDashboard.js
import React, { useState } from "react";
import DashboardShell from "./DashboardShell";

const COLOR = "#22c55e"; // green

const tickets = [
  { id: "INC-4821", title: "VPN access issue — Sarah HR", status: "open", priority: "high" },
  { id: "INC-4818", title: "New laptop request — Priya Engineer", status: "in progress", priority: "medium" },
  { id: "INC-4801", title: "Password reset — Admin User2", status: "resolved", priority: "low" },
];

const systems = [
  { name: "Identity Provider (Entra ID)", status: "operational" },
  { name: "OpenShift Cluster", status: "operational" },
  { name: "Email / Exchange", status: "operational" },
  { name: "VPN Gateway", status: "degraded" },
];

export default function ITDashboard() {
  const [tab, setTab] = useState("overview");
  const navItems = [
    { key: "overview", label: "Overview", icon: "⊞" },
    { key: "tickets", label: "Ticket Queue", icon: "🎫" },
    { key: "systems", label: "System Status", icon: "📡" },
    { key: "assets", label: "Asset Inventory", icon: "🖥️" },
  ];

  return (
    <DashboardShell deptLabel="IT" deptColor={COLOR} navItems={navItems} activeTab={tab} setActiveTab={setTab}>
      {tab === "overview" && (
        <div className="tab-content">
          <div className="welcome-banner" style={{ background: `linear-gradient(135deg, ${COLOR}1f, ${COLOR}08)`, borderColor: COLOR + "33" }}>
            <div className="welcome-text">
              <div className="welcome-eyebrow" style={{ color: COLOR }}>INFORMATION TECHNOLOGY</div>
              <h2 className="welcome-name">Support Operations</h2>
              <div className="welcome-meta">
                <span className="meta-pill">3 Open Tickets</span>
                <span className="meta-pill">1 Degraded System</span>
                <span className="meta-pill">12 Assets Tracked</span>
              </div>
            </div>
            <div className="welcome-stats">
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>3</div><div className="stat-lbl">Open Tickets</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: COLOR }}>99.8%</div><div className="stat-lbl">Uptime</div></div>
              <div className="stat-card"><div className="stat-val" style={{ color: "#f59e0b" }}>1</div><div className="stat-lbl">Alert</div></div>
            </div>
          </div>

          <div className="overview-grid">
            <div className="dash-card">
              <div className="card-header">
                <h3 className="card-title">Recent Tickets</h3>
                <span className="card-count" style={{ color: COLOR, background: COLOR + "14", borderColor: COLOR + "33" }}>{tickets.length}</span>
              </div>
              <div className="tickets-list">
                {tickets.map((t) => (
                  <div key={t.id} className="ticket-row">
                    <div className="ticket-id">{t.id}</div>
                    <div className="ticket-body"><div className="ticket-title">{t.title}</div></div>
                    <div className={`ticket-priority ${t.priority}`}>{t.priority}</div>
                    <div className={`ticket-status ${t.status.replace(" ", "-")}`} style={{ background: COLOR + "14", color: COLOR }}>{t.status}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-card">
              <div className="card-header"><h3 className="card-title">System Status</h3></div>
              <div className="it-resources">
                {systems.map((s, i) => (
                  <div key={i} className="it-resource">
                    <span className="status-dot-inline" style={{ background: s.status === "operational" ? COLOR : "#f59e0b" }} />
                    <div>
                      <div className="it-res-title">{s.name}</div>
                      <div className="it-res-desc" style={{ color: s.status === "operational" ? COLOR : "#f59e0b" }}>{s.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "tickets" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">Full Ticket Queue</h3></div>
          <div className="dash-card">
            <div className="tickets-list">
              {tickets.map((t) => (
                <div key={t.id} className="ticket-row">
                  <div className="ticket-id">{t.id}</div>
                  <div className="ticket-body"><div className="ticket-title">{t.title}</div></div>
                  <div className={`ticket-priority ${t.priority}`}>{t.priority}</div>
                  <div className={`ticket-status ${t.status.replace(" ", "-")}`} style={{ background: COLOR + "14", color: COLOR }}>{t.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "systems" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">Infrastructure Health</h3></div>
          <div className="dash-card">
            <div className="it-resources">
              {systems.map((s, i) => (
                <div key={i} className="it-resource">
                  <span className="status-dot-inline" style={{ background: s.status === "operational" ? COLOR : "#f59e0b" }} />
                  <div><div className="it-res-title">{s.name}</div><div className="it-res-desc">{s.status}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "assets" && (
        <div className="tab-content">
          <div className="card-header" style={{ marginBottom: "1rem" }}><h3 className="card-title">Asset Inventory</h3></div>
          <div className="dash-card">
            <div className="ann-body" style={{ padding: "1rem 0", textAlign: "center", color: "var(--text3)" }}>
              12 devices tracked · Last audit 14 days ago
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
