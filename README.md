# HRM Attendance & Leave Management

A production-style **Human Resource Management (HRM) frontend** built with Next.js and TypeScript.

This project was developed as a frontend technical assessment using realistic mock data and a service layer designed to simulate API-driven application architecture.

## Tech Stack

- **Next.js 16** — App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Vitest**
- Mock data with TypeScript

## Key Features

### Admin / HR

- Employee management
  - Search
  - Filtering
  - Sorting
  - Pagination
  - Employee overview

- Daily attendance management
- Monthly attendance view
- Attendance status handling:
  - Present
  - Late
  - Half Day
  - Absent
  - Leave
  - Holiday
  - Weekend

- Leave request management
- Approve / reject leave requests
- Cancel approved leave requests
- Leave balance calculations
- Monthly attendance summary
- HR dashboard statistics
- Attendance settings
- Reports

### Employee

- Employee profile
- Personal attendance view
- Leave balance
- Submit leave requests
- Leave request validation
- Leave request history
- Request status tracking

## Architecture

The application separates UI, business logic, data, and domain types.

```text
src/
├── app/              # Next.js routes and pages
├── components/       # Reusable UI components
├── data/             # Mock data
├── services/         # Business logic and data access
├── types/            # Domain TypeScript types
└── lib/              # Shared utilities
```

The UI communicates with the service layer rather than directly implementing business rules. This keeps the application structured for future API/backend integration.

Detailed architecture decisions are documented in [`CODEBASE.md`](./CODEBASE.md).

Security considerations and frontend limitations are documented in [`SECURITY.md`](./SECURITY.md).

## Business Logic

The service layer handles important HR rules including:

- Overlapping leave detection
- Full-day and half-day leave calculation
- Leave balance calculation
- Leave approval/rejection rules
- Approved leave cancellation
- Employee joining/resignation date validation
- Attendance filtering
- Working-day, weekend, and holiday handling
- Late-arrival calculations
- Invalid leave status transitions

Changes to leave requests are reflected in related balance calculations.

## Mock Data

The project is intentionally frontend-only, as required by the assessment.

Mock data is maintained separately from React components, including:

- Employees
- Departments
- Attendance records
- Holidays
- Leave types
- Leave requests
- Attendance settings
- Mock user sessions

The assessment explicitly requires mock data to remain separate from UI components and the frontend to be structured as though it were consuming real APIs.

## Getting Started

### Requirements

- Node.js
- npm

### Installation

```bash
git clone <repository-url>
cd betopia-hrm
npm install
```

### Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

### Validation

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm run test
```

## Test Coverage

Current automated tests cover key leave-management business rules.

```text
Test Files: 2 passed
Tests:      19 passed
```

The production build and TypeScript compilation also complete successfully.

## Demo Roles

A mock session is used to demonstrate the two required roles:

- **Admin / HR**
- **Employee**

Authentication is intentionally not implemented because the assessment specifies that frontend authentication is not required and a mock logged-in session should be used to demonstrate role-based access.

## Limitations

This is a frontend-only assessment implementation.

There is no:

- Real backend API
- Database persistence
- Real authentication
- Production session management
- Multi-user real-time synchronization

The service layer is intentionally designed so that the mock data implementation can later be replaced with API calls without coupling business logic directly to the UI.

## Documentation

- [`CODEBASE.md`](./CODEBASE.md) — Architecture, data flow, state management, component responsibilities, limitations, and extension strategy.
- [`SECURITY.md`](./SECURITY.md) — Security considerations, frontend limitations, and production security improvements.

## Assessment Focus

The implementation prioritizes:

- Clean architecture
- Type safety
- Reusable components
- Business-rule validation
- Predictable state updates
- Responsive UI
- Maintainable code
- Separation of UI and business logic
- Automated validation
