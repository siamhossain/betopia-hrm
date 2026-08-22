"use client";

import { useEffect, useMemo, useState } from "react";

import { EmployeeDetails } from "@/components/employees/EmployeeDetails";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { queryEmployees } from "@/services/employeeService";
import type { Employee } from "@/types/employee";

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

const PAGE_SIZE = 10;

export function EmployeeFilters({ initialEmployees }: EmployeeFiltersProps) {
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState<Employee["status"] | "">("");

  const [sortBy, setSortBy] = useState<"name" | "joiningDate" | "employeeCode">(
    "name",
  );

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  useEffect(() => {
    setPage(1);
  }, [search, departmentId, status, sortBy, sortOrder]);

  const result = useMemo(() => {
    return queryEmployees({
      search,
      departmentId: departmentId || undefined,
      status: status || undefined,
      sortBy,
      sortOrder,
      page,
      pageSize: PAGE_SIZE,
    });
  }, [search, departmentId, status, sortBy, sortOrder, page]);

  const hasFilters = Boolean(
    search ||
    departmentId ||
    status ||
    sortBy !== "name" ||
    sortOrder !== "asc",
  );

  const clearFilters = () => {
    setSearch("");
    setDepartmentId("");
    setStatus("");
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  const employees =
    result.data.length > 0 || hasFilters || page > 1
      ? result.data
      : initialEmployees.slice(0, PAGE_SIZE);

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handlePreviousPage = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setPage((currentPage) => Math.min(result.totalPages, currentPage + 1));
  };

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

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            {result.total === 0
              ? "No employees found"
              : `Showing ${(result.page - 1) * result.pageSize + 1}–${Math.min(
                  result.page * result.pageSize,
                  result.total,
                )} of ${result.total} employees`}
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
        {employees.length > 0 ? (
          <EmployeeTable employees={employees} onView={handleView} />
        ) : (
          <div className="rounded-xl border bg-white px-6 py-12 text-center shadow-sm">
            <p className="font-medium text-gray-900">No employees found</p>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {result.total > 0 && result.totalPages > 1 && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Page {result.page} of {result.totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={result.page === 1}
              className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: result.totalPages },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={result.page === pageNumber ? "page" : undefined}
                  className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    result.page === pageNumber
                      ? "bg-gray-900 text-white"
                      : "border text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={result.page === result.totalPages}
              className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </>
  );
}
