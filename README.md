# Azure Entra ID + OpenShift — Enterprise Identity-as-Code

A six-layer enterprise IAM system that federates Microsoft Entra ID with a React employee portal deployed on OpenShift, with Terraform-managed user provisioning and RBAC — built end-to-end from identity provider configuration through containerized cluster deployment.

This is not a tutorial follow-along. Every phase was built, debugged, and documented against a live Azure tenant and a local OpenShift CRC cluster, including the networking issues, the build-time gotchas, and the architectural tradeoffs that only surface when you wire real systems together.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Azure Entra ID                                              │
│     App registrations, security groups, token claims            │
│     The source of truth for identity and group membership       │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│  2. Terraform                                                   │
│     Imports existing groups, provisions users from JSON         │
│     Reads employees.json, writes to Entra ID via service       │
│     principal (separate identity from the app — blast radius    │
│     isolation)                                                  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│  3. Provisioning UI                                             │
│     Express app writes to employees.json                       │
│     No Azure credentials needed — decoupled from the           │
│     identity layer by design                                   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│  4. React Employee Portal                                       │
│     MSAL login, reads group claims from signed token           │
│     Routes each user to their department dashboard             │
│     (HR / IT / Engineering / Admin)                            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│  5. Docker Image                                                │
│     Multi-stage build (Node 18 → nginx:alpine)                 │
│     Bakes redirect URI at build time, not runtime              │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│  6. OpenShift (CRC)                                             │
│     Deployment, Service, Route serve the image over TLS        │
│     ConfigMap/Secret inject runtime env vars                   │
│     (app already built — build-time vs runtime distinction     │
│     is a key lesson from this project)                         │
└─────────────────────────────────────────────────────────────────┘
```

A user logs in at the bottom and the loop completes back to Layer 1 — Azure issues a signed token containing their group memberships, and the app routes them to the correct dashboard without a single extra API call.

---

## What This Demonstrates

**Token-based authorization without a roles database.** The React app reads the `groups` claim directly from the signed ID token issued by Azure AD. There is no local roles table, no separate permissions database, and no additional round-trip. Authorization data travels inside the authentication token itself.

**Blast-radius isolation between automation and application.** Terraform authenticates via its own dedicated service principal (`terraform-entraid-automation`), entirely separate from the employee-portal's app registration. A compromised app secret gets login capability, not directory-write capability.

**Import-first Terraform adoption.** The four security groups were created manually in Phase 1 and their Object IDs were already hardcoded into the live React app's RBAC config. Terraform was pointed at these existing groups via `terraform import` rather than allowed to create fresh ones — which would have minted new Object IDs and silently broken the running application's authorization logic.

**Zero-drift verification before any apply.** After importing, the first `terraform plan` revealed that the code was missing a `description` field that existed on the real groups. Rather than applying that destructive change, the code was corrected to match reality. A second plan confirmed "No changes" before any `apply` was allowed.

**Build-time vs runtime configuration.** Create React App bakes `REACT_APP_*` environment variables into the JavaScript bundle at build time. The OpenShift ConfigMap and Secret correctly inject env vars into the container's process — but by that point the React build has already happened. This is the most common source of "why is my redirect URI wrong in production" issues with SPAs on Kubernetes, and this project documents diagnosing and fixing it.

**CRC networking and SSH tunneling.** CRC's router binds only to `127.0.0.1` on the host machine — not to its LAN IP. Accessing the app from a separate machine looked like a DNS failure but was actually a topology problem. Fixed with an SSH local port-forward tunnel, documented as a reusable pattern for anyone running CRC/Minikube/kind remotely.

**Explicit access-denied state.** When a user authenticates successfully but belongs to no recognized group, the app renders an "Access Restricted" view instead of a blank page or a crash — separating authentication from authorization in the user experience, not just the architecture.

**Full secrets audit before commit.** A multi-pass `grep` sweep across the entire repo for hardcoded GUIDs, client secrets, and credentials — catching real exposed values and moving them to `.gitignore`d local files before any push.

---

## Repository Structure

```
Azure-EntraID-OpenShift/
├── employee-portal/          # React app — Azure AD login + RBAC dashboards
│   ├── src/
│   │   ├── rbacConfig.js     # Group ID → department mapping + priority logic
│   │   └── components/       # Login gate, route guard, 4 department dashboards
│   ├── Dockerfile            # Multi-stage: node:18-alpine → nginx:alpine
│   ├── openshift-deploy.yaml # Template (copy to .local.yaml, fill in values)
│   ├── .env.example          # Local dev environment variables
│   └── nginx.conf            # Production nginx config
│
├── terraform-entra-id/       # Terraform — provisions users/groups in Entra ID
│   ├── providers.tf          # AzureAD provider via client credentials
│   ├── variables.tf          # Input variables (all marked sensitive)
│   ├── groups.tf             # Four security groups (imported, not created)
│   ├── users.tf              # User provisioning from employees.json
│   ├── employees.json        # Declarative employee roster
│   └── terraform.tfvars.example
│
├── provisioning-ui/          # Internal admin form — edits employees.json
│   ├── server.js             # Express app (reads/writes JSON, no Azure creds)
│   └── views/index.ejs       # Add/offboard employees via web form
│
├── GETTING_STARTED.md        # Step-by-step setup guide for your own tenant
└── README.md                 # ← You are here
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Identity Provider | Microsoft Entra ID (Azure AD), OAuth2 / OpenID Connect |
| Frontend | React 18, MSAL.js v3 (`@azure/msal-browser`, `@azure/msal-react`) |
| RBAC Routing | Token claims-based group resolution with priority ordering |
| Infrastructure as Code | Terraform (AzureAD provider ~2.47), HCL |
| Provisioning UI | Node.js, Express, EJS |
| Container | Docker multi-stage build (Node 18 → nginx:alpine), non-root |
| Orchestration | OpenShift 4.21.8 (CRC), Deployment, Service, Route (TLS edge) |
| Cluster | CodeReady Containers on RHEL 9 (Dell Precision 7540, 62GB RAM) |

