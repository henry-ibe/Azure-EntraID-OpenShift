terraform {
  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.47"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "azuread" {
  client_id     = var.client_id
  tenant_id     = var.tenant_id
  client_secret = var.client_secret
}
