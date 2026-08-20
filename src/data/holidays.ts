import type { Holiday } from "@/types/attendance";

export const holidays: Holiday[] = [
  {
    id: "holiday-independence",
    name: "Independence Day",
    date: "2026-03-26",
    isRecurring: true,
  },
  {
    id: "holiday-eid-ul-fitr",
    name: "Eid-ul-Fitr",
    date: "2026-03-21",
    isRecurring: false,
  },
  {
    id: "holiday-may-day",
    name: "May Day",
    date: "2026-05-01",
    isRecurring: true,
  },
  {
    id: "holiday-eid-ul-adha",
    name: "Eid-ul-Adha",
    date: "2026-05-28",
    isRecurring: false,
  },
  {
    id: "holiday-victory-day",
    name: "Victory Day",
    date: "2026-12-16",
    isRecurring: true,
  },
  {
    id: "holiday-christmas",
    name: "Christmas Day",
    date: "2026-12-25",
    isRecurring: true,
  },
];