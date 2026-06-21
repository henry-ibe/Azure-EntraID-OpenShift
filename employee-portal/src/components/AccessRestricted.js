// src/components/AccessRestricted.js
import React from "react";
import { useMsal } from "@azure/msal-react";

export default function AccessRestricted() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  const handleLogout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });
  };

  return (
    <div className="restricted-root">
      <div className="restricted-card">
        <div className="restricted-icon">⊘</div>
        <div className="restricted-eyebrow">ACCESS RESTRICTED</div>
        <h1 className="restricted-title">You don't have access to a department portal</h1>
        <p className="restricted-sub">
          Your account <strong>{account?.username}</strong> is signed in successfully,
          but isn't assigned to a recognized department group in Microsoft Entra ID.
        </p>
        <div className="restricted-detail">
          <div className="detail-row">
            <span className="detail-label">Signed in as</span>
            <span className="detail-value">{account?.name || "Unknown"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-value status-denied">No department group assigned</span>
          </div>
        </div>
        <p className="restricted-help">
          If you believe this is an error, contact your IT administrator to be added
          to the correct Azure AD security group.
        </p>
        <button className="restricted-logout" onClick={handleLogout}>
          ↪ Sign out and try a different account
        </button>
      </div>
    </div>
  );
}
