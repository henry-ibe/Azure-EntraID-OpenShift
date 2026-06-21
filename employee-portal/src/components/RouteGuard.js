// src/components/RouteGuard.js
import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { resolveDepartment } from "../rbacConfig";
import HRDashboard from "./dashboards/HRDashboard";
import ITDashboard from "./dashboards/ITDashboard";
import EngineeringDashboard from "./dashboards/EngineeringDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import AccessRestricted from "./AccessRestricted";

export default function RouteGuard() {
  const { accounts } = useMsal();
  const [department, setDepartment] = useState(undefined); // undefined = still checking
  const account = accounts[0];

  useEffect(() => {
    // MSAL attaches decoded ID token claims to the account object after login
    const claims = account?.idTokenClaims;
    const dept = resolveDepartment(claims);
    setDepartment(dept); // null if no matching group found
  }, [account]);

  if (department === undefined) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <div className="loading-text">Verifying access...</div>
      </div>
    );
  }

  switch (department) {
    case "HR":
      return <HRDashboard />;
    case "IT":
      return <ITDashboard />;
    case "ENGINEERING":
      return <EngineeringDashboard />;
    case "ADMIN":
      return <AdminDashboard />;
    default:
      return <AccessRestricted />;
  }
}
