locals {
  employees = jsondecode(file("${path.module}/employees.json"))

  department_groups = {
    HR          = azuread_group.portal_hr.object_id
    IT          = azuread_group.portal_it.object_id
    ENGINEERING = azuread_group.portal_engineering.object_id
    ADMIN       = azuread_group.portal_admins.object_id
  }

  employees_by_key = {
    for emp in local.employees :
    "${emp.first_name}.${emp.last_name}" => emp
  }
}

resource "random_password" "employee_password" {
  for_each = { for k, v in local.employees_by_key : k => v if v.status == "active" }

  length      = 16
  special     = true
  min_upper   = 1
  min_lower   = 1
  min_numeric = 1
  min_special = 1
}

resource "azuread_user" "employee" {
  for_each = { for k, v in local.employees_by_key : k => v if v.status == "active" }

  user_principal_name   = "${lower(each.value.first_name)}.${lower(each.value.last_name)}@${var.domain}"
  display_name          = "${each.value.first_name} ${each.value.last_name}"
  mail_nickname          = "${lower(each.value.first_name)}.${lower(each.value.last_name)}"
  password               = random_password.employee_password[each.key].result
  force_password_change = true
}

resource "azuread_group_member" "employee_membership" {
  for_each = { for k, v in local.employees_by_key : k => v if v.status == "active" }

  group_object_id  = local.department_groups[each.value.department]
  member_object_id = azuread_user.employee[each.key].object_id
}
