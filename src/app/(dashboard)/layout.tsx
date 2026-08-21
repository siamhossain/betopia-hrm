import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { mockSessions } from "@/data/mockSession";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AppShell role={mockSessions.admin.role}>{children}</AppShell>;
}
