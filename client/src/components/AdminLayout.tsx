import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  Star,
  MessageCircle,
  LogOut,
  Menu,
  Building2,
  BarChart3,
  DollarSign,
  Activity,
  Receipt,
  Calendar,
  Clock,
  TrendingUp,
  Settings,
  FileEdit,
  UserCog
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import BottomNav, { BottomNavItem } from "./BottomNav";
import CompanyDetailsSetupDialog from "./CompanyDetailsSetupDialog";
import { useState, useEffect, useMemo } from "react";
import { Permission } from "@shared/permissions";

interface NavItem {
  path: string;
  label: string;
  icon: any;
  requiredPermission?: Permission;
}

const companyAdminNavItems: NavItem[] = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, requiredPermission: "dashboard:company" },
  { path: "/admin/company-profile", label: "Company Profile", icon: Building2, requiredPermission: "company:profile:view" },
  { path: "/admin/company", label: "Company Settings", icon: BarChart3, requiredPermission: "company:settings:view" },
  { path: "/admin/payment-history", label: "Payment History", icon: Receipt, requiredPermission: "payment:view" },
  { path: "/admin/users", label: "Users", icon: Users, requiredPermission: "users:view:all" },
  { path: "/admin/team-leaders", label: "Team Leaders", icon: UserCog, requiredPermission: "users:view:all" },
  { path: "/admin/reports", label: "Reports", icon: FileText, requiredPermission: "reports:view:all" },
  { path: "/admin/tasks", label: "Tasks", icon: CheckSquare, requiredPermission: "tasks:view:all" },
  { path: "/admin/messages", label: "Messages", icon: MessageSquare, requiredPermission: "messages:view:all" },
  { path: "/admin/ratings", label: "Ratings", icon: Star, requiredPermission: "ratings:view:all" },
  { path: "/admin/feedback", label: "Feedback", icon: MessageCircle, requiredPermission: "feedback:view:all" },
  { path: "/admin/leaves", label: "Leave Approval", icon: Calendar, requiredPermission: "leave:approve:all" },
  { path: "/admin/corrections", label: "Correction Requests", icon: FileEdit, requiredPermission: "correction:approve:all" },
  { path: "/admin/attendance", label: "Attendance Monitor", icon: Clock, requiredPermission: "attendance:view:all" },
  { path: "/admin/attendance-reports", label: "Attendance Reports", icon: TrendingUp, requiredPermission: "attendance:view:all" },
  { path: "/admin/attendance-policy", label: "Attendance Policy", icon: Settings, requiredPermission: "attendance:policy:edit" },
  { path: "/admin/holidays", label: "Holiday Management", icon: Calendar, requiredPermission: "holiday:manage" },
];

const teamLeaderNavItems: NavItem[] = [
  { path: "/admin/dashboard", label: "My Team Dashboard", icon: LayoutDashboard, requiredPermission: "dashboard:team" },
  { path: "/admin/users", label: "My Team Members", icon: Users, requiredPermission: "users:view:team" },
  { path: "/admin/reports", label: "Team Reports", icon: FileText, requiredPermission: "reports:view:team" },
  { path: "/admin/tasks", label: "Team Tasks", icon: CheckSquare, requiredPermission: "tasks:view:team" },
  { path: "/admin/messages", label: "Team Messages", icon: MessageSquare, requiredPermission: "messages:view:team" },
  { path: "/admin/ratings", label: "Team Ratings", icon: Star, requiredPermission: "ratings:view:team" },
  { path: "/admin/feedback", label: "Team Feedback", icon: MessageCircle, requiredPermission: "feedback:view:team" },
  { path: "/admin/leaves", label: "Team Leave Approval", icon: Calendar, requiredPermission: "leave:approve:team" },
  { path: "/admin/corrections", label: "Team Corrections", icon: FileEdit, requiredPermission: "correction:approve:team" },
  { path: "/admin/attendance", label: "Team Attendance", icon: Clock, requiredPermission: "attendance:view:team" },
  { path: "/admin/holidays", label: "Holidays", icon: Calendar, requiredPermission: "holiday:view" },
];

