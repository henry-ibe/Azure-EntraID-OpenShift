// src/rbacConfig.js
// Maps real Azure AD Security Group Object IDs to application departments.
// These IDs are not secrets — they're routing labels, not credentials.
// The actual authorization boundary is Azure AD itself (group membership).

export const GROUP_MAP = {
  "40ff0000-f507-4fd6-9902-ba6710ee251b": "HR",
  "cb8ffe78-d7b3-4769-98c6-95abc7fbf5be": "IT",
  "437e3327-910b-407f-82ef-b3a3287f8454": "ENGINEERING",
  "a19c0743-70ec-4314-895d-fd834dade6a2": "ADMIN",
};

// Priority order matters: if a user belongs to multiple groups,
// Admin takes precedence (e.g. an admin who is also tagged in HR).
const PRIORITY = ["ADMIN", "HR", "IT", "ENGINEERING"];

/**
 * Given the decoded ID token claims, returns the department this user
 * should see, or null if they belong to no recognized group.
 */
export function resolveDepartment(claims) {
  if (!claims || !Array.isArray(claims.groups)) return null;

  const userDepartments = claims.groups
    .map((groupId) => GROUP_MAP[groupId])
    .filter(Boolean);

  if (userDepartments.length === 0) return null;

  for (const dept of PRIORITY) {
    if (userDepartments.includes(dept)) return dept;
  }
  return userDepartments[0];
}
