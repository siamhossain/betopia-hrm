import type { AttendanceRecord, Holiday } from "@/types/attendance";
import { employees } from "./employees";
import { holidays } from "./holidays";
import { leaveRequests } from "./leaveRequests";
import { attendanceSettings } from "./settings";

const START_DATE = "2026-06-01";
const END_DATE = "2026-08-20";

const pad = (value: number) => String(value).padStart(2, "0");

const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
};

const parseDate = (date: string): Date => {
  return new Date(`${date}T00:00:00`);
};

const isDateInRange = (
  date: string,
  startDate: string,
  endDate: string,
): boolean => {
  return date >= startDate && date <= endDate;
};

const isHoliday = (date: string, holidayList: Holiday[]): boolean => {
  return holidayList.some((holiday) => holiday.date === date);
};

const isEmployeeActiveOnDate = (
  employee: (typeof employees)[number],
  date: string,
): boolean => {
  if (date < employee.joiningDate) {
    return false;
  }

  if (employee.resignationDate && date > employee.resignationDate) {
    return false;
  }

  return true;
};

const getApprovedLeaveForDate = (employeeId: string, date: string) => {
  return leaveRequests.find(
    (request) =>
      request.employeeId === employeeId &&
      request.status === "approved" &&
      isDateInRange(date, request.startDate, request.endDate),
  );
};

/**
 * Creates a deterministic number from a string.
 *
 * We use this instead of Math.random() so that the same
 * employee/date combination always produces the same result.
 */
const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const createAttendanceRecord = (
  employeeId: string,
  date: string,
  status: AttendanceRecord["status"],
  seed: number,
): AttendanceRecord => {
  if (status === "absent" || status === "leave") {
    return {
      id: `att-${employeeId}-${date}`,
      employeeId,
      date,
      status,
    };
  }

  if (status === "half_day") {
    return {
      id: `att-${employeeId}-${date}`,
      employeeId,
      date,
      status,
      checkIn: "09:00",
      checkOut: "13:00",
      workingMinutes: 240,
      lateMinutes: 0,
    };
  }

  const lateMinutes = status === "late" ? 16 + (seed % 30) : 0;

  const checkInMinutes =
    status === "late"
      ? 9 * 60 + lateMinutes
      : 8 * 60 + 45 + (seed % 15);

  const checkOutMinutes = 18 * 60 + (seed % 10);

  const workingMinutes = checkOutMinutes - checkInMinutes;

  const checkInHour = Math.floor(checkInMinutes / 60);
  const checkInMinute = checkInMinutes % 60;

  const checkOutHour = Math.floor(checkOutMinutes / 60);
  const checkOutMinute = checkOutMinutes % 60;

  return {
    id: `att-${employeeId}-${date}`,
    employeeId,
    date,
    status,
    checkIn: `${pad(checkInHour)}:${pad(checkInMinute)}`,
    checkOut: `${pad(checkOutHour)}:${pad(checkOutMinute)}`,
    workingMinutes,
    lateMinutes,
  };
};

const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];

  const startDate = parseDate(START_DATE);
  const endDate = parseDate(END_DATE);

  for (
    let currentDate = startDate;
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const date = formatDate(currentDate);
    const dayOfWeek = currentDate.getDay();

    for (const employee of employees) {
      if (!isEmployeeActiveOnDate(employee, date)) {
        continue;
      }

      const holiday = isHoliday(date, holidays);

      if (holiday) {
        records.push({
          id: `att-${employee.id}-${date}`,
          employeeId: employee.id,
          date,
          status: "holiday",
        });

        continue;
      }

      if (!attendanceSettings.workingDays.includes(dayOfWeek)) {
        records.push({
          id: `att-${employee.id}-${date}`,
          employeeId: employee.id,
          date,
          status: "weekend",
        });

        continue;
      }

      const leave = getApprovedLeaveForDate(employee.id, date);

      if (leave) {
        records.push(
          createAttendanceRecord(
            employee.id,
            date,
            leave.duration === "half_day" ? "half_day" : "leave",
            hashString(`${employee.id}-${date}`),
          ),
        );

        continue;
      }

      const seed = hashString(`${employee.id}-${date}`);

      let status: AttendanceRecord["status"];

      /*
       * Deterministic distribution:
       *
       * ~75% Present
       * ~12% Late
       * ~7% Half Day
       * ~6% Absent
       */
      if (seed % 100 < 75) {
        status = "present";
      } else if (seed % 100 < 87) {
        status = "late";
      } else if (seed % 100 < 94) {
        status = "half_day";
      } else {
        status = "absent";
      }

      records.push(
        createAttendanceRecord(
          employee.id,
          date,
          status,
          seed,
        ),
      );
    }
  }

  return records;
};

export const attendanceRecords = generateAttendanceRecords();