import { StatCard } from "@/components/dashboard/StatCard";
import { AttendanceOverview } from "@/components/dashboard/AttendanceOverview";
import { LeaveSummary } from "@/components/dashboard/LeaveSummary";
import { RecentLeaveRequests } from "@/components/dashboard/RecentLeaveRequests";
import {
  getAttendanceOverview,
  getDashboardStats,
  getLatestAttendanceDate,
  getLeaveSummary,
  getRecentLeaveRequests,
} from "@/services/dashboardService";

export default function DashboardPage() {
  const dashboardDate = getLatestAttendanceDate();
  const stats = getDashboardStats(dashboardDate);

  const attendanceOverview = getAttendanceOverview(dashboardDate);

  const leaveSummary = getLeaveSummary();

  const recentLeaveRequests = getRecentLeaveRequests(5);

  return (
    <section>
      <div>
        <p className="text-sm font-medium text-gray-500">HRM Dashboard</p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-2 text-sm text-gray-600">
          Attendance and leave management overview.
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Attendance data as of {dashboardDate}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Employees"
          value={stats.totalEmployees}
          description="Active employees"
        />

        <StatCard
          label="Present Today"
          value={stats.presentToday}
          description="Employees marked present"
        />

        <StatCard
          label="Late Today"
          value={stats.lateToday}
          description="Employees arriving late"
        />

        <StatCard
          label="Absent Today"
          value={stats.absentToday}
          description="Employees marked absent"
        />

        <StatCard
          label="Half Day"
          value={stats.halfDayToday}
          description="Half-day attendance"
        />

        <StatCard
          label="On Leave"
          value={stats.onLeaveToday}
          description="Approved leave today"
        />

        <StatCard
          label="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          description="Present, late and half-day"
        />

        <StatCard
          label="Pending Leave"
          value={stats.pendingLeaveRequests}
          description="Requests awaiting review"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AttendanceOverview
          present={attendanceOverview.present}
          late={attendanceOverview.late}
          halfDay={attendanceOverview.halfDay}
          absent={attendanceOverview.absent}
          onLeave={attendanceOverview.onLeave}
        />

        <LeaveSummary
          pending={leaveSummary.pending}
          approved={leaveSummary.approved}
          rejected={leaveSummary.rejected}
          cancelled={leaveSummary.cancelled}
        />

        <div className="mt-6">
          <RecentLeaveRequests requests={recentLeaveRequests} />
        </div>
      </div>
    </section>
  );
}
