import { employees } from "@/data/employees";
import { leaveTypes } from "@/data/leaveTypes";
import { LeaveRequestActions } from "@/components/leave/LeaveRequestActions";
import type { LeaveRequest } from "@/types/leave";

interface LeaveRequestTableProps {
  requests: LeaveRequest[];
  onView: (request: LeaveRequest) => void;
  onApprove: (request: LeaveRequest) => void;
  onReject: (request: LeaveRequest) => void;
  onCancel: (request: LeaveRequest) => void;
}

const statusStyles: Record<LeaveRequest["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const formatStatus = (status: LeaveRequest["status"]) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDuration = (duration: LeaveRequest["duration"]) => {
  return duration === "half_day" ? "Half Day" : "Full Day";
};

const formatDateRange = (startDate: string, endDate: string) => {
  if (startDate === endDate) {
    return startDate;
  }

  return `${startDate} → ${endDate}`;
};

export function LeaveRequestTable({
  requests,
  onView,
  onApprove,
  onReject,
  onCancel,
}: LeaveRequestTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-3 font-medium text-gray-600">Employee</th>

              <th className="px-5 py-3 font-medium text-gray-600">
                Leave Type
              </th>

              <th className="px-5 py-3 font-medium text-gray-600">Date</th>

              <th className="px-5 py-3 font-medium text-gray-600">Duration</th>

              <th className="px-5 py-3 font-medium text-gray-600">Reason</th>

              <th className="px-5 py-3 font-medium text-gray-600">Status</th>

              <th className="px-5 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {requests.map((request) => {
              const employee = employees.find(
                (item) => item.id === request.employeeId,
              );

              const leaveType = leaveTypes.find(
                (item) => item.id === request.leaveTypeId,
              );

              return (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {employee
                          ? `${employee.firstName} ${employee.lastName}`
                          : "Unknown Employee"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {employee?.employeeCode ?? request.employeeId}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {leaveType?.name ?? "Unknown Leave"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {leaveType?.code ?? "—"}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-gray-600">
                    {formatDateRange(request.startDate, request.endDate)}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDuration(request.duration)}
                  </td>

                  <td className="max-w-[240px] px-5 py-4 text-gray-600">
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

                  <td className="px-5 py-4">
                    <LeaveRequestActions
                      request={request}
                      onView={() => onView(request)}
                      onApprove={() => onApprove(request)}
                      onReject={() => onReject(request)}
                      onCancel={() => onCancel(request)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
