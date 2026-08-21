import { attendanceRecords } from "@/data/attendance";
import { employees } from "@/data/employees";
import { leaveRequests } from "@/data/leaveRequests";
import type { LeaveRequest } from "@/types/leave";

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  lateToday: number;
  halfDayToday: number;
  absentToday: number;
  onLeaveToday: number;
  attendanceRate: number;
  pendingLeaveRequests: number;
}

export const getLatestAttendanceDate = (): string => {
  return attendanceRecords.reduce((latestDate, record) => {
    return record.date > latestDate ? record.date : latestDate;
  }, "");
};

export interface AttendanceOverview {
  present: number;
  late: number;
  halfDay: number;
  absent: number;
  onLeave: number;
}

export interface LeaveSummary {
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}

export const getAttendanceOverview = (
  date: string,
): AttendanceOverview => {
  const todayAttendance = attendanceRecords.filter(
    (record) => record.date === date,
  );

  return {
    present: todayAttendance.filter(
      (record) => record.status === "present",
    ).length,

    late: todayAttendance.filter(
      (record) => record.status === "late",
    ).length,

    halfDay: todayAttendance.filter(
      (record) => record.status === "half_day",
    ).length,

    absent: todayAttendance.filter(
      (record) => record.status === "absent",
    ).length,

    onLeave: todayAttendance.filter(
      (record) => record.status === "leave",
    ).length,
  };
};

export const getLeaveSummary = (): LeaveSummary => {
  return {
    pending: leaveRequests.filter(
      (request) => request.status === "pending",
    ).length,

    approved: leaveRequests.filter(
      (request) => request.status === "approved",
    ).length,

    rejected: leaveRequests.filter(
      (request) => request.status === "rejected",
    ).length,

    cancelled: leaveRequests.filter(
      (request) => request.status === "cancelled",
    ).length,
  };
};

export const getRecentLeaveRequests = (
  limit = 5,
): LeaveRequest[] => {
  return [...leaveRequests]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
};

export const getDashboardStats = (
  date: string,
): DashboardStats => {
  const activeEmployees = employees.filter((employee) => {
    if (employee.joiningDate > date) {
      return false;
    }

    if (
      employee.resignationDate &&
      employee.resignationDate < date
    ) {
      return false;
    }

    return true;
  });

  const todayAttendance = attendanceRecords.filter(
    (record) => record.date === date,
  );

  const presentToday = todayAttendance.filter(
    (record) => record.status === "present",
  ).length;

  const lateToday = todayAttendance.filter(
    (record) => record.status === "late",
  ).length;

  const halfDayToday = todayAttendance.filter(
    (record) => record.status === "half_day",
  ).length;

  const absentToday = todayAttendance.filter(
    (record) => record.status === "absent",
  ).length;

  const onLeaveToday = todayAttendance.filter(
    (record) => record.status === "leave",
  ).length;

  const workingEmployees = todayAttendance.filter(
    (record) =>
      record.status === "present" ||
      record.status === "late" ||
      record.status === "half_day" ||
      record.status === "absent" ||
      record.status === "leave",
  );

  const attendanceRate =
    workingEmployees.length > 0
      ? Math.round(
          ((presentToday + lateToday + halfDayToday) /
            workingEmployees.length) *
            100,
        )
      : 0;

  const pendingLeaveRequests = leaveRequests.filter(
    (request) => request.status === "pending",
  ).length;

  return {
    totalEmployees: activeEmployees.length,
    presentToday,
    lateToday,
    halfDayToday,
    absentToday,
    onLeaveToday,
    attendanceRate,
    pendingLeaveRequests,
  };
};