// src/authConfig.js
// These values are injected via OpenShift ConfigMap / environment variables
// For local dev, create a .env file with these values

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID || "YOUR_CLIENT_ID",
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID || "YOUR_TENANT_ID"}`,
    redirectUri: process.env.REACT_APP_REDIRECT_URI || "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// Scopes for Microsoft Graph — reads user profile
export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

// Graph API endpoint to get user profile
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
