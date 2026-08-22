# Betopia HRM — Codebase Overview

## 1. Overview

Betopia HRM is an HR management module focused on **Attendance and Leave Management**.

The project demonstrates:

- Next.js App Router
- React + TypeScript
- Reusable UI components
- Service-layer business logic
- Role-based employee/admin experiences
- Mock data with realistic business rules
- Unit testing with Vitest

## 2. Tech Stack

- **Next.js 16** — App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Vitest** — unit testing
- **ESLint** — code quality

## 3. Architecture

The project follows a simple layered structure:

```text
src/
├── app/          # Routes and page composition
├── components/   # Reusable UI components
├── data/         # Mock data and mock session
├── services/     # Business logic and data operations
├── types/        # Shared TypeScript domain types
└── lib/          # Shared utilities
```

### Data Flow

```text
Page
  ↓
Reusable Components
  ↓
Service Layer
  ↓
Mock Data
```

Pages are responsible mainly for composition and UI state, while business rules are kept inside service modules.

## 4. Main Modules

### Admin

- Dashboard
- Attendance
- Employees
- Leave Management
- Reports
- Settings

### Employee

- My Attendance
- My Leave
- My Requests
- My Profile

## 5. Service Layer

Business logic is separated from UI components.

### `attendanceService.ts`

Handles:

- Attendance filtering
- Employee/date validation
- Working-day detection
- Holiday handling
- Attendance summaries
- Attendance percentage calculation

### `leaveService.ts`

Handles:

- Leave balance calculation
- Leave request validation
- Overlapping leave detection
- Leave balance validation
- Leave creation
- Approval
- Rejection
- Cancellation

### `employeeService.ts`

Handles employee-related data access, filtering and pagination.

### `dashboardService.ts`

Provides dashboard statistics and attendance/leave summaries.

## 6. Business Rules

Important leave rules include:

- Start date cannot be after end date.
- Leave requires a reason.
- Half-day leave must be for a single date.
- Leave cannot start before joining date.
- Leave cannot extend beyond resignation date.
- Overlapping pending/approved leave requests are rejected.
- Requested leave cannot exceed the available allocation.
- Only pending requests can be approved or rejected.
- Only approved requests can be cancelled.

## 7. Role-Based Experience

A mock session is used to demonstrate different user experiences:

```text
Admin
  → Full HR management features

Employee
  → Personal attendance, leave and request features
```

The session is currently mock data because this assessment focuses on frontend architecture and functionality rather than production authentication.

## 8. Testing

Vitest is used for service-layer testing.

Current tests cover:

- Leave balance calculation
- Invalid date ranges
- Missing leave reason
- Half-day validation
- Overlapping leave requests
- Leave balance limits
- Dashboard calculations

Run tests with:

```bash
npm run test
```

## 9. Code Quality

Before submission, the project should pass:

```bash
npm run lint
npm run test
npm run build
```

All three commands are used as the final verification before submission.

## 10. Mock Data

The application currently uses local mock data instead of a backend/database.

This keeps the assessment focused on:

- Frontend architecture
- Type safety
- Business logic
- UI/UX
- State handling
- Reusable components
- Testability

A production implementation could replace the data layer with API/database repositories without requiring major changes to the UI architecture.

## 11. Known Assessment Scope

This is intentionally a frontend-focused assessment implementation.

Production authentication, backend APIs, database persistence and real-time synchronization are outside the current scope.

The architecture keeps these concerns separated so they can be introduced later without restructuring the entire application.
