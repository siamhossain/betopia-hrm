import { attendanceRecords } from "@/data/attendance";
import { employees } from "@/data/employees";
import { leaveRequests } from "@/data/leaveRequests";

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