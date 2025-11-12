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
  | "team_leaders:view"
  | "team_leaders:manage"
  | "teams:view:all"
  | "teams:view:own"
  | "teams:manage:all"
  | "teams:manage:own"
  | "reports:view:all"
  | "reports:view:team"
  | "reports:download:all"
  | "reports:download:team"
  | "tasks:view:all"
  | "tasks:view:team"
  | "tasks:view:assigned"
  | "tasks:manage:all"
  | "tasks:manage:team"
  | "tasks:assign:all"
  | "tasks:assign:team"
  | "messages:view:all"
  | "messages:view:team"
  | "messages:send:all"
  | "messages:send:team"
  | "team_messages:view:all"
  | "team_messages:view:own"
  | "team_messages:send:all"
  | "team_messages:send:own"
  | "ratings:view:all"
  | "ratings:view:team"
  | "ratings:give:all"
  | "ratings:give:team"
  | "feedback:view:all"
  | "feedback:view:team"
  | "feedback:send"
  | "announcements:view"
  | "announcements:create:all"
  | "announcements:create:team"
  | "leave:view:all"
  | "leave:view:team"
  | "leave:view:own"
  | "leave:approve:all"
  | "leave:approve:team"
  | "leave:request"
  | "correction:view:all"
  | "correction:view:team"
  | "correction:approve:all"
  | "correction:approve:team"
  | "correction:request"
  | "attendance:view:all"
  | "attendance:view:team"
  | "attendance:view:own"
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
    "team_leaders:view",
    "team_leaders:manage",
    "teams:view:all",
    "teams:manage:all",
    "reports:view:all",
    "reports:download:all",
    "tasks:view:all",
    "tasks:view:assigned",
    "tasks:manage:all",
    "tasks:assign:all",
    "messages:view:all",
    "messages:send:all",
    "team_messages:view:all",
    "team_messages:send:all",
    "ratings:view:all",
    "ratings:give:all",
    "feedback:view:all",
    "feedback:send",
    "announcements:view",
    "announcements:create:all",
    "leave:view:all",
    "leave:approve:all",
    "leave:request",
    "correction:view:all",
    "correction:approve:all",
    "correction:request",
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
    "team_leaders:view",
    "team_leaders:manage",
    "teams:view:all",
    "teams:manage:all",
    "reports:view:all",
    "reports:download:all",
    "tasks:view:all",
    "tasks:view:assigned",
    "tasks:manage:all",
    "tasks:assign:all",
    "messages:view:all",
    "messages:send:all",
    "team_messages:view:all",
    "team_messages:send:all",
    "ratings:view:all",
    "ratings:give:all",
    "feedback:view:all",
    "feedback:send",
    "announcements:view",
    "announcements:create:all",
    "leave:view:all",
    "leave:approve:all",
    "leave:request",
    "correction:view:all",
    "correction:approve:all",
    "correction:request",
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
    "teams:view:own",
    "teams:manage:own",
    "reports:view:team",
    "reports:download:team",
    "tasks:view:team",
    "tasks:view:assigned",
    "tasks:manage:team",
    "tasks:assign:team",
    "messages:view:team",
    "messages:send:team",
    "team_messages:view:own",
    "team_messages:send:own",
    "ratings:view:team",
    "ratings:give:team",
    "feedback:view:team",
    "feedback:send",
    "announcements:view",
    "announcements:create:team",
    "leave:view:team",
    "leave:approve:team",
    "leave:request",
    "correction:view:team",
    "correction:approve:team",
    "correction:request",
    "attendance:view:team",
    "attendance:policy:view",
    "holiday:view",
  ],
  company_member: [
    "dashboard:view",
    "tasks:view:assigned",
    "tasks:view:team",
    "messages:view:team",
    "messages:send:team",
    "team_messages:view:own",
    "team_messages:send:own",
    "feedback:send",
    "announcements:view",
    "leave:view:own",
    "leave:request",
    "correction:view:team",
    "correction:request",
    "attendance:view:own",
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
  teamLeaders: {
    view: ["team_leaders:view"] as Permission[],
    manage: ["team_leaders:manage"] as Permission[],
  },
  teams: {
    all: ["teams:view:all", "teams:manage:all"] as Permission[],
    own: ["teams:view:own", "teams:manage:own"] as Permission[],
  },
  reports: {
    all: ["reports:view:all", "reports:download:all"] as Permission[],
    team: ["reports:view:team", "reports:download:team"] as Permission[],
  },
  tasks: {
    all: ["tasks:view:all", "tasks:manage:all", "tasks:assign:all"] as Permission[],
    team: ["tasks:view:team", "tasks:manage:team", "tasks:assign:team"] as Permission[],
    assigned: ["tasks:view:assigned"] as Permission[],
  },
  messages: {
    all: ["messages:view:all", "messages:send:all"] as Permission[],
    team: ["messages:view:team", "messages:send:team"] as Permission[],
  },
  teamMessages: {
    all: ["team_messages:view:all", "team_messages:send:all"] as Permission[],
    own: ["team_messages:view:own", "team_messages:send:own"] as Permission[],
  },
  ratings: {
    all: ["ratings:view:all", "ratings:give:all"] as Permission[],
    team: ["ratings:view:team", "ratings:give:team"] as Permission[],
  },
  feedback: {
    all: ["feedback:view:all"] as Permission[],
    team: ["feedback:view:team"] as Permission[],
    send: ["feedback:send"] as Permission[],
  },
  announcements: {
    view: ["announcements:view"] as Permission[],
    createAll: ["announcements:create:all"] as Permission[],
    createTeam: ["announcements:create:team"] as Permission[],
  },
  leave: {
    all: ["leave:view:all", "leave:approve:all"] as Permission[],
    team: ["leave:view:team", "leave:approve:team"] as Permission[],
    own: ["leave:view:own", "leave:request"] as Permission[],
  },
  correction: {
    all: ["correction:view:all", "correction:approve:all"] as Permission[],
    team: ["correction:view:team", "correction:approve:team"] as Permission[],
    request: ["correction:request"] as Permission[],
  },
  attendance: {
    all: ["attendance:view:all"] as Permission[],
    team: ["attendance:view:team"] as Permission[],
    own: ["attendance:view:own"] as Permission[],
    policy: ["attendance:policy:view", "attendance:policy:edit"] as Permission[],
  },
  holiday: {
    view: ["holiday:view"] as Permission[],
    manage: ["holiday:manage"] as Permission[],
  },
} as const;
