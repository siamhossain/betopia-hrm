import { mockSessions } from "@/data/mockSession";

export default function EmployeeProfilePage() {
  const employee = mockSessions.employee;

  return (
    <section>
      <div>
        <p className="text-sm font-medium text-gray-500">Employee Portal</p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">My Profile</h1>

        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {employee.name}.
        </p>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">Employee ID</dt>
            <dd className="mt-1 font-medium text-gray-900">
              {employee.employeeId}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="mt-1 font-medium capitalize text-gray-900">
              {employee.role}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-gray-500">Name</dt>
            <dd className="mt-1 font-medium text-gray-900">{employee.name}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
