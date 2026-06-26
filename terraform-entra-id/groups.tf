resource "azuread_group" "portal_hr" {
  display_name     = "Portal-HR"
  description      = "Company HR personnels"
  security_enabled = true
}

resource "azuread_group" "portal_it" {
  display_name     = "Portal-IT"
  description      = "Company IT personnels"
  security_enabled = true
}

resource "azuread_group" "portal_engineering" {
  display_name     = "Portal-Engineering"
  description      = "Company Engineers"
  security_enabled = true
}

resource "azuread_group" "portal_admins" {
  display_name     = "Portal-Admins"
  description      = "Company Admin"
  security_enabled = true
}
