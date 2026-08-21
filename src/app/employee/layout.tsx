import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { mockSessions } from "@/data/mockSession";

interface EmployeeLayoutProps {
  children: ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  return <AppShell role={mockSessions.employee.role}>{children}</AppShell>;
}
