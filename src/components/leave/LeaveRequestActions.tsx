"use client";

import type { LeaveRequest } from "@/types/leave";

interface LeaveRequestActionsProps {
  request: LeaveRequest;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
}

export function LeaveRequestActions({
  request,
  onView,
  onApprove,
  onReject,
  onCancel,
}: LeaveRequestActionsProps) {
  const isPending = request.status === "pending";
  const isApproved = request.status === "approved";

  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      <button
        type="button"
        onClick={onView}
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        View
      </button>

      {isPending && (
        <>
          <button
            type="button"
            onClick={onApprove}
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            Approve
          </button>

          <button
            type="button"
            onClick={onReject}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Reject
          </button>
        </>
      )}

      {isApproved && (
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
