import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import type { User } from "@shared/schema";

export interface RequestContext {
  user: User;
  companyId: number | null;
  isGlobalScope: boolean;
  teamScope?: {
    teamLeaderId: number;
    teamId: string;
    teamName: string;
    memberIds: number[];
  };
}

declare global {
  namespace Express {
    interface Request {
      context?: RequestContext;
    }
  }
}

export async function loadUserContext(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = parseInt(req.headers["x-user-id"] as string);
    
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await storage.getUserById(userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        message: "User account disabled", 
        code: "USER_INACTIVE" 
      });
    }

    // Super admins can operate without a company association
    if (!user.companyId && user.role !== "super_admin") {
      return res.status(400).json({ 
        message: "User not associated with a company" 
      });
    }

    const isGlobalScope = user.role === "super_admin" && !user.companyId;

    req.context = {
      user,
      companyId: user.companyId || null,
      isGlobalScope,
    };

    if (user.role === "team_leader") {
      const teamLeaderData = await storage.getTeamLeaderWithMembers(user.id);
      
      if (teamLeaderData) {
        req.context.teamScope = {
          teamLeaderId: teamLeaderData.id,
          teamId: teamLeaderData.teamId,
          teamName: teamLeaderData.teamName,
          memberIds: teamLeaderData.memberIds,
        };
      }
    }

    next();
  } catch (error) {
    console.error("Error loading user context:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.context) {
    return await loadUserContext(req, res, next);
  }
  next();
}
