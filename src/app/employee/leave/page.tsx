import { employees } from "@/data/employees";
import { mockSessions } from "@/data/mockSession";
import {
  calculateLeaveBalance,
  getEmployeeLeaveRequests,
} from "@/services/leaveService";
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

const formatDuration = (duration: LeaveRequest["duration"]) => {
  return duration === "half_day" ? "Half Day" : "Full Day";
};

interface BalanceCardProps {
  leaveTypeName: string;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
}

function BalanceCard({
  leaveTypeName,
  allocatedDays,
  usedDays,
  pendingDays,
  remainingDays,
}: BalanceCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">{leaveTypeName}</p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Allocated</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {allocatedDays}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Used</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{usedDays}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Pending</p>
          <p className="mt-1 text-lg font-semibold text-amber-600">
            {pendingDays}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="mt-1 text-lg font-semibold text-green-600">
            {remainingDays}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MyLeavePage() {
  const employeeId = mockSessions.employee.employeeId;

  const employee = employees.find((item) => item.id === employeeId);

  const leaveRequests = getEmployeeLeaveRequests(employeeId);

  const leaveBalances = calculateLeaveBalance(employeeId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Leave</h1>

        <p className="mt-1 text-sm text-gray-500">
          {employee?.firstName} {employee?.lastName} · {employee?.employeeCode}
        </p>
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Leave Balance</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your current leave allocation and usage.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {leaveBalances.map((balance) => (
            <BalanceCard
              key={balance.leaveTypeId}
              leaveTypeName={balance.leaveTypeName}
              allocatedDays={balance.allocatedDays}
              usedDays={balance.usedDays}
              pendingDays={balance.pendingDays}
              remainingDays={balance.remainingDays}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Leave Request History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your submitted leave requests.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {leaveRequests.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-gray-500">
                You have no leave requests.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 font-medium text-gray-600">
                      Leave Type
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Start Date
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      End Date
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
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {leaveRequests.map((request) => {
                    const leaveType = leaveBalances.find(
                      (item) => item.leaveTypeId === request.leaveTypeId,
                    );

                    return (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {leaveType?.leaveTypeName ?? "Unknown"}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                          {formatDate(request.startDate)}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                          {formatDate(request.endDate)}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                          {formatDuration(request.duration)}
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
