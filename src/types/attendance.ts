export type AttendanceStatus =
  | "present"
  | "late"
  | "half_day"
  | "absent"
  | "leave"
  | "holiday"
  | "weekend";

export interface AttendanceRecord {
  id: string;

  employeeId: string;
  date: string;

  status: AttendanceStatus;

  checkIn?: string;
  checkOut?: string;

  workingMinutes?: number;
  lateMinutes?: number;
}

export interface AttendanceSettings {
  officeStartTime: string;
  officeEndTime: string;

  lateThresholdMinutes: number;

  workingDays: number[];
}

export interface Holiday {
  id: string;

  name: string;
  date: string;

  isRecurring: boolean;
}