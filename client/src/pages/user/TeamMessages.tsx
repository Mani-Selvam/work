import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Users } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import type { TeamMessage, User } from "@shared/schema";

export default function TeamMessages() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");

  const { data: teamMessages = [], isLoading: messagesLoading } = useQuery<(TeamMessage & { sender: User })[]>({
    queryKey: ['/api/team-messages'],
  });

  const { data: teamInfo } = useQuery<{ teamLeader: any; members: User[] }>({
    queryKey: ['/api/team-info'],
    enabled: user?.role === 'team_leader',
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest('/api/team-messages', 'POST', {
        message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Team message sent",
        description: "Your message has been sent to all team members",
      });
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ['/api/team-messages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }
    sendMessageMutation.mutate(messageText);
  };

  if (messagesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" />
          Team Messages
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          {user?.role === 'team_leader' 
            ? 'Send messages to your team members' 
            : 'Messages from your team leader'}
        </p>
      </div>

      {user?.role === 'team_leader' && (
        <>
          {teamInfo && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Your team:</span>
                  <span className="font-medium">
                    {teamInfo.members.length} member{teamInfo.members.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {teamInfo.members.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {teamInfo.members.map((member) => (
                      <span key={member.id} className="text-xs bg-background px-2 py-1 rounded-md">
                        {member.displayName}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Send Team Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-message" className="text-xs sm:text-sm">Message</Label>
                <Textarea
                  id="team-message"
                  placeholder="Type your message to the team..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  data-testid="textarea-team-message"
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  This message will be sent to all {teamInfo?.members.length || 0} team member{teamInfo?.members.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!messageText.trim() || sendMessageMutation.isPending}
                data-testid="button-send-team-message"
                className="w-full gap-2"
              >
                <Send className="h-4 w-4" />
                {sendMessageMutation.isPending ? "Sending..." : "Send to Team"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            {user?.role === 'team_leader' ? 'Sent Messages' : 'Team Messages'} ({teamMessages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teamMessages.length > 0 ? (
              teamMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className="bg-muted/50 border rounded-lg p-3"
                  data-testid={`team-message-${msg.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs sm:text-sm font-medium">
                          {msg.sender?.displayName || 'Team Leader'}
                        </span>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            📎 {msg.attachments.length} attachment{msg.attachments.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-foreground whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {format(new Date(msg.createdAt), "MMM dd, HH:mm")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {user?.role === 'team_leader' 
                  ? 'No messages sent yet. Send your first message to the team!' 
                  : 'No team messages yet'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
