import { employees } from "@/data/employees";
import {
  getDashboardStats,
  getLatestAttendanceDate,
} from "@/services/dashboardService";
import { getLeaveRequests } from "@/services/leaveService";

export default function ReportsPage() {
  const reportDate = getLatestAttendanceDate();
  const stats = getDashboardStats(reportDate);
  const leaveRequests = getLeaveRequests();

  const reportCards = [
    {
      label: "Total Employees",
      value: stats.totalEmployees,
    },
    {
      label: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
    },
    {
      label: "Pending Leave Requests",
      value: stats.pendingLeaveRequests,
    },
    {
      label: "Approved Leave Requests",
      value: leaveRequests.filter((request) => request.status === "approved")
        .length,
    },
    {
      label: "Rejected Leave Requests",
      value: leaveRequests.filter((request) => request.status === "rejected")
        .length,
    },
    {
      label: "Cancelled Leave Requests",
      value: leaveRequests.filter((request) => request.status === "cancelled")
        .length,
    },
  ];

  return (
    <section>
      <div>
        <p className="text-sm font-medium text-gray-500">HRM Reports</p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">Reports</h1>

        <p className="mt-2 text-sm text-gray-600">
          Overview of employee, attendance, and leave management data.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reportCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{card.label}</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Attendance Summary
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <p className="text-sm text-gray-500">Present</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {stats.presentToday}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Late</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {stats.lateToday}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Half Day</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {stats.halfDayToday}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Absent</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {stats.absentToday}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">On Leave</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {stats.onLeaveToday}
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs text-gray-500">
          Based on the latest attendance date in the system: {reportDate}
        </p>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Employee Overview
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          The current employee dataset contains {employees.length} employee
          records, including active, inactive, on-leave, and resigned employees.
        </p>
      </div>
    </section>
  );
}
