import { afterEach, describe, expect, it } from "vitest";
import { leaveRequests } from "@/data/leaveRequests";
import {
  approveLeaveRequest,
  calculateLeaveBalance,
  cancelLeaveRequest,
  createLeaveRequest,
  rejectLeaveRequest,
  validateLeaveRequest,
} from "@/services/leaveService";

const originalLeaveRequests = leaveRequests.map((request) => ({
  ...request,
}));

afterEach(() => {
  leaveRequests.splice(
    0,
    leaveRequests.length,
    ...originalLeaveRequests.map((request) => ({
      ...request,
    })),
  );
});

describe("Leave Service - Business Rules", () => {
  it("calculates leave balance for an employee", () => {
    const balance = calculateLeaveBalance("emp-001");

    const annualLeave = balance.find(
      (item) => item.leaveTypeId === "leave-annual",
    );

    expect(annualLeave).toBeDefined();
    expect(annualLeave?.allocatedDays).toBe(20);
    expect(annualLeave?.usedDays).toBe(2);
    expect(annualLeave?.remainingDays).toBe(18);
  });

  it("calculates two approved half-days as one full leave day", () => {
    const balance = calculateLeaveBalance("emp-011");

    const sickLeave = balance.find(
      (item) => item.leaveTypeId === "leave-sick",
    );

    expect(sickLeave).toBeDefined();
    expect(sickLeave?.usedDays).toBe(1);
  });

  it("rejects a leave request when start date is after end date", () => {
    const error = validateLeaveRequest({
      employeeId: "emp-001",
      leaveTypeId: "leave-annual",
      startDate: "2026-08-25",
      endDate: "2026-08-20",
      duration: "full_day",
      reason: "Annual leave",
    });

    expect(error).toBe(
      "Start date cannot be after end date.",
    );
  });

  it("requires a leave reason", () => {
    const error = validateLeaveRequest({
      employeeId: "emp-001",
      leaveTypeId: "leave-annual",
      startDate: "2026-08-26",
      endDate: "2026-08-27",
      duration: "full_day",
      reason: "   ",
    });

    expect(error).toBe("Leave reason is required.");
  });

  it("rejects half-day leave spanning multiple dates", () => {
    const error = validateLeaveRequest({
      employeeId: "emp-001",
      leaveTypeId: "leave-annual",
      startDate: "2026-08-26",
      endDate: "2026-08-27",
      duration: "half_day",
      reason: "Personal work",
    });

    expect(error).toBe(
      "Half-day leave must use the same start and end date.",
    );
  });

  it("rejects overlapping leave against an approved request", () => {
    const error = validateLeaveRequest({
      employeeId: "emp-001",
      leaveTypeId: "leave-annual",
      startDate: "2026-08-25",
      endDate: "2026-08-26",
      duration: "full_day",
      reason: "Another trip",
    });

    expect(error).toBe(
      "Leave request overlaps with an existing leave request.",
    );
  });

  it("allows a new leave request when the previous request was rejected", () => {
    const error = validateLeaveRequest({
      employeeId: "emp-008",
      leaveTypeId: "leave-sick",
      startDate: "2026-08-12",
      endDate: "2026-08-12",
      duration: "full_day",
      reason: "New medical request",
    });

    expect(error).toBeNull();
  });

  it("creates a valid leave request with pending status", () => {
    const result = createLeaveRequest({
      employeeId: "emp-006",
      leaveTypeId: "leave-annual",
      startDate: "2026-10-05",
      endDate: "2026-10-06",
      duration: "full_day",
      reason: "Personal travel",
    });

    expect(result.success).toBe(true);
    expect(result.request?.status).toBe("pending");
    expect(result.request?.employeeId).toBe("emp-006");
  });

  it("approves a pending leave request", () => {
    const result = approveLeaveRequest(
      "leave-req-006",
      "emp-006",
    );

    expect(result.success).toBe(true);
    expect(result.request?.status).toBe("approved");
    expect(result.request?.reviewedBy).toBe("emp-006");
  });

  it("rejects a pending leave request", () => {
    const result = rejectLeaveRequest(
      "leave-req-005",
      "emp-006",
    );

    expect(result.success).toBe(true);
    expect(result.request?.status).toBe("rejected");
    expect(result.request?.reviewedBy).toBe("emp-006");
  });

  it("cancels an approved leave request", () => {
    const result = cancelLeaveRequest(
      "leave-req-001",
    );

    expect(result.success).toBe(true);
    expect(result.request?.status).toBe("cancelled");
  });

  it("prevents approving a rejected request", () => {
    const result = approveLeaveRequest(
      "leave-req-007",
      "emp-006",
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Only pending leave requests can be approved.",
    );
  });

  it("prevents approving a cancelled request", () => {
    const result = approveLeaveRequest(
      "leave-req-013",
      "emp-006",
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Only pending leave requests can be approved.",
    );
  });

  it("prevents rejecting an already approved request", () => {
    const result = rejectLeaveRequest(
      "leave-req-001",
      "emp-006",
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Only pending leave requests can be rejected.",
    );
  });

  it("prevents cancelling a pending request", () => {
    const result = cancelLeaveRequest(
      "leave-req-006",
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "Only approved leave requests can be cancelled.",
    );
  });

  it("updates used balance after approval and restores it after cancellation", () => {
    const before = calculateLeaveBalance("emp-007");

    const beforeAnnual = before.find(
      (item) => item.leaveTypeId === "leave-annual",
    );

    expect(beforeAnnual?.usedDays).toBe(0);

    const approval = approveLeaveRequest(
      "leave-req-006",
      "emp-006",
    );

    expect(approval.success).toBe(true);

    const afterApproval = calculateLeaveBalance("emp-007");

    const approvedAnnual = afterApproval.find(
      (item) => item.leaveTypeId === "leave-annual",
    );

    expect(approvedAnnual?.usedDays).toBe(3);
    expect(approvedAnnual?.remainingDays).toBe(17);

    const cancellation = cancelLeaveRequest(
      "leave-req-006",
    );

    expect(cancellation.success).toBe(true);

    const afterCancellation =
      calculateLeaveBalance("emp-007");

    const cancelledAnnual = afterCancellation.find(
      (item) => item.leaveTypeId === "leave-annual",
    );

    expect(cancelledAnnual?.usedDays).toBe(0);
    expect(cancelledAnnual?.remainingDays).toBe(20);
  });
});