import type { AttendanceListItem } from "@/services/attendanceService";

interface AttendanceTableProps {
  records: AttendanceListItem[];
}

const statusStyles: Record<AttendanceListItem["status"], string> = {
  present: "bg-green-50 text-green-700",
  late: "bg-amber-50 text-amber-700",
  half_day: "bg-blue-50 text-blue-700",
  absent: "bg-red-50 text-red-700",
  leave: "bg-purple-50 text-purple-700",
  holiday: "bg-gray-100 text-gray-600",
  weekend: "bg-gray-100 text-gray-600",
};

const formatStatus = (status: AttendanceListItem["status"]) => {
  return status.replace("_", " ");
};

export function AttendanceTable({ records }: AttendanceTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-3 font-medium text-gray-600">Employee</th>

              <th className="px-5 py-3 font-medium text-gray-600">
                Department
              </th>

              <th className="px-5 py-3 font-medium text-gray-600">Check In</th>

              <th className="px-5 py-3 font-medium text-gray-600">Check Out</th>

              <th className="px-5 py-3 font-medium text-gray-600">
                Working Time
              </th>

              <th className="px-5 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {record.employeeName}
                    </p>

                    <p className="text-xs text-gray-500">{record.employeeId}</p>
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-600">{record.department}</td>

                <td className="px-5 py-4 text-gray-600">
                  {record.checkIn ?? "—"}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {record.checkOut ?? "—"}
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {record.workingMinutes
                    ? `${Math.floor(record.workingMinutes / 60)}h ${
                        record.workingMinutes % 60
                      }m`
                    : "—"}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      statusStyles[record.status]
                    }`}
                  >
                    {formatStatus(record.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
