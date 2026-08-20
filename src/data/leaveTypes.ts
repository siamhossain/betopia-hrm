import type { LeaveType } from "@/types/leave";

export const leaveTypes: LeaveType[] = [
  {
    id: "leave-annual",
    name: "Annual Leave",
    code: "AL",
    annualAllocation: 20,
    allowHalfDay: true,
  },
  {
    id: "leave-sick",
    name: "Sick Leave",
    code: "SL",
    annualAllocation: 14,
    allowHalfDay: true,
  },
  {
    id: "leave-casual",
    name: "Casual Leave",
    code: "CL",
    annualAllocation: 10,
    allowHalfDay: true,
  },
  {
    id: "leave-maternity",
    name: "Maternity Leave",
    code: "ML",
    annualAllocation: 120,
    allowHalfDay: false,
  },
  {
    id: "leave-paternity",
    name: "Paternity Leave",
    code: "PL",
    annualAllocation: 7,
    allowHalfDay: false,
  },
  {
    id: "leave-unpaid",
    name: "Unpaid Leave",
    code: "UL",
    annualAllocation: 0,
    allowHalfDay: false,
  },
];