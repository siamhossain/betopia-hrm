"use client";

import { useState } from "react";
import type { NavigationRole } from "./navigation";
import { Sidebar } from "./Sidebar";

interface HeaderProps {
  role: NavigationRole;
}

export function Header({ role }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          ☰
        </button>

        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Notifications"
          >
            🔔
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {role === "admin" ? "HR Administrator" : "Employee"}
              </p>

              <p className="text-xs capitalize text-gray-500">{role}</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
              {role === "admin" ? "HR" : "EM"}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isMenuOpen ? "visible" : "invisible"
        }`}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/30 transition-opacity duration-500 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close navigation menu"
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`relative h-full w-72 bg-white shadow-xl transition-transform duration-500 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar role={role} mobile onNavigate={() => setIsMenuOpen(false)} />
        </div>
      </div>
    </>
  );
}
