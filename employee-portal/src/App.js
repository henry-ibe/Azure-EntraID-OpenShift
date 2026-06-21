// src/App.js
import React from "react";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import LoginPage from "./components/LoginPage";
import RouteGuard from "./components/RouteGuard";
import "./App.css";

const msalInstance = new PublicClientApplication(msalConfig);

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      {/* RouteGuard reads Azure AD group claims from the token and renders
          the correct department dashboard, or an Access Restricted page
          if the user has no recognized group membership. */}
      <AuthenticatedTemplate>
        <RouteGuard />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <LoginPage />
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}