---

## Quick Start

See **[GETTING_STARTED.md](./GETTING_STARTED.md)** for the full setup guide, covering:

1. Azure Entra ID configuration (two app registrations, security groups, token claims)
2. React app local dev
3. OpenShift deployment via manifest
4. Terraform initialization and group import
5. Provisioning UI

**Prerequisites:** An Azure AD tenant you can administer, Node.js 18+, Terraform, Docker or Podman, an OpenShift cluster (CRC or Developer Sandbox).

---

## Security Model

No real credentials are committed to this repository. Every sensitive value uses a corresponding `.example` file with placeholders.

| File | Contains | Committed? |
|------|----------|-----------|
| `.env` | Client ID, Tenant ID, Redirect URI | No (`.gitignore`d) |
| `terraform.tfvars` | Service principal credentials | No (`.gitignore`d) |
| `openshift-deploy.local.yaml` | Cluster-specific secrets | No (`.gitignore`d) |
| `*.tfstate` | Terraform state (contains real resource IDs) | No (`.gitignore`d) |
| `rbacConfig.js` | Group Object IDs | Yes — these are routing labels, not credentials |

The Terraform service principal uses **Application permissions** (`User.ReadWrite.All`, `Group.ReadWrite.All`) with explicit admin consent — not Delegated permissions — because it operates as an unattended automation identity without a signed-in user.

---

## Known Limitations

These are intentional scope decisions, not oversights.

**Terraform state is local.** No shared backend, no state locking, no protection against concurrent applies. A production setup would use Azure Storage or Terraform Cloud from day one.

**Authorization is enforced at the frontend only.** The route guard reads token claims and renders the correct dashboard, but there is no backend API validating claims server-side. This is a UX/routing convenience, not a security boundary. A production system would validate the token and group claims server-side before returning protected data.

**No automated drift detection.** Manual changes to groups or users in Entra ID go unnoticed until the next `terraform plan`. A production pipeline would run plan on a schedule and alert on drift.

**No approval gate on destructive actions.** Any change that reaches `terraform apply` takes effect immediately with single-person review. A production identity pipeline would require a second approval before disabling or deleting accounts.

**New employee passwords require manual intervention.** Terraform generates a strong random password with `force_password_change = true`, but there is no automated delivery path to the new hire. A real onboarding flow would integrate with email or a self-service first-login flow.

---

## Author

**Henry Ibe**
Systems & Infrastructure Engineer

- [GitHub](https://github.com/henry-ibe)
- [LinkedIn](https://www.linkedin.com/in/henry-ibe)

---
