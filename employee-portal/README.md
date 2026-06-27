# Nexus Corp Employee Portal

> React + MSAL.js + Azure Entra ID + OpenShift — RBAC-routed department dashboards

The frontend layer of the [Azure-EntraID-OpenShift](https://github.com/henry-ibe/Azure-EntraID-OpenShift) project. This is a React single-page application that authenticates employees via Microsoft Entra ID and routes each user to a department-specific dashboard based on the security group claims in their signed ID token.

---

## How It Works

```
User hits the app
    ↓
LoginPage.js — "Sign in with Microsoft" gate
    ↓
Microsoft's hosted login page (app never sees credentials)
    ↓
Azure returns a signed ID token with a groups claim
    ↓
RouteGuard.js — reads group Object IDs from the token
    ↓
rbacConfig.js — maps each Object ID to a department
    ↓
DashboardShell.js — renders the matching department view
    (HR / IT / Engineering / Admin)
    ↓
No matching group? → AccessRestricted.js
```

The app never calls an API to determine a user's role. Authorization data travels inside the authentication token itself — the application reads what the signed token says and trusts the answer because it trusts Azure AD as the issuer.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/authConfig.js` | MSAL configuration — Client ID, Tenant ID, redirect URI, scopes |
| `src/rbacConfig.js` | Maps group Object IDs → department labels, applies priority ordering (Admin > HR > IT > Engineering) |
| `src/components/LoginPage.js` | Login gate with "Sign in with Microsoft" action |
| `src/components/RouteGuard.js` | Reads `idTokenClaims.groups`, resolves department, renders the correct dashboard or AccessRestricted |
| `src/components/AccessRestricted.js` | Explicit "you authenticated but you're not authorized" view |
| `src/components/dashboards/DashboardShell.js` | Shared layout shell — sidebar, header, navigation |
| `src/components/dashboards/HRDashboard.js` | HR view — workforce overview, PTO requests, onboarding |
| `src/components/dashboards/ITDashboard.js` | IT view — ticket queue, system status, asset inventory |
| `src/components/dashboards/EngineeringDashboard.js` | Engineering view — sprint board, deployments, on-call |
| `src/components/dashboards/AdminDashboard.js` | Admin view — cross-department summary with elevated access |

---

## Local Development

```bash
cd employee-portal
cp .env.example .env
```

Edit `.env` with your Azure values:

```
REACT_APP_AZURE_CLIENT_ID=<your employee-portal Client ID>
REACT_APP_AZURE_TENANT_ID=<your Tenant ID>
REACT_APP_REDIRECT_URI=http://localhost:3000
```

Update `src/rbacConfig.js` with your four group Object IDs.

```bash
npm install --legacy-peer-deps
HTTPS=true npm start
```

HTTPS is required — MSAL will throw a `crypto_nonexistent` error on plain HTTP.

---

## Docker Build

Multi-stage build: `node:18-alpine` compiles the React app, then `nginx:alpine` serves the static bundle. The container runs as non-root (UID 1001) for OpenShift compatibility.

```bash
docker build -t employee-portal:latest .
docker tag employee-portal:latest docker.io/<your-dockerhub-username>/employee-portal:latest
docker push docker.io/<your-dockerhub-username>/employee-portal:latest
```

**Important:** `REACT_APP_*` environment variables are baked into the JavaScript bundle at build time by Create React App. Passing different values via `docker run -e` or a Kubernetes ConfigMap after the build has no effect. If the redirect URI needs to change for a different environment, rebuild the image.

---

## OpenShift Deployment

```bash
cp openshift-deploy.yaml openshift-deploy.local.yaml
```

Edit `openshift-deploy.local.yaml` — replace all `YOUR_*` placeholders with real values. This file is `.gitignore`d and will never be committed.

```bash
oc apply -f openshift-deploy.local.yaml
oc get pods -n employee-portal
oc get route employee-portal -n employee-portal
```

Add the Route URL as a redirect URI in the Entra ID App Registration (SPA platform). The redirect URI in `.env` at build time must match the Route URL — if it doesn't, rebuild and redeploy.

---

## OpenShift Resources

| Resource | Name | Purpose |
|----------|------|---------|
| Project | `employee-portal` | Namespace |
| ConfigMap | `portal-config` | Tenant ID, redirect URI |
| Secret | `portal-secret` | Client ID, client secret |
| Deployment | `employee-portal` | Runs the React + nginx pod |
| Service | `employee-portal` | Internal cluster routing |
| Route | `employee-portal` | HTTPS external access (TLS edge termination) |

---

## Common Issues

**MSAL crypto error on localhost** — You must use HTTPS. Run with `HTTPS=true npm start` and accept the self-signed cert warning.

**`npm audit fix --force` breaks everything** — Do not run this. It downgrades `react-scripts` to `0.0.0` and corrupts the project. If it happens: delete `node_modules` and `package-lock.json`, restore `react-scripts` to `5.0.1` in `package.json`, reinstall.

**ajv error on older Node versions** — Run `npm install ajv@^8.0.0 --legacy-peer-deps` to fix the `ajv/dist/compile/codegen` error.

**Redirect goes to wrong URL after deploying to OpenShift** — The redirect URI was wrong at build time. Fix `.env`, rebuild the Docker image, push, and `oc rollout restart`.

---

*Part of the [Azure-EntraID-OpenShift](https://github.com/henry-ibe/Azure-EntraID-OpenShift) project — see the root README for the full six-layer architecture.*
