"use client";

import { useMemo, useState } from "react";

import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { departments } from "@/data/departments";
import {
  getAttendanceList,
  type AttendanceListItem,
} from "@/services/attendanceService";

const DEFAULT_MONTH = "2026-08";

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

const getMonthDateRange = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);

  const startDate = `${year}-${String(monthNumber).padStart(2, "0")}-01`;

  const lastDay = new Date(year, monthNumber, 0).getDate();

  const endDate = `${year}-${String(monthNumber).padStart(2, "0")}-${String(
    lastDay,
  ).padStart(2, "0")}`;

  return { startDate, endDate };
};

const formatMonth = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthNumber - 1, 1));
};

export default function AttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH);
  const [selectedStatus, setSelectedStatus] = useState<
    AttendanceListItem["status"] | "all"
  >("all");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const attendanceRecords = useMemo(() => {
    const { startDate, endDate } = getMonthDateRange(selectedMonth);

    return getAttendanceList({
      startDate,
      endDate,
      departmentId: selectedDepartment || undefined,
      status: selectedStatus === "all" ? undefined : selectedStatus,
    });
  }, [selectedMonth, selectedStatus, selectedDepartment]);

  return (
    <section>
      <div>
        <p className="text-sm font-medium text-gray-500">
          Attendance Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">Attendance</h1>

        <p className="mt-2 text-sm text-gray-600">
          Review employee attendance records by month, department, and status.
        </p>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="attendance-month"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Month
            </label>

            <input
              id="attendance-month"
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="attendance-department"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Department
            </label>

            <select
              id="attendance-department"
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
            >
              <option value="">All Departments</option>

              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="attendance-status"
              className="mb-1.5 block text-sm font-medium text-gray-700"
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
              className="w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
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

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {attendanceRecords.length}
          </span>{" "}
          records for{" "}
          <span className="font-semibold text-gray-900">
            {formatMonth(selectedMonth)}
          </span>
        </p>

        <button
          type="button"
          onClick={() => {
            setSelectedStatus("all");
            setSelectedDepartment("");
          }}
          disabled={selectedStatus === "all" && !selectedDepartment}
          className="text-left text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900 disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40 sm:text-right"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-4">
        {attendanceRecords.length > 0 ? (
          <AttendanceTable records={attendanceRecords} />
        ) : (
          <div className="rounded-xl border bg-white px-6 py-12 text-center shadow-sm">
            <p className="font-medium text-gray-900">
              No attendance records found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try selecting another month or changing the filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
