import type { LeaveRequest } from "@/types/leave";

interface RecentLeaveRequestsProps {
  requests: LeaveRequest[];
}

const statusStyles: Record<LeaveRequest["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export function RecentLeaveRequests({ requests }: RecentLeaveRequestsProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Recent Leave Requests
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest employee leave activity.
          </p>
        </div>
      </div>

      <div className="mt-5 divide-y">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-gray-900">{request.employeeId}</p>

              <p className="mt-1 text-sm text-gray-500">
                {request.startDate} → {request.endDate}
              </p>

              <p className="mt-1 text-sm text-gray-500">{request.reason}</p>
            </div>

            <span
              className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                statusStyles[request.status]
              }`}
            >
              {request.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
