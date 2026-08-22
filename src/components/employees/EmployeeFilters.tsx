"use client";

import { useMemo, useState } from "react";

import { queryEmployees } from "@/services/employeeService";
import type { Employee } from "@/types/employee";
import { EmployeeTable } from "@/components/employees/EmployeeTable";

interface EmployeeFiltersProps {
  initialEmployees: Employee[];
}

const departments = [
  { id: "dept-engineering", name: "Engineering" },
  { id: "dept-human-resources", name: "Human Resources" },
  { id: "dept-finance", name: "Finance" },
  { id: "dept-marketing", name: "Marketing" },
  { id: "dept-operations", name: "Operations" },
  { id: "dept-sales", name: "Sales" },
];

export function EmployeeFilters({ initialEmployees }: EmployeeFiltersProps) {
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState<Employee["status"] | "">("");
  const [sortBy, setSortBy] = useState<"name" | "joiningDate" | "employeeCode">(
    "name",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const result = useMemo(() => {
    return queryEmployees({
      search,
      departmentId: departmentId || undefined,
      status: status || undefined,
      sortBy,
      sortOrder,
      page: 1,
      pageSize: 50,
    });
  }, [search, departmentId, status, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearch("");
    setDepartmentId("");
    setStatus("");
    setSortBy("name");
    setSortOrder("asc");
  };

  const hasFilters = Boolean(
    search ||
    departmentId ||
    status ||
    sortBy !== "name" ||
    sortOrder !== "asc",
  );

  const employees = result.data.length
    ? result.data
    : search || departmentId || status
      ? []
      : initialEmployees;

  return (
    <>
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <label
              htmlFor="employee-search"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Search
            </label>

            <input
              id="employee-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email, code or designation..."
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="employee-department"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Department
            </label>

            <select
              id="employee-department"
              value={departmentId}
              onChange={(event) => setDepartmentId(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400"
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
              htmlFor="employee-status"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="employee-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as Employee["status"] | "")
              }
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
              <option value="resigned">Resigned</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="employee-sort"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Sort By
            </label>

            <select
              id="employee-sort"
              value={`${sortBy}-${sortOrder}`}
              onChange={(event) => {
                const [nextSortBy, nextSortOrder] = event.target.value.split(
                  "-",
                ) as ["name" | "joiningDate" | "employeeCode", "asc" | "desc"];

                setSortBy(nextSortBy);
                setSortOrder(nextSortOrder);
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400"
            >
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="joiningDate-asc">Joining Date — Oldest</option>
              <option value="joiningDate-desc">Joining Date — Newest</option>
              <option value="employeeCode-asc">
                Employee Code — Ascending
              </option>
              <option value="employeeCode-desc">
                Employee Code — Descending
              </option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Showing {employees.length} of {result.total} employees
          </p>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mt-6">
        <EmployeeTable employees={employees} />
      </div>
    </>
  );
}
