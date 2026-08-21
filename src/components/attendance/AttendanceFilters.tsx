"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface AttendanceFiltersProps {
  departments: {
    id: string;
    name: string;
  }[];
  statuses: {
    value: string;
    label: string;
  }[];
}

export function AttendanceFilters({
  departments,
  statuses,
}: AttendanceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const date = searchParams.get("date") ?? "2026-08-20";
  const status = searchParams.get("status") ?? "";
  const departmentId = searchParams.get("departmentId") ?? "";

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/attendance?${params.toString()}`);
  };

  const changeDate = (offset: number) => {
    const currentDate = new Date(`${date}T00:00:00`);

    currentDate.setDate(currentDate.getDate() + offset);

    const nextDate = currentDate.toISOString().split("T")[0];

    updateFilters({ date: nextDate });
  };

  const resetFilters = () => {
    router.push("/attendance");
  };

  return (
    <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label
            htmlFor="attendance-date"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Date
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => changeDate(-1)}
              className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ←
            </button>

            <input
              id="attendance-date"
              type="date"
              value={date}
              onChange={(event) => updateFilters({ date: event.target.value })}
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
            />

            <button
              type="button"
              onClick={() => changeDate(1)}
              className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              →
            </button>
          </div>
        </div>

        <div className="flex-1">
          <label
            htmlFor="attendance-status"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="attendance-status"
            value={status}
            onChange={(event) => updateFilters({ status: event.target.value })}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
          >
            <option value="">All statuses</option>

            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="attendance-department"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Department
          </label>

          <select
            id="attendance-department"
            value={departmentId}
            onChange={(event) =>
              updateFilters({
                departmentId: event.target.value,
              })
            }
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
          >
            <option value="">All departments</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={resetFilters}
          className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
