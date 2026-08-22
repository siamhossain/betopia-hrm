import { employees } from "@/data/employees";
import { mockSessions } from "@/data/mockSession";
import { getEmployeeLeaveRequests } from "@/services/leaveService";
import type { LeaveRequest } from "@/types/leave";

const statusStyles: Record<LeaveRequest["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const formatStatus = (status: LeaveRequest["status"]) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

export default function MyRequestsPage() {
  const employeeId = mockSessions.employee.employeeId;

  const employee = employees.find((item) => item.id === employeeId);

  const requests = getEmployeeLeaveRequests(employeeId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>

        <p className="mt-1 text-sm text-gray-500">
          {employee?.firstName} {employee?.lastName} · {employee?.employeeCode}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">Leave Requests</h2>

          <p className="mt-1 text-sm text-gray-500">
            {requests.length} request
            {requests.length === 1 ? "" : "s"} submitted
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-500">
              You have not submitted any requests yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-600">
                    Request ID
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-600">
                    Leave Type
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-600">
                    Date Range
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-600">
                    Duration
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-600">
                    Reason
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-600">
                    Submitted
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {request.id}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {request.leaveTypeId}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                      {formatDate(request.startDate)} —{" "}
                      {formatDate(request.endDate)}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                      {request.duration === "half_day"
                        ? "Half Day"
                        : "Full Day"}
                    </td>

                    <td className="max-w-xs px-5 py-4 text-gray-600">
                      <p className="truncate">{request.reason}</p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[request.status]
                        }`}
                      >
                        {formatStatus(request.status)}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                      {formatDate(request.createdAt.slice(0, 10))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
