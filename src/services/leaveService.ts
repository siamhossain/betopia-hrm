import { leaveRequests } from "@/data/leaveRequests";
import { leaveTypes } from "@/data/leaveTypes";
import { employees } from "@/data/employees";
import type { LeaveRequest } from "@/types/leave";

export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
  remainingDays: number;
}

export interface CreateLeaveRequestInput {
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  duration: "full_day" | "half_day";
  reason: string;
}

export interface LeaveActionResult {
  success: boolean;
  message: string;
  request?: LeaveRequest;
}

const isDateRangeOverlapping = (
  startDate: string,
  endDate: string,
  existingStartDate: string,
  existingEndDate: string,
): boolean => {
  return (
    startDate <= existingEndDate &&
    endDate >= existingStartDate
  );
};

const calculateRequestDays = (
  request: Pick<
    LeaveRequest,
    "startDate" | "endDate" | "duration"
  >,
): number => {
  const start = new Date(`${request.startDate}T00:00:00`);
  const end = new Date(`${request.endDate}T00:00:00`);

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const calendarDays =
    Math.floor(
      (end.getTime() - start.getTime()) /
        millisecondsPerDay,
    ) + 1;

  if (request.duration === "half_day") {
    return calendarDays * 0.5;
  }

  return calendarDays;
};

const getEmployeeById = (employeeId: string) => {
  return employees.find(
    (employee) => employee.id === employeeId,
  );
};

const getLeaveTypeById = (leaveTypeId: string) => {
  return leaveTypes.find(
    (leaveType) => leaveType.id === leaveTypeId,
  );
};

export const getLeaveRequests = (): LeaveRequest[] => {
  return [...leaveRequests];
};

export const getEmployeeLeaveRequests = (
  employeeId: string,
): LeaveRequest[] => {
  return leaveRequests.filter(
    (request) => request.employeeId === employeeId,
  );
};

export const calculateLeaveBalance = (
  employeeId: string,
): LeaveBalance[] => {
  const employeeRequests = getEmployeeLeaveRequests(
    employeeId,
  );

  return leaveTypes.map((leaveType) => {
    const usedDays = employeeRequests
      .filter(
        (request) =>
          request.leaveTypeId === leaveType.id &&
          request.status === "approved",
      )
      .reduce(
        (total, request) =>
          total + calculateRequestDays(request),
        0,
      );

    const pendingDays = employeeRequests
      .filter(
        (request) =>
          request.leaveTypeId === leaveType.id &&
          request.status === "pending",
      )
      .reduce(
        (total, request) =>
          total + calculateRequestDays(request),
        0,
      );

    return {
      leaveTypeId: leaveType.id,
      leaveTypeName: leaveType.name,
      allocatedDays: leaveType.annualAllocation,
      usedDays,
      pendingDays,
      remainingDays: Math.max(
        0,
        leaveType.annualAllocation - usedDays,
      ),
    };
  });
};

export const validateLeaveRequest = (
  input: CreateLeaveRequestInput,
): string | null => {
  const employee = getEmployeeById(input.employeeId);

  if (!employee) {
    return "Employee not found.";
  }

  const leaveType = getLeaveTypeById(
    input.leaveTypeId,
  );

  if (!leaveType) {
    return "Leave type not found.";
  }

  if (input.startDate > input.endDate) {
    return "Start date cannot be after end date.";
  }

  if (!input.reason.trim()) {
    return "Leave reason is required.";
  }

  if (
    input.duration === "half_day" &&
    input.startDate !== input.endDate
  ) {
    return "Half-day leave must use the same start and end date.";
  }

  if (input.startDate < employee.joiningDate) {
    return "Leave cannot start before the employee joining date.";
  }

  if (
    employee.resignationDate &&
    input.endDate > employee.resignationDate
  ) {
    return "Leave cannot extend beyond the employee resignation date.";
  }

  const existingRequests = getEmployeeLeaveRequests(
    input.employeeId,
  );

  const overlappingRequest = existingRequests.find(
    (request) =>
      request.status !== "rejected" &&
      request.status !== "cancelled" &&
      isDateRangeOverlapping(
        input.startDate,
        input.endDate,
        request.startDate,
        request.endDate,
      ),
  );

  if (overlappingRequest) {
    return "Leave request overlaps with an existing leave request.";
  }

  const requestedDays = calculateRequestDays(input);

  const balance = calculateLeaveBalance(
    input.employeeId,
  ).find(
    (item) => item.leaveTypeId === input.leaveTypeId,
  );

  if (!balance) {
    return "Leave balance could not be calculated.";
  }

  if (
    balance.usedDays +
      balance.pendingDays +
      requestedDays >
    balance.allocatedDays
  ) {
    return "Requested leave exceeds the available leave balance.";
  }

  return null;
};

export const createLeaveRequest = (
  input: CreateLeaveRequestInput,
): LeaveActionResult => {
  const validationError =
    validateLeaveRequest(input);

  if (validationError) {
    return {
      success: false,
      message: validationError,
    };
  }

  const request: LeaveRequest = {
    id: `leave-req-${leaveRequests.length + 1}`,
    employeeId: input.employeeId,
    leaveTypeId: input.leaveTypeId,
    startDate: input.startDate,
    endDate: input.endDate,
    duration: input.duration,
    reason: input.reason.trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  leaveRequests.push(request);

  return {
    success: true,
    message: "Leave request created successfully.",
    request,
  };
};

export const approveLeaveRequest = (
  requestId: string,
  reviewerId: string,
): LeaveActionResult => {
  const request = leaveRequests.find(
    (item) => item.id === requestId,
  );

  if (!request) {
    return {
      success: false,
      message: "Leave request not found.",
    };
  }

  if (request.status !== "pending") {
    return {
      success: false,
      message:
        "Only pending leave requests can be approved.",
    };
  }

  request.status = "approved";
  request.reviewedAt = new Date().toISOString();
  request.reviewedBy = reviewerId;

  return {
    success: true,
    message: "Leave request approved successfully.",
    request,
  };
};

export const rejectLeaveRequest = (
  requestId: string,
  reviewerId: string,
): LeaveActionResult => {
  const request = leaveRequests.find(
    (item) => item.id === requestId,
  );

  if (!request) {
    return {
      success: false,
      message: "Leave request not found.",
    };
  }

  if (request.status !== "pending") {
    return {
      success: false,
      message:
        "Only pending leave requests can be rejected.",
    };
  }

  request.status = "rejected";
  request.reviewedAt = new Date().toISOString();
  request.reviewedBy = reviewerId;

  return {
    success: true,
    message: "Leave request rejected successfully.",
    request,
  };
};

export const cancelLeaveRequest = (
  requestId: string,
): LeaveActionResult => {
  const request = leaveRequests.find(
    (item) => item.id === requestId,
  );

  if (!request) {
    return {
      success: false,
      message: "Leave request not found.",
    };
  }

  if (request.status !== "approved") {
    return {
      success: false,
      message:
        "Only approved leave requests can be cancelled.",
    };
  }

  request.status = "cancelled";

  return {
    success: true,
    message: "Leave request cancelled successfully.",
    request,
  };
};