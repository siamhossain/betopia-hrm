"use client";

import { useState } from "react";

import {
  approveLeaveRequest,
  cancelLeaveRequest,
  rejectLeaveRequest,
} from "@/services/leaveService";
import type { LeaveRequest } from "@/types/leave";
import { LeaveFilters } from "@/components/leave/LeaveFilters";
import { LeaveRequestDetails } from "@/components/leave/LeaveRequestDetails";

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

  const handleView = (request: LeaveRequest) => {
    setSelectedRequest(request);
  };

  const handleApprove = (request: LeaveRequest) => {
    const result = approveLeaveRequest(request.id, "emp-006");

    if (!result.success || !result.request) {
      return;
    }

    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item.id === result.request!.id ? result.request! : item,
      ),
    );

    setSelectedRequest(result.request);
  };

  const handleReject = (request: LeaveRequest) => {
    const result = rejectLeaveRequest(request.id, "emp-006");

    if (!result.success || !result.request) {
      return;
    }

    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item.id === result.request!.id ? result.request! : item,
      ),
    );

    setSelectedRequest(result.request);
  };

  const handleCancel = (request: LeaveRequest) => {
    const result = cancelLeaveRequest(request.id);

    if (!result.success || !result.request) {
      return;
    }

    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item.id === result.request!.id ? result.request! : item,
      ),
    );

    setSelectedRequest(result.request);
  };

  return (
    <>
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
    </>
  );
}
