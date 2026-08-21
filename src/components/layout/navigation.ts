export type NavigationRole = "admin" | "employee";

export interface NavigationItem {
  label: string;
  href: string;
  roles: NavigationRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["admin"],
  },
  {
    label: "Employees",
    href: "/employees",
    roles: ["admin"],
  },
  {
    label: "Attendance",
    href: "/attendance",
    roles: ["admin"],
  },
  {
    label: "Leave",
    href: "/leave",
    roles: ["admin"],
  },
  {
    label: "Reports",
    href: "/reports",
    roles: ["admin"],
  },
  {
    label: "Settings",
    href: "/settings",
    roles: ["admin"],
  },
  {
    label: "My Profile",
    href: "/employee/profile",
    roles: ["employee"],
  },
  {
    label: "My Attendance",
    href: "/employee/attendance",
    roles: ["employee"],
  },
  {
    label: "My Leave",
    href: "/employee/leave",
    roles: ["employee"],
  },
  {
    label: "My Requests",
    href: "/employee/requests",
    roles: ["employee"],
  },
];