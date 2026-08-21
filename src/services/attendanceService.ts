import { attendanceRecords } from "@/data/attendance";
import { attendanceSettings } from "@/data/settings";
import { employees } from "@/data/employees";
import { holidays } from "@/data/holidays";
import { departments } from "@/data/departments";
import type { AttendanceRecord } from "@/types/attendance";
import type { AttendanceStatus } from "@/types/attendance";


export interface AttendanceQuery {
  employeeId?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceRecord["status"];
}

export interface AttendanceSummary {
  totalWorkingDays: number;
  presentDays: number;
  lateDays: number;
  halfDays: number;
  absentDays: number;
  leaveDays: number;
  attendancePercentage: number;
  totalLateMinutes: number;
}

export interface AttendanceListItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  workingMinutes?: number;
  lateMinutes?: number;
}

export const getAttendanceByDate = (
  date: string,
): AttendanceListItem[] => {
  const records: (AttendanceListItem | null)[] = attendanceRecords
    .filter((record) => record.date === date)
    .map((record): AttendanceListItem | null => {
      const employee = employees.find(
        (item) => item.id === record.employeeId,
      );

      if (!employee) {
        return null;
      }

      const department = departments.find(
        (item) => item.id === employee.departmentId,
      );

      return {
        id: record.id,
        employeeId: record.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        department: department?.name ?? "Unknown",
        date: record.date,
        status: record.status,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        workingMinutes: record.workingMinutes,
        lateMinutes: record.lateMinutes,
      };
    });

  return records.filter(
    (record): record is AttendanceListItem => record !== null,
  );
};

export const getAttendanceList = (
  query: AttendanceQuery = {},
): AttendanceListItem[] => {
  const records = getAttendance(query);

  return records
    .map((record): AttendanceListItem | null => {
      const employee = employees.find(
        (item) => item.id === record.employeeId,
      );

      if (!employee) {
        return null;
      }

      const department = departments.find(
        (item) => item.id === employee.departmentId,
      );

      return {
        id: record.id,
        employeeId: record.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        department: department?.name ?? "Unknown",
        date: record.date,
        status: record.status,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        workingMinutes: record.workingMinutes,
        lateMinutes: record.lateMinutes,
      };
    })
    .filter(
      (record): record is AttendanceListItem =>
        record !== null,
    );
};

const isDateInRange = (
  date: string,
  startDate?: string,
  endDate?: string,
): boolean => {
  if (startDate && date < startDate) {
    return false;
  }

  if (endDate && date > endDate) {
    return false;
  }

  return true;
};

const isEmployeeActiveOnDate = (
  employeeId: string,
  date: string,
): boolean => {
  const employee = employees.find(
    (item) => item.id === employeeId,
  );

  if (!employee) {
    return false;
  }

  if (date < employee.joiningDate) {
    return false;
  }

  if (
    employee.resignationDate &&
    date > employee.resignationDate
  ) {
    return false;
  }

  return true;
};

const isHoliday = (date: string): boolean => {
  return holidays.some(
    (holiday) => holiday.date === date,
  );
};

const isWorkingDay = (date: string): boolean => {
  const day = new Date(`${date}T00:00:00`).getDay();

  return (
    attendanceSettings.workingDays.includes(day) &&
    !isHoliday(date)
  );
};

export const getAttendance = (
  query: AttendanceQuery = {},
): AttendanceRecord[] => {
  return attendanceRecords.filter((record) => {
    const employee = employees.find(
      (item) => item.id === record.employeeId,
    );

    if (!employee) {
      return false;
    }

    if (
      query.employeeId &&
      record.employeeId !== query.employeeId
    ) {
      return false;
    }

    if (
      query.departmentId &&
      employee.departmentId !== query.departmentId
    ) {
      return false;
    }

    if (
      query.status &&
      record.status !== query.status
    ) {
      return false;
    }

    if (
      !isDateInRange(
        record.date,
        query.startDate,
        query.endDate,
      )
    ) {
      return false;
    }

    if (
      !isEmployeeActiveOnDate(
        record.employeeId,
        record.date,
      )
    ) {
      return false;
    }

    return true;
  });
};

export const getEmployeeAttendance = (
  employeeId: string,
  startDate?: string,
  endDate?: string,
): AttendanceRecord[] => {
  return getAttendance({
    employeeId,
    startDate,
    endDate,
  });
};

export const calculateAttendanceSummary = (
  employeeId: string,
  startDate?: string,
  endDate?: string,
): AttendanceSummary => {
  const records = getEmployeeAttendance(
    employeeId,
    startDate,
    endDate,
  );

  const workingRecords = records.filter((record) =>
    isWorkingDay(record.date),
  );

  const presentDays = workingRecords.filter(
    (record) => record.status === "present",
  ).length;

  const lateDays = workingRecords.filter(
    (record) => record.status === "late",
  ).length;

  const halfDays = workingRecords.filter(
    (record) => record.status === "half_day",
  ).length;

  const absentDays = workingRecords.filter(
    (record) => record.status === "absent",
  ).length;

  const leaveDays = workingRecords.filter(
    (record) => record.status === "leave",
  ).length;

  const totalLateMinutes = workingRecords.reduce(
    (total, record) => total + (record.lateMinutes ?? 0),
    0,
  );

  const totalWorkingDays = workingRecords.length;

  const attendanceDays =
    presentDays +
    lateDays +
    halfDays * 0.5;

  const attendancePercentage =
    totalWorkingDays === 0
      ? 0
      : Number(
          ((attendanceDays / totalWorkingDays) * 100).toFixed(2),
        );

  return {
    totalWorkingDays,
    presentDays,
    lateDays,
    halfDays,
    absentDays,
    leaveDays,
    attendancePercentage,
    totalLateMinutes,
  };
};