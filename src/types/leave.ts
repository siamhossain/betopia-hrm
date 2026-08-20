export type LeaveRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type LeaveDuration = "full_day" | "half_day";

export interface LeaveType {
  id: string;
  name: string;
  code: string;

  annualAllocation: number;

  allowHalfDay: boolean;
}

export interface LeaveRequest {
  id: string;

  employeeId: string;
  leaveTypeId: string;

  startDate: string;
  endDate: string;

  duration: LeaveDuration;

  reason: string;

  status: LeaveRequestStatus;

  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface LeaveBalance {
  employeeId: string;
  leaveTypeId: string;

  allocated: number;
  used: number;
  remaining: number;
}