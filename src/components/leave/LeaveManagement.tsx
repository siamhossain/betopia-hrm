"use client";

import { useState } from "react";

import {
  approveLeaveRequest,
  cancelLeaveRequest,
  getLeaveRequests,
  rejectLeaveRequest,
} from "@/services/leaveService";
import type { LeaveRequest } from "@/types/leave";
import { LeaveFilters } from "@/components/leave/LeaveFilters";
import { LeaveRequestDetails } from "@/components/leave/LeaveRequestDetails";
import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";

interface LeaveManagementProps {
  requests: LeaveRequest[];
}

export function LeaveManagement({
  requests: initialRequests,
}: LeaveManagementProps) {
  const [requests, setRequests] = useState(initialRequests);

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const handleView = (request: LeaveRequest) => {
    setSelectedRequest(request);
  };

  const handleApprove = (request: LeaveRequest) => {
    const result = approveLeaveRequest(request.id, "emp-006");

    if (!result.success || !result.request) {
      return;
    }

    setRequests(getLeaveRequests());
    setSelectedRequest(result.request);
    setSuccessMessage("Leave request approved successfully.");
  };

  const handleReject = (request: LeaveRequest) => {
    const result = rejectLeaveRequest(request.id, "emp-006");

    if (!result.success || !result.request) {
      return;
    }

    setRequests(getLeaveRequests());
    setSelectedRequest(result.request);
    setSuccessMessage("Leave request rejected successfully.");
  };

  const handleCancel = (request: LeaveRequest) => {
    const result = cancelLeaveRequest(request.id);

    if (!result.success || !result.request) {
      return;
    }

    setRequests(getLeaveRequests());
    setSelectedRequest(result.request);
    setSuccessMessage("Leave request cancelled successfully.");
  };

  const handleCreateSuccess = () => {
    setRequests(getLeaveRequests());
    setShowCreateForm(false);
    setSuccessMessage("Leave request created successfully.");
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <span>{successMessage}</span>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="font-medium text-green-700 hover:text-green-900"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setSuccessMessage("");
            setShowCreateForm(true);
          }}
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create Leave Request
        </button>
      </div>

      {showCreateForm && (
        <LeaveRequestForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <LeaveFilters
        requests={requests}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
        onCancel={handleCancel}
      />

      {selectedRequest && (
        <LeaveRequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
