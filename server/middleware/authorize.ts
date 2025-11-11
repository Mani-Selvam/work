import type { Request, Response, NextFunction } from "express";
import type { UserRole, Permission } from "@shared/permissions";
import { hasPermission, hasRole } from "@shared/permissions";

export function authorizeRoles(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.context?.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userRole = req.context.user.role as UserRole;
    
    if (!hasRole(userRole, allowedRoles)) {
      return res.status(403).json({ 
        message: "Access denied",
        requiredRoles: allowedRoles,
        userRole 
      });
    }

    next();
  };
}

export function authorizePermissions(requiredPermissions: Permission[], requireAll = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.context?.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userRole = req.context.user.role as UserRole;
    
    const hasAccess = requireAll
      ? requiredPermissions.every(permission => hasPermission(userRole, permission))
      : requiredPermissions.some(permission => hasPermission(userRole, permission));

    if (!hasAccess) {
      return res.status(403).json({ 
        message: "Insufficient permissions",
        requiredPermissions,
        userRole 
      });
    }

    next();
  };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return authorizeRoles(["super_admin", "company_admin"])(req, res, next);
}

export function requireTeamLeaderOrAdmin(req: Request, res: Response, next: NextFunction) {
  return authorizeRoles(["super_admin", "company_admin", "team_leader"])(req, res, next);
}

export function enforceTeamScope(req: Request, res: Response, next: NextFunction) {
  if (!req.context?.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const userRole = req.context.user.role as UserRole;

  if (userRole === "team_leader") {
    if (!req.context.teamScope) {
      return res.status(403).json({ 
        message: "Team leader not assigned to a team" 
      });
    }
  }

  next();
}

export interface ScopeFilters {
  companyId: number | null;
  isGlobalScope: boolean;
  teamScope?: {
    memberIds: number[];
  };
}

export function buildScopedFilters(req: Request): ScopeFilters {
  if (!req.context) {
    throw new Error("Request context not loaded");
  }

  const filters: ScopeFilters = {
    companyId: req.context.companyId,
    isGlobalScope: req.context.isGlobalScope,
  };

  if (req.context.user.role === "team_leader" && req.context.teamScope) {
    filters.teamScope = {
      memberIds: req.context.teamScope.memberIds,
    };
  }

  return filters;
}