const superAdminNavItems: NavItem[] = [
  { path: "/super-admin/dashboard", label: "Companies", icon: Building2 },
  { path: "/super-admin/payments", label: "Payments", icon: DollarSign },
  { path: "/super-admin/activity", label: "Activity Logs", icon: Activity },
];

const bottomNavItems: BottomNavItem[] = [
  { path: "/admin/dashboard", label: "Home", icon: LayoutDashboard },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/tasks", label: "Tasks", icon: CheckSquare },
  { path: "/admin/messages", label: "Messages", icon: MessageSquare },
];

const superAdminBottomNavItems: BottomNavItem[] = [
  { path: "/super-admin/dashboard", label: "Companies", icon: Building2 },
  { path: "/super-admin/payments", label: "Payments", icon: DollarSign },
  { path: "/super-admin/activity", label: "Activity", icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, userRole, signOut, loggingOut, companyId, setUser } = useAuth();
  const { can, isTeamLeader, isCompanyAdmin, isSuperAdmin } = usePermissions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const filteredNavItems = useMemo(() => {
    if (isSuperAdmin) {
      return superAdminNavItems;
    } else if (isTeamLeader) {
      return teamLeaderNavItems.filter(item => {
        if (!item.requiredPermission) return true;
        return can(item.requiredPermission);
      });
    } else if (isCompanyAdmin) {
      return companyAdminNavItems.filter(item => {
        if (!item.requiredPermission) return true;
        return can(item.requiredPermission);
      });
    }
    return [];
  }, [isSuperAdmin, isTeamLeader, isCompanyAdmin, can]);

  const filteredBottomNavItems = useMemo(() => {
    if (isSuperAdmin) {
      return superAdminBottomNavItems;
    } else if (isTeamLeader) {
      return [
        { path: "/admin/dashboard", label: "Team", icon: LayoutDashboard },
        { path: "/admin/users", label: "Members", icon: Users },
        { path: "/admin/tasks", label: "Tasks", icon: CheckSquare },
        { path: "/admin/leaves", label: "Leaves", icon: Calendar },
      ];
    } else {
      return bottomNavItems;
    }
  }, [isSuperAdmin, isTeamLeader]);

  useEffect(() => {
    if (isCompanyAdmin && user && companyId) {
      const profileCompleteKey = `companyProfileComplete_${companyId}`;
      const isProfileComplete = localStorage.getItem(profileCompleteKey) === 'true';
      
      if (!isProfileComplete && !(user as any).companyProfileComplete) {
        setShowProfileSetup(true);
      }
    }
  }, [isCompanyAdmin, user, companyId]);

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
    if (user && companyId) {
      const updatedUser = { ...user, companyProfileComplete: true };
      setUser(updatedUser as any);
      
      const profileCompleteKey = `companyProfileComplete_${companyId}`;
      localStorage.setItem(profileCompleteKey, 'true');
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Admin Info */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.displayName?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{user?.displayName}</h3>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            <p className="text-xs font-medium text-primary">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <ThemeToggle />
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
          disabled={loggingOut}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {loggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 border-r bg-card flex-col">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="font-semibold text-lg">WorkLogix Admin</h1>
            <div className="w-10" /> {/* Spacer for balance */}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="container max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
              {children}
            </div>
          </div>

          {/* Bottom Navigation for Mobile */}
          <BottomNav items={filteredBottomNavItems} />
        </main>
      </div>

      {/* Company Profile Setup Dialog */}
      {showProfileSetup && companyId && user && (
        <CompanyDetailsSetupDialog
          open={showProfileSetup}
          companyId={companyId}
          companyName={user.displayName || ""}
          onComplete={handleProfileSetupComplete}
        />
      )}
    </>
  );
}
