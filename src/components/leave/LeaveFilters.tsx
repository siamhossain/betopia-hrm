"use client";

import { useMemo, useState } from "react";

import { employees } from "@/data/employees";
import { leaveTypes } from "@/data/leaveTypes";
import type { LeaveRequest } from "@/types/leave";
import { LeaveRequestTable } from "@/components/leave/LeaveRequestTable";

interface LeaveFiltersProps {
  requests: LeaveRequest[];
}

export function LeaveFilters({ requests }: LeaveFiltersProps) {
  const [status, setStatus] = useState<LeaveRequest["status"] | "">("");
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      if (status && request.status !== status) {
        return false;
      }

      if (leaveTypeId && request.leaveTypeId !== leaveTypeId) {
        return false;
      }

      if (employeeId && request.employeeId !== employeeId) {
        return false;
      }

      return true;
    });
  }, [requests, status, leaveTypeId, employeeId]);

  const hasFilters = Boolean(status || leaveTypeId || employeeId);

  const clearFilters = () => {
    setStatus("");
    setLeaveTypeId("");
    setEmployeeId("");
  };

  return (
    <>
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label
              htmlFor="leave-status"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="leave-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as LeaveRequest["status"] | "")
              }
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="leave-type"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Leave Type
            </label>

            <select
              id="leave-type"
              value={leaveTypeId}
              onChange={(event) => setLeaveTypeId(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400"
            >
              <option value="">All Leave Types</option>

              {leaveTypes.map((leaveType) => (
                <option key={leaveType.id} value={leaveType.id}>
                  {leaveType.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="leave-employee"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Employee
            </label>

            <select
              id="leave-employee"
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400"
            >
              <option value="">All Employees</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          Showing {filteredRequests.length} of {requests.length} requests
        </div>
      </div>

      <div className="mt-6">
        <LeaveRequestTable requests={filteredRequests} />
      </div>
    </>
  );
}
