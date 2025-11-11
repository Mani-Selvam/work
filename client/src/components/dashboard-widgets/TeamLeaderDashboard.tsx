import { TeamStatsWidget } from "./TeamStatsWidget";
import { TeamQuickActions } from "./TeamQuickActions";
import { TeamOverviewBanner } from "./TeamOverviewBanner";

export function TeamLeaderDashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">Team Dashboard</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage and monitor your team's performance
        </p>
      </div>

      <TeamOverviewBanner />
      <TeamStatsWidget />
      <TeamQuickActions />
    </div>
  );
}
