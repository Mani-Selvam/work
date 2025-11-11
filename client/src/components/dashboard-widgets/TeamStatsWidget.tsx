import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionContext";
import MetricCard from "@/components/MetricCard";

export function TeamStatsWidget() {
  const { dbUserId } = useAuth();
  const { teamScope } = usePermissions();

  const { data: teamStats, isLoading } = useQuery<{
    totalMembers: number;
    pendingLeaves: number;
    pendingTasks: number;
    todayPresent: number;
  }>({
    queryKey: ['/api/team/stats', dbUserId],
    enabled: !!dbUserId && !!teamScope,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Team Members",
      value: teamStats?.totalMembers?.toString() || "0",
      icon: Users,
      description: teamScope?.teamName || "Your Team",
      dataTestId: "metric-team-members"
    },
    {
      title: "Pending Leaves",
      value: teamStats?.pendingLeaves?.toString() || "0",
      icon: FileText,
      description: "Awaiting approval",
      dataTestId: "metric-pending-leaves"
    },
    {
      title: "Pending Tasks",
      value: teamStats?.pendingTasks?.toString() || "0",
      icon: CheckCircle,
      description: "Team tasks",
      dataTestId: "metric-pending-tasks"
    },
    {
      title: "Present Today",
      value: teamStats?.todayPresent?.toString() || "0",
      icon: Clock,
      description: "Attendance",
      dataTestId: "metric-present-today"
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          {...metric}
        />
      ))}
    </div>
  );
}
