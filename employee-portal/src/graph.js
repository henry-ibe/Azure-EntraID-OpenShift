// src/graph.js
// Calls Microsoft Graph API to get the logged-in user's real profile

import { graphConfig } from "./authConfig";

export async function callMsGraph(accessToken) {
  const response = await fetch(graphConfig.graphMeEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile from Microsoft Graph");
  }

  return response.json();
}

// Graph returns fields like:
// displayName, mail, userPrincipalName, jobTitle, department, officeLocation, mobilePhone
