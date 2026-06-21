# Nexus Corp Employee Portal
> React + Azure Entra ID + OpenShift · Portfolio Project

A production-grade employee portal demonstrating **OpenShift deployment** with **Azure Active Directory authentication** via MSAL.js and the Microsoft Graph API.

---

## Architecture

```
User Browser
    ↓
OpenShift Route (HTTPS/TLS)
    ↓
OpenShift Service → Pod (React + nginx)
    ↓  [login click]
Azure Entra ID (Microsoft login)
    ↓  [OAuth2 redirect back]
Microsoft Graph API → Real user profile
    ↓
Dashboard with live name, email, title, department
```

---

## Phase 1 — Azure Setup

1. Go to **portal.azure.com** → Azure Active Directory → App Registrations → **New Registration**
2. Name: `employee-portal`
3. Supported account types: **Single tenant**
4. Redirect URI: `http://localhost:3000` (add your OpenShift route URL later)
5. After creation, note:
   - **Application (client) ID** → `REACT_APP_AZURE_CLIENT_ID`
   - **Directory (tenant) ID** → `REACT_APP_AZURE_TENANT_ID`
6. Go to **Certificates & secrets** → New client secret → copy value → `REACT_APP_AZURE_CLIENT_SECRET`
7. Go to **API permissions** → Add `User.Read` (Microsoft Graph) → Grant admin consent

---

## Phase 2 — Local Development

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/employee-portal
cd employee-portal
npm install --legacy-peer-deps

# Configure environment
cp .env.example .env
# Fill in your Azure values in .env

# Run locally
npm start
# → http://localhost:3000
```

---

## Phase 3 — Docker Build

```bash
# Build the image
docker build -t employee-portal:latest .

# Test locally
docker run -p 8080:8080 \
  -e REACT_APP_AZURE_CLIENT_ID=your-client-id \
  -e REACT_APP_AZURE_TENANT_ID=your-tenant-id \
  -e REACT_APP_REDIRECT_URI=http://localhost:8080 \
  employee-portal:latest

# Push to registry
docker tag employee-portal:latest quay.io/YOUR_USERNAME/employee-portal:latest
docker push quay.io/YOUR_USERNAME/employee-portal:latest
```

---

## Phase 4 — OpenShift Deployment

```bash
# Login to OpenShift
oc login --token=YOUR_TOKEN --server=YOUR_SERVER

# Create project
oc new-project employee-portal

# Edit openshift-deploy.yaml:
# - Replace YOUR_REGISTRY with your image registry
# - Replace YOUR_TENANT_ID, YOUR_CLIENT_ID with real values
# - Replace YOUR_CLUSTER_DOMAIN with your OpenShift cluster domain

# Deploy everything
oc apply -f openshift-deploy.yaml

# Get your live route URL
oc get route employee-portal -n employee-portal

# Watch pods come up
oc get pods -n employee-portal -w
```

---

## Phase 5 — Wire Azure Redirect URI

1. Go back to Azure Portal → your App Registration
2. **Authentication** → Add redirect URI
3. Add: `https://employee-portal.apps.YOUR_CLUSTER_DOMAIN`
4. Save — authentication now works on OpenShift

---

## What the Video Shows

| Step | What happens |
|------|-------------|
| 1 | Hit the OpenShift route URL → Login gate appears |
| 2 | Click "Sign in with Microsoft" |
| 3 | Microsoft Azure login page (real Microsoft UI) |
| 4 | Enter Azure AD credentials |
| 5 | Redirected back to app |
| 6 | Dashboard loads with **real name, email, title, department** from Azure token |

---

## OpenShift Resources Created

| Resource | Name | Purpose |
|----------|------|---------|
| Project | `employee-portal` | Namespace |
| ConfigMap | `portal-config` | Tenant ID, redirect URI |
| Secret | `portal-secret` | Client ID (sensitive) |
| Deployment | `employee-portal` | Runs the React app |
| Service | `employee-portal` | Internal routing |
| Route | `employee-portal` | HTTPS external access |

---

## Tech Stack

- **React 18** + MSAL.js v3 (Microsoft Authentication Library)
- **Microsoft Graph API** — pulls real user profile
- **nginx** — serves the built React app
- **Docker** — multi-stage build (node → nginx)
- **OpenShift** — Deployment, Service, Route, ConfigMap, Secret
- **Azure Entra ID** — OAuth2 / OpenID Connect

---

*Built by Henry Okafor · Portfolio Project · 2026*
