import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Users as UsersIcon, Copy, CheckCircle, UserPlus } from "lucide-react";
import type { User } from "@shared/schema";

interface TeamLeader {
  id: number;
  userId: number;
  companyId: number;
  teamId: string;
  teamName: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    displayName: string;
    photoURL?: string;
  } | null;
}

export default function TeamLeaders() {
  const { toast } = useToast();
  const { dbUserId, companyId } = useAuth();
  const [addLeaderDialogOpen, setAddLeaderDialogOpen] = useState(false);
  const [viewMembersDialogOpen, setViewMembersDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState<TeamLeader | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [leaderForm, setLeaderForm] = useState({
    email: "",
    displayName: "",
    password: "",
    teamName: "",
  });

  const { data: teamLeaders = [], isLoading: leadersLoading } = useQuery<TeamLeader[]>({
    queryKey: ['/api/team-leaders'],
  });

  const { data: teamMembers = [], isLoading: membersLoading } = useQuery<User[]>({
    queryKey: ['/api/team-leaders', selectedTeamLeader?.id, 'members'],
    enabled: !!selectedTeamLeader,
  });

  const { data: unassignedMembers = [] } = useQuery<User[]>({
    queryKey: ['/api/team-leaders', selectedTeamLeader?.id, 'unassigned'],
    enabled: !!selectedTeamLeader && addMemberDialogOpen,
  });

  const createTeamLeaderMutation = useMutation({
    mutationFn: async (leaderData: typeof leaderForm) => {
      const response = await apiRequest('/api/team-leaders', 'POST', leaderData);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Team Leader created successfully",
        description: `Team ID: ${data.teamId}`,
      });
      setLeaderForm({ email: "", displayName: "", password: "", teamName: "" });
      setAddLeaderDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/team-leaders'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create team leader",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: async ({ teamLeaderId, userId }: { teamLeaderId: number; userId: number }) => {
      return await apiRequest(`/api/team-leaders/${teamLeaderId}/members`, 'POST', { userId });
    },
    onSuccess: () => {
      toast({
        title: "Employee added to team",
        description: "The employee has been successfully assigned to this team.",
      });
      setAddMemberDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/team-leaders', selectedTeamLeader?.id, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team-leaders', selectedTeamLeader?.id, 'unassigned'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add employee",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async ({ teamLeaderId, userId }: { teamLeaderId: number; userId: number }) => {
      return await apiRequest(`/api/team-leaders/${teamLeaderId}/members/${userId}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: "Employee removed from team",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/team-leaders', selectedTeamLeader?.id, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team-leaders', selectedTeamLeader?.id, 'unassigned'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove employee",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copied to clipboard",
        description: `${field} has been copied`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const handleViewMembers = (teamLeader: TeamLeader) => {
    setSelectedTeamLeader(teamLeader);
    setViewMembersDialogOpen(true);
  };

  const handleAddMember = () => {
    setAddMemberDialogOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Team Leaders</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage team leaders and their teams
          </p>
        </div>
        <Button
          onClick={() => setAddLeaderDialogOpen(true)}
          data-testid="button-add-team-leader"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Team Leader
        </Button>
      </div>

      {leadersLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center">Loading team leaders...</p>
          </CardContent>
        </Card>
      ) : teamLeaders.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <UsersIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No team leaders yet. Create your first team leader to get started.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {teamLeaders.map((teamLeader) => (
            <Card key={teamLeader.id} data-testid={`card-team-leader-${teamLeader.id}`}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={teamLeader.user?.photoURL} />
                      <AvatarFallback>
                        {teamLeader.user?.displayName.charAt(0).toUpperCase() || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{teamLeader.user?.displayName || 'Unknown'}</CardTitle>
                      <p className="text-sm text-muted-foreground">{teamLeader.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMembers(teamLeader)}
                      data-testid={`button-view-members-${teamLeader.id}`}
                    >
                      <UsersIcon className="w-4 h-4 mr-2" />
                      View Members
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Team Name</p>
                    <p className="font-medium">{teamLeader.teamName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team ID</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium font-mono" data-testid={`text-team-id-${teamLeader.id}`}>
                        {teamLeader.teamId}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(teamLeader.teamId, "Team ID")}
                        data-testid={`button-copy-team-id-${teamLeader.id}`}
                      >
                        {copiedField === "Team ID" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addLeaderDialogOpen} onOpenChange={setAddLeaderDialogOpen}>
        <DialogContent data-testid="dialog-add-team-leader">
          <DialogHeader>
            <DialogTitle>Create Team Leader</DialogTitle>
            <DialogDescription>
              Add a new team leader. A unique Team ID will be generated automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                data-testid="input-team-name"
                value={leaderForm.teamName}
                onChange={(e) => setLeaderForm({ ...leaderForm, teamName: e.target.value })}
                placeholder="e.g., Sales Team, Development Team"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Leader Name</Label>
              <Input
                id="displayName"
                data-testid="input-leader-name"
                value={leaderForm.displayName}
                onChange={(e) => setLeaderForm({ ...leaderForm, displayName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="input-leader-email"
                value={leaderForm.email}
                onChange={(e) => setLeaderForm({ ...leaderForm, email: e.target.value })}
                placeholder="leader@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                data-testid="input-leader-password"
                value={leaderForm.password}
                onChange={(e) => setLeaderForm({ ...leaderForm, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <Alert>
              <AlertDescription>
                A unique Team ID will be generated automatically. The team leader can use this Team ID to login.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setAddLeaderDialogOpen(false)}
                data-testid="button-cancel-add-leader"
              >
                Cancel
              </Button>
              <Button
                onClick={() => createTeamLeaderMutation.mutate(leaderForm)}
                disabled={createTeamLeaderMutation.isPending || !leaderForm.teamName || !leaderForm.displayName || !leaderForm.email || !leaderForm.password}
                data-testid="button-submit-add-leader"
              >
                {createTeamLeaderMutation.isPending ? "Creating..." : "Create Team Leader"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={viewMembersDialogOpen} onOpenChange={setViewMembersDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-view-members">
          <DialogHeader>
            <DialogTitle>Team Members - {selectedTeamLeader?.teamName}</DialogTitle>
            <DialogDescription>
              Manage members assigned to this team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              onClick={handleAddMember}
              size="sm"
              data-testid="button-add-member-to-team"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
            
            {membersLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Loading members...</p>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No members assigned yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {teamMembers.map((member) => (
                  <Card key={member.id} data-testid={`card-team-member-${member.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member.photoURL || undefined} />
                            <AvatarFallback>
                              {member.displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.displayName}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => selectedTeamLeader && removeMemberMutation.mutate({ 
                            teamLeaderId: selectedTeamLeader.id, 
                            userId: member.id 
                          })}
                          disabled={removeMemberMutation.isPending}
                          data-testid={`button-remove-member-${member.id}`}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent data-testid="dialog-add-member">
          <DialogHeader>
            <DialogTitle>Add Employee to Team</DialogTitle>
            <DialogDescription>
              Select an employee to add to {selectedTeamLeader?.teamName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {unassignedMembers.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No unassigned employees available</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {unassignedMembers.map((member) => (
                  <Card 
                    key={member.id} 
                    className="hover-elevate active-elevate-2 cursor-pointer" 
                    onClick={() => selectedTeamLeader && addMemberMutation.mutate({ 
                      teamLeaderId: selectedTeamLeader.id, 
                      userId: member.id 
                    })}
                    data-testid={`card-available-member-${member.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.photoURL || undefined} />
                          <AvatarFallback>
                            {member.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.displayName}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
