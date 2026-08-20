export type UserRole = "admin" | "employee";

export type EmployeeStatus = "active"| "on_leave" | "resigned" | "inactive";

export interface UserSession {
  userId: string;
  role: UserRole;
}