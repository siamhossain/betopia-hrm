import type { EmployeeStatus } from "./common";

export interface Employee {
  id: string;
  employeeCode: string;

  firstName: string;
  lastName: string;
  email: string;

  departmentId: string;
  designation: string;

  joiningDate: string;
  resignationDate?: string;

  status: EmployeeStatus;

  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}