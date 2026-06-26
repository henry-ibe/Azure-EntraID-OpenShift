variable "client_id" {
  description = "Client ID of the terraform-entraid-automation service principal"
  type        = string
  sensitive   = true
}

variable "tenant_id" {
  description = "Azure AD tenant ID"
  type        = string
  sensitive   = true
}

variable "client_secret" {
  description = "Client secret for the terraform-entraid-automation service principal"
  type        = string
  sensitive   = true
}

variable "domain" {
  description = "Your Azure AD verified domain"
  type        = string
}
