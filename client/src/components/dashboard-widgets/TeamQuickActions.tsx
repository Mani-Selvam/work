import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { CheckCircle, Calendar, FileText, Users, MessageSquare } from "lucide-react";

export function TeamQuickActions() {
  const [, setLocation] = useLocation();

  const quickActions = [
    { 
      icon: Calendar, 
      label: "Approve Leaves", 
      description: "Review team leave requests",
      onClick: () => setLocation("/admin/leaves"),
      testId: "button-approve-leaves"
    },
    { 
      icon: CheckCircle, 
      label: "Assign Tasks", 
      description: "Create and manage team tasks",
      onClick: () => setLocation("/admin/tasks"),
      testId: "button-assign-tasks"
    },
    { 
      icon: FileText, 
      label: "View Reports", 
      description: "Team performance reports",
      onClick: () => setLocation("/admin/reports"),
      testId: "button-view-reports"
    },
    { 
      icon: Users, 
      label: "Team Members", 
      description: "Manage your team",
      onClick: () => setLocation("/admin/users"),
      testId: "button-team-members"
    },
    { 
      icon: MessageSquare, 
      label: "Send Message", 
      description: "Communicate with team",
      onClick: () => setLocation("/admin/messages"),
      testId: "button-send-message"
    },
  ];

  return (
    <Card data-testid="card-team-quick-actions">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={action.onClick}
                data-testid={action.testId}
              >
                <div className="flex items-start gap-3 text-left">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{action.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{action.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
