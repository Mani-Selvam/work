import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Clock, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";
import type { AttendanceRecord } from "@shared/schema";

export default function AttendanceMonitor() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { data: attendanceRecords, isLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ["/api/admin/attendance/daily", { date: selectedDate }],
  });

  const stats = {
    total: attendanceRecords?.length || 0,
    present: attendanceRecords?.filter((r) => r.status === "present").length || 0,
    late: attendanceRecords?.filter((r) => r.status === "late").length || 0,
    absent: attendanceRecords?.filter((r) => r.status === "absent").length || 0,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      present: { variant: "default", label: "Present" },
      absent: { variant: "destructive", label: "Absent" },
      late: { variant: "secondary", label: "Late" },
      leave: { variant: "outline", label: "Leave" },
    };
    const config = variants[status] || variants.absent;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatTime = (time: string | Date | null) => {
    if (!time) return "-";
    const date = typeof time === 'string' ? new Date(time) : time;
    return format(date, "hh:mm a");
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Attendance Monitor</h1>
          <p className="text-sm text-muted-foreground">
            Monitor daily attendance records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
            data-testid="input-date"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total">
              {stats.total}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <UserCheck className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="stat-present">
              {stats.present}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600" data-testid="stat-late">
              {stats.late}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <UserX className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" data-testid="stat-absent">
              {stats.absent}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : attendanceRecords && attendanceRecords.length > 0 ? (
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">Employee ID</th>
                    <th className="p-3 text-left text-sm font-medium">Check-In</th>
                    <th className="p-3 text-left text-sm font-medium">Check-Out</th>
                    <th className="p-3 text-left text-sm font-medium">Duration</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b last:border-0 hover-elevate"
                      data-testid={`row-attendance-${record.id}`}
                    >
                      <td className="p-3 text-sm">{record.userId}</td>
                      <td className="p-3 text-sm" data-testid={`checkin-${record.id}`}>
                        {formatTime(record.checkIn)}
                      </td>
                      <td className="p-3 text-sm" data-testid={`checkout-${record.id}`}>
                        {formatTime(record.checkOut)}
                      </td>
                      <td className="p-3 text-sm" data-testid={`duration-${record.id}`}>
                        {formatDuration(record.workDuration)}
                      </td>
                      <td className="p-3 text-sm">
                        {getStatusBadge(record.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No attendance records found for this date
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
