// src/components/LoginPage.js
import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

export default function LoginPage() {
  const { instance } = useMsal();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await instance.loginRedirect(loginRequest);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Background grid */}
      <div className="login-bg-grid" />

      {/* Left accent bar */}
      <div className="login-accent" />

      <div className="login-card">
        {/* Company branding */}
        <div className="login-brand">
          <div className="login-logo">
            <span className="login-logo-icon">⬡</span>
          </div>
          <div>
            <div className="login-company">NEXUS CORP</div>
            <div className="login-tagline">Enterprise Employee Portal</div>
          </div>
        </div>

        <div className="login-divider" />

        <div className="login-body">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">
            Sign in with your corporate Microsoft account to access the employee portal.
          </p>

          <button
            className={`login-btn ${loading ? "loading" : ""}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" />
                Redirecting to Microsoft...
              </>
            ) : (
              <>
                <MicrosoftIcon />
                Sign in with Microsoft
              </>
            )}
          </button>

          <p className="login-notice">
            🔒 Secured by Microsoft Azure Active Directory.
            <br />
            Your credentials are never stored by this application.
          </p>
        </div>

        <div className="login-footer">
          <span>Nexus Corp IT</span>
          <span>·</span>
          <span>Security Policy</span>
          <span>·</span>
          <span>Support</span>
        </div>
      </div>

      {/* Right side visual */}
      <div className="login-visual">
        <div className="login-visual-content">
          <div className="visual-badge">EMPLOYEE PORTAL v2.0</div>
          <h2 className="visual-title">
            Your workspace,<br />
            <span className="visual-accent">everywhere.</span>
          </h2>
          <p className="visual-sub">
            Access HR, IT resources, team directories, and company announcements — all in one place.
          </p>
          <div className="visual-features">
            {["Single Sign-On via Azure AD", "Role-based access control", "Deployed on OpenShift", "Zero-trust security"].map((f) => (
              <div className="visual-feature" key={f}>
                <span className="feature-check">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          {/* Decorative orbs */}
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
        </div>
      </div>
    </div>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none" style={{ flexShrink: 0 }}>
      <rect x="0" y="0" width="10" height="10" fill="#F25022" />
      <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
      <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
      <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}
