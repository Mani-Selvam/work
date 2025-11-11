import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { UserRole, Permission, hasPermission, hasAnyPermission, hasAllPermissions, hasRole } from "@shared/permissions";

interface TeamScope {
  teamId: number;
  teamName: string;
  memberIds: number[];
}

interface PermissionContextType {
  permissions: Permission[];
  teamScope: TeamScope | null;
  isGlobalScope: boolean;
  loading: boolean;
  
  can: (permission: Permission) => boolean;
  canAny: (permissions: Permission[]) => boolean;
  canAll: (permissions: Permission[]) => boolean;
  isRole: (allowedRoles: UserRole[]) => boolean;
  
  isTeamLeader: boolean;
  isCompanyAdmin: boolean;
  isSuperAdmin: boolean;
  isCompanyMember: boolean;
  
  refetch: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { userRole, dbUserId } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [teamScope, setTeamScope] = useState<TeamScope | null>(null);
  const [isGlobalScope, setIsGlobalScope] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    if (!userRole || !dbUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/permissions", {
        credentials: "include",
        headers: {
          "x-user-id": dbUserId.toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch permissions");
      }

      const data = await response.json();
      
      setPermissions(data.permissions || []);
      setTeamScope(data.teamScope || null);
      setIsGlobalScope(data.isGlobalScope || false);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setPermissions([]);
      setTeamScope(null);
      setIsGlobalScope(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [userRole, dbUserId]);

  const can = (permission: Permission): boolean => {
    if (loading || !permissions.length) {
      return false;
    }
    return permissions.includes(permission);
  };

  const canAny = (permissionList: Permission[]): boolean => {
    if (loading || !permissions.length) {
      return false;
    }
    return permissionList.some(permission => permissions.includes(permission));
  };

  const canAll = (permissionList: Permission[]): boolean => {
    if (loading || !permissions.length) {
      return false;
    }
    return permissionList.every(permission => permissions.includes(permission));
  };

  const isRoleCheck = (allowedRoles: UserRole[]): boolean => {
    if (!userRole) return false;
    return hasRole(userRole, allowedRoles);
  };

  const value: PermissionContextType = {
    permissions,
    teamScope,
    isGlobalScope,
    loading,
    can,
    canAny,
    canAll,
    isRole: isRoleCheck,
    isTeamLeader: userRole === "team_leader",
    isCompanyAdmin: userRole === "company_admin",
    isSuperAdmin: userRole === "super_admin",
    isCompanyMember: userRole === "company_member",
    refetch: fetchPermissions,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions(): PermissionContextType {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
}
