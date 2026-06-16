// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "../graph";

export default function Dashboard() {
  const { instance, accounts } = useMsal();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const account = accounts[0];

  // Fetch real user profile from Microsoft Graph
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account,
        });
        const data = await callMsGraph(response.accessToken);
        setProfile(data);
      } catch (e) {
        // Token expired — re-authenticate
        instance.acquireTokenRedirect({ ...loginRequest, account });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [instance, account]);

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });
  };

  const displayName = profile?.displayName || account?.name || "Employee";
  const email = profile?.mail || profile?.userPrincipalName || account?.username || "";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const jobTitle = profile?.jobTitle || "Employee";
  const department = profile?.department || "Nexus Corp";
  const officeLocation = profile?.officeLocation || "Remote";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const tabs = ["overview", "profile", "team", "it support"];

  if (loading) return <LoadingScreen />;

  return (
    <div className="dash-root">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo-icon">⬡</span>
          <span className="sidebar-brand-name">NEXUS CORP</span>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`nav-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="nav-icon">{navIcons[tab]}</span>
              <span className="nav-label">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{displayName.split(" ")[0]}</div>
              <div className="sidebar-user-role">{jobTitle}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>↪</span> Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        {/* TOP BAR */}
        <header className="dash-header">
          <div className="dash-header-left">
            <div className="dash-greeting">{greeting()}, <strong>{displayName.split(" ")[0]}</strong></div>
            <div className="dash-date">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
          </div>
          <div className="dash-header-right">
            <div className="header-badge">
              <span className="badge-dot" />
              Azure AD Authenticated
            </div>
            <div className="header-avatar">{initials}</div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="dash-content">
          {activeTab === "overview" && <OverviewTab name={displayName} dept={department} title={jobTitle} email={email} location={officeLocation} />}
          {activeTab === "profile" && <ProfileTab profile={profile} name={displayName} email={email} title={jobTitle} dept={department} location={officeLocation} initials={initials} />}
          {activeTab === "team" && <TeamTab dept={department} />}
          {activeTab === "it support" && <ITTab />}
        </div>
      </main>
    </div>
  );
}

// ─── OVERVIEW TAB ──────────────────────────────────────────────────────────
function OverviewTab({ name, dept, title, email, location }) {
  const announcements = [
    { tag: "HR", title: "Open Enrollment closes Nov 15", time: "2 days ago", urgent: true },
    { tag: "IT", title: "Planned maintenance this Saturday 2–4 AM EST", time: "5 hours ago", urgent: false },
    { tag: "ALL", title: "Q3 All-Hands recording now available", time: "1 day ago", urgent: false },
    { tag: "SECURITY", title: "Mandatory security training due Nov 30", time: "3 days ago", urgent: true },
  ];

  const quickLinks = [
    { icon: "📋", label: "Submit PTO Request", desc: "Workday" },
    { icon: "💻", label: "IT Help Desk", desc: "Submit a ticket" },
    { icon: "📁", label: "Company Drive", desc: "SharePoint" },
    { icon: "👥", label: "Employee Directory", desc: "Find colleagues" },
    { icon: "💰", label: "Benefits Portal", desc: "View your benefits" },
    { icon: "📊", label: "Performance Review", desc: "Q4 cycle open" },
  ];

  return (
    <div className="tab-content">
      {/* Welcome banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="welcome-eyebrow">EMPLOYEE DASHBOARD</div>
          <h2 className="welcome-name">Welcome back, {name.split(" ")[0]}.</h2>
          <div className="welcome-meta">
            <span className="meta-pill">{title}</span>
            <span className="meta-pill">{dept}</span>
            <span className="meta-pill">{location}</span>
          </div>
        </div>
        <div className="welcome-stats">
          <div className="stat-card">
            <div className="stat-val">12</div>
            <div className="stat-lbl">Days PTO Left</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">3</div>
            <div className="stat-lbl">Open Tickets</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">Q4</div>
            <div className="stat-lbl">Review Cycle</div>
          </div>
        </div>
      </div>

      <div className="overview-grid">
        {/* Announcements */}
        <div className="dash-card announcements-card">
          <div className="card-header">
            <h3 className="card-title">Announcements</h3>
            <span className="card-count">{announcements.length}</span>
          </div>
          <div className="announcements-list">
            {announcements.map((a, i) => (
              <div key={i} className={`announcement-item ${a.urgent ? "urgent" : ""}`}>
                <div className="ann-tag">{a.tag}</div>
                <div className="ann-body">
                  <div className="ann-title">{a.title}</div>
                  <div className="ann-time">{a.time}</div>
                </div>
                {a.urgent && <div className="ann-urgent-dot" />}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="dash-card">
          <div className="card-header">
            <h3 className="card-title">Quick Access</h3>
          </div>
          <div className="quick-links-grid">
            {quickLinks.map((l, i) => (
              <button key={i} className="quick-link">
                <span className="ql-icon">{l.icon}</span>
                <span className="ql-label">{l.label}</span>
                <span className="ql-desc">{l.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE TAB ───────────────────────────────────────────────────────────
function ProfileTab({ profile, name, email, title, dept, location, initials }) {
  const fields = [
    { label: "Display Name", value: name },
    { label: "Email", value: email },
    { label: "Job Title", value: title || "—" },
    { label: "Department", value: dept || "—" },
    { label: "Office Location", value: location || "—" },
    { label: "Mobile", value: profile?.mobilePhone || "—" },
  ];

  return (
    <div className="tab-content">
      <div className="profile-layout">
        <div className="profile-card-main">
          <div className="profile-avatar-large">{initials}</div>
          <div className="profile-name-large">{name}</div>
          <div className="profile-title-large">{title}</div>
          <div className="profile-dept">{dept}</div>
          <div className="azure-badge">
            <MicrosoftLogoSmall />
            Identity verified via Azure AD
          </div>
        </div>

        <div className="profile-details">
          <div className="card-header" style={{ marginBottom: "1.25rem" }}>
            <h3 className="card-title">Profile Information</h3>
            <span style={{ fontSize: ".7rem", color: "#888", letterSpacing: ".08em" }}>SOURCE: MICROSOFT GRAPH API</span>
          </div>
          <div className="profile-fields">
            {fields.map((f) => (
              <div className="profile-field" key={f.label}>
                <div className="field-label">{f.label}</div>
                <div className="field-value">{f.value}</div>
              </div>
            ))}
          </div>
          <div className="profile-token-note">
            ✓ All data pulled live from your Azure AD token via Microsoft Graph API
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TEAM TAB ──────────────────────────────────────────────────────────────
function TeamTab({ dept }) {
  const teammates = [
    { name: "Sarah Chen", role: "Engineering Manager", status: "online", initials: "SC" },
    { name: "Marcus Webb", role: "Senior Engineer", status: "online", initials: "MW" },
    { name: "Priya Nair", role: "DevOps Engineer", status: "away", initials: "PN" },
    { name: "Jordan Ellis", role: "Product Manager", status: "online", initials: "JE" },
    { name: "Alex Rivera", role: "UI/UX Designer", status: "offline", initials: "AR" },
    { name: "Taylor Kim", role: "QA Engineer", status: "away", initials: "TK" },
  ];

  return (
    <div className="tab-content">
      <div className="card-header" style={{ marginBottom: "1.25rem" }}>
        <h3 className="card-title">Your Team</h3>
        <span className="card-count">{teammates.length}</span>
      </div>
      <div className="team-grid">
        {teammates.map((t, i) => (
          <div key={i} className="team-card">
            <div className="team-avatar-wrap">
              <div className="team-avatar">{t.initials}</div>
              <div className={`status-dot ${t.status}`} />
            </div>
            <div className="team-name">{t.name}</div>
            <div className="team-role">{t.role}</div>
            <div className={`team-status ${t.status}`}>{t.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── IT SUPPORT TAB ────────────────────────────────────────────────────────
function ITTab() {
  const tickets = [
    { id: "INC-4821", title: "VPN access issue", status: "open", priority: "high", date: "Nov 12" },
    { id: "INC-4756", title: "Software license request - VS Code", status: "resolved", priority: "low", date: "Nov 8" },
    { id: "INC-4701", title: "Monitor not detected", status: "in progress", priority: "medium", date: "Nov 5" },
  ];

  return (
    <div className="tab-content">
      <div className="it-layout">
        <div className="dash-card">
          <div className="card-header">
            <h3 className="card-title">My Tickets</h3>
            <button className="new-ticket-btn">+ New Ticket</button>
          </div>
          <div className="tickets-list">
            {tickets.map((t) => (
              <div key={t.id} className="ticket-row">
                <div className="ticket-id">{t.id}</div>
                <div className="ticket-body">
                  <div className="ticket-title">{t.title}</div>
                  <div className="ticket-date">{t.date}</div>
                </div>
                <div className={`ticket-priority ${t.priority}`}>{t.priority}</div>
                <div className={`ticket-status ${t.status.replace(" ", "-")}`}>{t.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="card-header"><h3 className="card-title">IT Resources</h3></div>
          <div className="it-resources">
            {[
              { icon: "🔑", title: "Password Reset", desc: "Reset your corporate password" },
              { icon: "📱", title: "MFA Setup", desc: "Configure multi-factor auth" },
              { icon: "🖥️", title: "Software Catalog", desc: "Request approved software" },
              { icon: "🔒", title: "VPN Guide", desc: "Connect from home securely" },
            ].map((r, i) => (
              <div key={i} className="it-resource">
                <span className="it-icon">{r.icon}</span>
                <div><div className="it-res-title">{r.title}</div><div className="it-res-desc">{r.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <div className="loading-text">Loading your workspace...</div>
    </div>
  );
}

function MicrosoftLogoSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 21 21" fill="none" style={{ flexShrink: 0 }}>
      <rect x="0" y="0" width="10" height="10" fill="#F25022" />
      <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
      <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
      <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

const navIcons = {
  overview: "⊞",
  profile: "◉",
  team: "◈",
  "it support": "⚙",
};
