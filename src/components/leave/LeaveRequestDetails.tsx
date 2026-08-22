"use client";

import { useEffect } from "react";

import { employees } from "@/data/employees";
import { leaveTypes } from "@/data/leaveTypes";
import type { LeaveRequest } from "@/types/leave";

interface LeaveRequestDetailsProps {
  request: LeaveRequest;
  onClose: () => void;
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

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
};

const formatDateTime = (date?: string) => {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export function LeaveRequestDetails({
  request,
  onClose,
}: LeaveRequestDetailsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const employee = employees.find((item) => item.id === request.employeeId);

  const leaveType = leaveTypes.find((item) => item.id === request.leaveTypeId);

  const reviewer = request.reviewedBy
    ? employees.find((item) => item.id === request.reviewedBy)
    : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-request-details-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Leave Request
            </p>

            <h2
              id="leave-request-details-title"
              className="mt-1 text-lg font-semibold text-gray-900"
            >
              Request Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Employee
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {employee
                ? `${employee.firstName} ${employee.lastName}`
                : "Unknown Employee"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {employee?.employeeCode ?? request.employeeId}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Leave Type
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {leaveType?.name ?? "Unknown Leave"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {leaveType?.code ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Start Date
            </p>

            <p className="mt-1 text-gray-900">
              {formatDate(request.startDate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              End Date
            </p>

            <p className="mt-1 text-gray-900">{formatDate(request.endDate)}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Duration
            </p>

            <p className="mt-1 text-gray-900">
              {formatDuration(request.duration)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Status
            </p>

            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                statusStyles[request.status]
              }`}
            >
              {formatStatus(request.status)}
            </span>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Reason
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-700">
              {request.reason}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Created At
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {formatDateTime(request.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Reviewed By
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Reviewed At
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {formatDateTime(request.reviewedAt)}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
