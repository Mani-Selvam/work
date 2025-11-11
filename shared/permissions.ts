export type UserRole = "super_admin" | "company_admin" | "team_leader" | "company_member";

export type Permission = 
  | "dashboard:view"
  | "dashboard:company"
  | "dashboard:team"
  | "company:profile:view"
  | "company:profile:edit"
  | "company:settings:view"
  | "company:settings:edit"
  | "payment:view"
  | "payment:manage"
  | "users:view:all"
  | "users:view:team"
  | "users:manage:all"
  | "users:manage:team"
  | "reports:view:all"
  | "reports:view:team"
  | "reports:download:all"
  | "reports:download:team"
  | "tasks:view:all"
  | "tasks:view:team"
  | "tasks:manage:all"
  | "tasks:manage:team"
  | "messages:view:all"
  | "messages:view:team"
  | "messages:send:all"
  | "messages:send:team"
  | "ratings:view:all"
  | "ratings:view:team"
  | "ratings:give:all"
  | "ratings:give:team"
  | "feedback:view:all"
  | "feedback:view:team"
  | "feedback:send"
  | "leave:approve:all"
  | "leave:approve:team"
  | "correction:approve:all"
  | "correction:approve:team"
  | "attendance:view:all"
  | "attendance:view:team"
  | "attendance:policy:view"
  | "attendance:policy:edit"
  | "holiday:view"
  | "holiday:manage";

export const PERMISSION_MAP: Record<UserRole, Permission[]> = {
  super_admin: [
    "dashboard:view",
    "dashboard:company",
    "company:profile:view",
    "company:profile:edit",
    "company:settings:view",
    "company:settings:edit",
    "payment:view",
    "payment:manage",
    "users:view:all",
    "users:manage:all",
    "reports:view:all",
    "reports:download:all",
    "tasks:view:all",
    "tasks:manage:all",
    "messages:view:all",
    "messages:send:all",
    "ratings:view:all",
    "ratings:give:all",
    "feedback:view:all",
    "feedback:send",
    "leave:approve:all",
    "correction:approve:all",
    "attendance:view:all",
    "attendance:policy:view",
    "attendance:policy:edit",
    "holiday:view",
    "holiday:manage",
  ],
  company_admin: [
    "dashboard:view",
    "dashboard:company",
    "company:profile:view",
    "company:profile:edit",
    "company:settings:view",
    "company:settings:edit",
    "payment:view",
    "payment:manage",
    "users:view:all",
    "users:manage:all",
    "reports:view:all",
    "reports:download:all",
    "tasks:view:all",
    "tasks:manage:all",
    "messages:view:all",
    "messages:send:all",
    "ratings:view:all",
    "ratings:give:all",
    "feedback:view:all",
    "feedback:send",
    "leave:approve:all",
    "correction:approve:all",
    "attendance:view:all",
    "attendance:policy:view",
    "attendance:policy:edit",
    "holiday:view",
    "holiday:manage",
  ],
  team_leader: [
    "dashboard:view",
    "dashboard:team",
    "users:view:team",
    "users:manage:team",
    "reports:view:team",
    "reports:download:team",
    "tasks:view:team",
    "tasks:manage:team",
    "messages:view:team",
    "messages:send:team",
    "ratings:view:team",
    "ratings:give:team",
    "feedback:view:team",
    "feedback:send",
    "leave:approve:team",
    "correction:approve:team",
    "attendance:view:team",
    "attendance:policy:view",
    "holiday:view",
  ],
  company_member: [
    "dashboard:view",
    "tasks:view:team",
    "messages:view:team",
    "messages:send:team",
    "feedback:send",
    "attendance:policy:view",
    "holiday:view",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return PERMISSION_MAP[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export const MODULE_PERMISSIONS = {
  dashboard: {
    company: ["dashboard:company"] as Permission[],
    team: ["dashboard:team"] as Permission[],
  },
  company: {
    profile: ["company:profile:view", "company:profile:edit"] as Permission[],
    settings: ["company:settings:view", "company:settings:edit"] as Permission[],
  },
  payment: ["payment:view", "payment:manage"] as Permission[],
  users: {
    all: ["users:view:all", "users:manage:all"] as Permission[],
    team: ["users:view:team", "users:manage:team"] as Permission[],
  },
  reports: {
    all: ["reports:view:all", "reports:download:all"] as Permission[],
    team: ["reports:view:team", "reports:download:team"] as Permission[],
  },
  tasks: {
    all: ["tasks:view:all", "tasks:manage:all"] as Permission[],
    team: ["tasks:view:team", "tasks:manage:team"] as Permission[],
  },
  messages: {
    all: ["messages:view:all", "messages:send:all"] as Permission[],
    team: ["messages:view:team", "messages:send:team"] as Permission[],
  },
  ratings: {
    all: ["ratings:view:all", "ratings:give:all"] as Permission[],
    team: ["ratings:view:team", "ratings:give:team"] as Permission[],
  },
  leave: {
    all: ["leave:approve:all"] as Permission[],
    team: ["leave:approve:team"] as Permission[],
  },
  correction: {
    all: ["correction:approve:all"] as Permission[],
    team: ["correction:approve:team"] as Permission[],
  },
  attendance: {
    all: ["attendance:view:all"] as Permission[],
    team: ["attendance:view:team"] as Permission[],
    policy: ["attendance:policy:view", "attendance:policy:edit"] as Permission[],
  },
  holiday: {
    view: ["holiday:view"] as Permission[],
    manage: ["holiday:manage"] as Permission[],
  },
} as const;
