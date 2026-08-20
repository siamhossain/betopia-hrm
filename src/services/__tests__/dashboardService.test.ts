import { describe, expect, it } from "vitest";
import { employees } from "@/data/employees";
import { getDashboardStats } from "@/services/dashboardService";

describe("Dashboard Service", () => {
  it("calculates dashboard statistics from attendance data", () => {
    const stats = getDashboardStats("2026-08-20");

    expect(stats.totalEmployees).toBeGreaterThan(0);

    expect(stats.presentToday).toBeGreaterThanOrEqual(0);
    expect(stats.lateToday).toBeGreaterThanOrEqual(0);
    expect(stats.halfDayToday).toBeGreaterThanOrEqual(0);
    expect(stats.absentToday).toBeGreaterThanOrEqual(0);
    expect(stats.onLeaveToday).toBeGreaterThanOrEqual(0);

    expect(stats.attendanceRate).toBeGreaterThanOrEqual(0);
    expect(stats.attendanceRate).toBeLessThanOrEqual(100);

    expect(stats.pendingLeaveRequests).toBeGreaterThanOrEqual(0);
  });

  it("does not count weekends as working attendance", () => {
    const stats = getDashboardStats("2026-08-15");

    expect(stats.presentToday).toBe(0);
    expect(stats.lateToday).toBe(0);
    expect(stats.absentToday).toBe(0);
    expect(stats.attendanceRate).toBe(0);
  });

  it("counts only employees active on the requested date", () => {
    const stats = getDashboardStats("2026-06-01");

    const expectedActiveEmployees = employees.filter(
      (employee) => {
        if (employee.joiningDate > "2026-06-01") {
          return false;
        }

        if (
          employee.resignationDate &&
          employee.resignationDate < "2026-06-01"
        ) {
          return false;
        }

        return true;
      },
    ).length;

    expect(stats.totalEmployees).toBe(
      expectedActiveEmployees,
    );
  });
});