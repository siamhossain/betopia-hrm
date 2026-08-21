"use client";

import { useMemo, useState } from "react";

import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import {
  getAttendanceByDate,
  type AttendanceListItem,
} from "@/services/attendanceService";

const ATTENDANCE_DATE = "2026-08-20";

const statusOptions: {
  value: AttendanceListItem["status"] | "all";
  label: string;
}[] = [
  { value: "all", label: "All Statuses" },
  { value: "present", label: "Present" },
  { value: "late", label: "Late" },
  { value: "half_day", label: "Half Day" },
  { value: "absent", label: "Absent" },
  { value: "leave", label: "Leave" },
];

const formatDate = (date: string) => {
  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const changeDate = (date: string, days: number) => {
  const [year, month, day] = date.split("-").map(Number);

  const currentDate = new Date(year, month - 1, day);

  currentDate.setDate(currentDate.getDate() + days);

  const nextYear = currentDate.getFullYear();
  const nextMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const nextDay = String(currentDate.getDate()).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
};

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(ATTENDANCE_DATE);
  const [selectedStatus, setSelectedStatus] = useState<
    AttendanceListItem["status"] | "all"
  >("all");

  const attendanceRecords = useMemo(
    () => getAttendanceByDate(selectedDate),
    [selectedDate],
  );

  const filteredRecords = useMemo(() => {
    if (selectedStatus === "all") {
      return attendanceRecords;
    }

    return attendanceRecords.filter(
      (record) => record.status === selectedStatus,
    );
  }, [attendanceRecords, selectedStatus]);

  const handlePreviousDay = () => {
    setSelectedDate((currentDate) => changeDate(currentDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate((currentDate) => changeDate(currentDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(ATTENDANCE_DATE);
  };

  return (
    <section>
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-gray-500">
          Attendance Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">Attendance</h1>

        <p className="mt-2 text-sm text-gray-600">
          Track employee attendance and daily working status.
        </p>
      </div>

      {/* Filters & Date Navigation */}
      <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          {/* Date Navigation */}
          <div>
            <label
              htmlFor="attendance-date"
              className="block text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Attendance Date
            </label>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePreviousDay}
                className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                ← Previous
              </button>

              <input
                id="attendance-date"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
              />

              <button
                type="button"
                onClick={handleNextDay}
                className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Next →
              </button>

              <button
                type="button"
                onClick={handleToday}
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Today
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {formatDate(selectedDate)}
            </p>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-56">
            <label
              htmlFor="attendance-status"
              className="block text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Status
            </label>

            <select
              id="attendance-status"
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value as AttendanceListItem["status"] | "all",
                )
              }
              className="mt-2 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Summary */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredRecords.length}
          </span>{" "}
          attendance records
        </p>

        <button
          type="button"
          onClick={() => setSelectedStatus("all")}
          disabled={selectedStatus === "all"}
          className="text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
        >
          Clear filter
        </button>
      </div>

      {/* Attendance Table */}
      <div className="mt-4">
        {filteredRecords.length > 0 ? (
          <AttendanceTable records={filteredRecords} />
        ) : (
          <div className="rounded-xl border bg-white px-6 py-12 text-center shadow-sm">
            <p className="font-medium text-gray-900">
              No attendance records found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try selecting another date or changing the status filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
