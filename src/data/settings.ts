import type { AttendanceSettings } from "@/types/attendance";

export const attendanceSettings: AttendanceSettings = {
  officeStartTime: "09:00",
  officeEndTime: "18:00",
  lateThresholdMinutes: 15,
  workingDays: [0, 1, 2, 3, 4],
};