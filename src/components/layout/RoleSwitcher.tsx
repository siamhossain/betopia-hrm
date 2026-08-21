"use client";

import { useRouter } from "next/navigation";
import type { NavigationRole } from "./navigation";

interface RoleSwitcherProps {
  role: NavigationRole;
}

export function RoleSwitcher({ role }: RoleSwitcherProps) {
  const router = useRouter();

  const handleRoleChange = (nextRole: NavigationRole) => {
    if (nextRole === role) {
      return;
    }

    if (nextRole === "admin") {
      router.push("/dashboard");
      return;
    }

    router.push("/employee/profile");
  };

  return (
    <div className="w-fit rounded-lg border bg-white p-1">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleRoleChange("admin")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
            role === "admin"
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Admin / HR
        </button>

        <button
          type="button"
          onClick={() => handleRoleChange("employee")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
            role === "employee"
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Employee
        </button>
      </div>
    </div>
  );
}
