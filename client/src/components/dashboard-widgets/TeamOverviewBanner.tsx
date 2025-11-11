import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { usePermissions } from "@/contexts/PermissionContext";

export function TeamOverviewBanner() {
  const { teamScope } = usePermissions();

  if (!teamScope) {
    return null;
  }

  return (
    <Card data-testid="card-team-banner">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg" data-testid="text-team-name">
              {teamScope.teamName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              You're leading a team of {teamScope.memberIds.length} members
            </p>
            <div className="mt-3 text-xs text-muted-foreground">
              Team ID: {teamScope.teamId}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
