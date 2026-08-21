interface AttendanceOverviewProps {
  present: number;
  late: number;
  halfDay: number;
  absent: number;
  onLeave: number;
}

const items = [
  { label: "Present", key: "present" },
  { label: "Late", key: "late" },
  { label: "Half Day", key: "halfDay" },
  { label: "Absent", key: "absent" },
  { label: "On Leave", key: "onLeave" },
] as const;

export function AttendanceOverview({
  present,
  late,
  halfDay,
  absent,
  onLeave,
}: AttendanceOverviewProps) {
  const values = {
    present,
    late,
    halfDay,
    absent,
    onLeave,
  };

  const total = Object.values(values).reduce((sum, value) => sum + value, 0);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          Attendance Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Today&apos;s workforce attendance status.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => {
          const value = values[item.key];
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

          return (
            <div key={item.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{item.label}</span>

                <span className="text-gray-500">
                  {value} ({percentage}%)
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
