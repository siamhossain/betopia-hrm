interface LeaveSummaryProps {
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}

const items = [
  { label: "Pending", key: "pending" },
  { label: "Approved", key: "approved" },
  { label: "Rejected", key: "rejected" },
  { label: "Cancelled", key: "cancelled" },
] as const;

export function LeaveSummary({
  pending,
  approved,
  rejected,
  cancelled,
}: LeaveSummaryProps) {
  const values = {
    pending,
    approved,
    rejected,
    cancelled,
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Leave Summary</h2>

        <p className="mt-1 text-sm text-gray-500">
          Current leave request status.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.key} className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">{item.label}</p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {values[item.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
