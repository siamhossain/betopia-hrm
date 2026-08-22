import { attendanceSettings } from "@/data/settings";

export default function SettingsPage() {
  return (
    <section>
      <div>
        <p className="text-sm font-medium text-gray-500">
          System Configuration
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">Settings</h1>

        <p className="mt-2 text-sm text-gray-600">
          Review the current HRM attendance configuration.
        </p>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Attendance Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current default working schedule used by the HRM system.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Office Start Time</p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {attendanceSettings.officeStartTime}
            </p>
          </div>

          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Office End Time</p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {attendanceSettings.officeEndTime}
            </p>
          </div>

          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Late Threshold</p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {attendanceSettings.lateThresholdMinutes} min
            </p>
          </div>

          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Working Days</p>

            <p className="mt-1 text-xl font-semibold text-gray-900">
              {attendanceSettings.workingDays.length} days
            </p>
          </div>
        </div>

        <div className="mt-6 border-t pt-5">
          <p className="text-sm font-medium text-gray-700">Working Schedule</p>

          <p className="mt-1 text-sm text-gray-500">Sunday through Thursday</p>
        </div>
      </div>
    </section>
  );
}
