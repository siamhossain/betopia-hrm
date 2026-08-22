"use client";

import { calculateLeaveBalance } from "@/services/leaveService";

interface LeaveBalancePreviewProps {
  employeeId: string;
  leaveTypeId: string;
}

export function LeaveBalancePreview({
  employeeId,
  leaveTypeId,
}: LeaveBalancePreviewProps) {
  if (!employeeId || !leaveTypeId) {
    return null;
  }

  const balance = calculateLeaveBalance(employeeId).find(
    (item) => item.leaveTypeId === leaveTypeId,
  );

  if (!balance) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Leave Balance
        </p>

        <p className="mt-1 text-sm text-gray-600">
          Current balance for the selected employee and leave type.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-gray-500">Allocated</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {balance.allocatedDays}
          </p>
          <p className="text-xs text-gray-500">days</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Used</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {balance.usedDays}
          </p>
          <p className="text-xs text-gray-500">days</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Pending</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {balance.pendingDays}
          </p>
          <p className="text-xs text-gray-500">days</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {balance.remainingDays}
          </p>
          <p className="text-xs text-gray-500">days</p>
        </div>
      </div>
    </div>
  );
}
