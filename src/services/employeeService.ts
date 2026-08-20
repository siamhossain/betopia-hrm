import { employees } from "@/data/employees";
import type { Employee } from "@/types/employee";

export interface EmployeeQuery {
  search?: string;
  departmentId?: string;
  status?: Employee["status"];
  sortBy?: "name" | "joiningDate" | "employeeCode";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface PaginatedEmployees {
  data: Employee[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const getEmployeeName = (employee: Employee): string =>
  `${employee.firstName} ${employee.lastName}`;

export const getEmployees = (): Employee[] => {
  return [...employees];
};

export const getEmployeeById = (
  employeeId: string,
): Employee | undefined => {
  return employees.find((employee) => employee.id === employeeId);
};

export const queryEmployees = (
  query: EmployeeQuery = {},
): PaginatedEmployees => {
  const {
    search = "",
    departmentId,
    status,
    sortBy = "name",
    sortOrder = "asc",
    page = 1,
    pageSize = 10,
  } = query;

  const normalizedSearch = search.trim().toLowerCase();

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.employeeCode,
        employee.designation,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesDepartment =
      !departmentId || employee.departmentId === departmentId;

    const matchesStatus = !status || employee.status === status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  filteredEmployees.sort((first, second) => {
    let firstValue: string;
    let secondValue: string;

    switch (sortBy) {
      case "joiningDate":
        firstValue = first.joiningDate;
        secondValue = second.joiningDate;
        break;

      case "employeeCode":
        firstValue = first.employeeCode;
        secondValue = second.employeeCode;
        break;

      case "name":
      default:
        firstValue = getEmployeeName(first);
        secondValue = getEmployeeName(second);
        break;
    }

    const comparison = firstValue.localeCompare(secondValue);

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const total = filteredEmployees.length;
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));

  const safePage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (safePage - 1) * safePageSize;

  const data = filteredEmployees.slice(
    startIndex,
    startIndex + safePageSize,
  );

  return {
    data,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
};