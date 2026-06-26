# Getting Started — Setting Up Your Own Copy

This repository contains three components that work together:

| Folder | Purpose |
|---|---|
| `employee-portal/` | React app — Azure AD login + RBAC dashboards |
| `terraform-entra-id/` | Terraform — provisions users/groups in Entra ID |
| `provisioning-ui/` | Internal admin form — edits `employees.json` for Terraform |

None of these contain real credentials. Every place that needs a secret has
a corresponding `.example` file showing exactly what to fill in. **Never
edit the `.example` files directly with real values** — copy them first.

---

## 1. Azure Entra ID Setup (do this first)

Follow Phase 1 in `docs/phase1-azure-setup.md` (or the main write-up) to:
- Register an `employee-portal` App Registration (SPA platform)
- Register a separate `terraform-entraid-automation` App Registration
  (Application permissions: `User.ReadWrite.All`, `Group.ReadWrite.All`)
- Create your 4 security groups and note their Object IDs

You'll need, from this step:
- Tenant ID
- `employee-portal` Client ID
- `terraform-entraid-automation` Client ID + Client Secret
- Your verified domain (e.g. `yourtenant.onmicrosoft.com`)
- 4 group Object IDs

---

## 2. Set Up the React App (`employee-portal/`)

```bash
cd employee-portal
cp .env.example .env
```

Edit `.env` with your real values:

```env
REACT_APP_AZURE_CLIENT_ID=<your employee-portal Client ID>
REACT_APP_AZURE_TENANT_ID=<your Tenant ID>
REACT_APP_REDIRECT_URI=http://localhost:3000
```

Update `src/rbacConfig.js` with your own 4 group Object IDs (these are
not secrets — they're routing labels, safe to hardcode):

```js
export const GROUP_MAP = {
  "<your-hr-group-object-id>": "HR",
  "<your-it-group-object-id>": "IT",
  "<your-engineering-group-object-id>": "ENGINEERING",
  "<your-admin-group-object-id>": "ADMIN",
};
```

Run locally:

```bash
npm install --legacy-peer-deps
HTTPS=true npm start
```

---

## 3. Set Up OpenShift Deployment (`employee-portal/`)

```bash
cd employee-portal
cp openshift-deploy.yaml openshift-deploy.local.yaml
```

Edit `openshift-deploy.local.yaml` and replace every placeholder:

| Placeholder | Replace with |
|---|---|
| `YOUR_TENANT_ID` | Your Tenant ID |
| `YOUR_CLIENT_ID` | Your `employee-portal` Client ID |
| `YOUR_CLIENT_SECRET` | Your `employee-portal` Client Secret |
| `YOUR_REGISTRY` | Your container registry (e.g. `docker.io/yourname`) |
| `YOUR_CLUSTER_DOMAIN` | Your OpenShift cluster's apps domain |

`openshift-deploy.local.yaml` is gitignored — it will never be committed,
even if you fill it with real values.

```bash
oc apply -f openshift-deploy.local.yaml
```

---

## 4. Set Up Terraform (`terraform-entra-id/`)

```bash
cd terraform-entra-id
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your `terraform-entraid-automation` service
principal's real values:

```hcl
client_id     = "<terraform-entraid-automation Client ID>"
tenant_id     = "<your Tenant ID>"
client_secret = "<terraform-entraid-automation Client Secret>"
domain        = "<yourtenant.onmicrosoft.com>"
```

`terraform.tfvars` is gitignored — never committed.

```bash
terraform init
```

If you already have existing Entra ID groups you want Terraform to manage
(rather than create fresh ones), import them first:

```bash
terraform import azuread_group.portal_hr <your-hr-group-object-id>
terraform import azuread_group.portal_it <your-it-group-object-id>
terraform import azuread_group.portal_engineering <your-engineering-group-object-id>
terraform import azuread_group.portal_admins <your-admin-group-object-id>
```

Then verify zero drift before changing anything:

```bash
terraform plan
# Should show: No changes. Your infrastructure matches the configuration.
```

If you have no existing groups, skip the import step — `terraform apply`
will create them fresh.

---

## 5. Set Up the Provisioning UI (`provisioning-ui/`)

No credentials needed here — this tool only reads/writes the local
`employees.json` file. It never talks to Azure directly.

```bash
cd provisioning-ui
npm install
node server.js
```

Visit `http://localhost:4000`. Adding or offboarding an employee here
updates `../terraform-entra-id/employees.json`. Changes only take effect
in Entra ID after you run `terraform plan` / `terraform apply` in the
`terraform-entra-id/` folder.

---

## Quick Reference — Every `.example` File in This Repo

| File | What it's for |
|---|---|
| `employee-portal/.env.example` | Local dev environment variables |
| `employee-portal/openshift-deploy.yaml` | OpenShift manifest template (copy to `.local.yaml`) |
| `terraform-entra-id/terraform.tfvars.example` | Terraform service principal credentials |

If you ever see a real-looking secret, Object ID, or Tenant ID in a
committed file in this repo, it's a bug — please open an issue.
