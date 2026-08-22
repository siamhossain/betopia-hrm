# Betopia HRM — Security Notes

## 1. Authentication

This assessment uses a **mock session** instead of real authentication.

The current implementation demonstrates different Admin and Employee experiences through `mockSession`.

In production, authentication should be handled by a secure authentication system with server-side session/token validation.

## 2. Authorization

The application separates Admin and Employee functionality.

- **Admin** — HR management features such as employees, attendance and leave management.
- **Employee** — Personal attendance, leave and request features.

In production, authorization must be enforced **server-side**, not only through frontend route visibility.

## 3. Input Validation

Leave requests are validated through the service layer before creation.

Validation includes:

- Valid date range
- Required leave reason
- Employee existence
- Leave type existence
- Joining/resignation date restrictions
- Half-day restrictions
- Overlapping leave detection
- Leave balance limits

Keeping these rules in the service layer prevents business rules from being dependent on individual UI components.

## 4. Data Protection

The current application uses mock data only and does not store real employee information.

A production implementation should:

- Avoid exposing sensitive employee information to the client.
- Validate and sanitize API input.
- Protect sensitive endpoints.
- Use HTTPS.
- Store secrets only in environment variables.
- Never commit credentials or tokens to Git.

## 5. Production Authentication & API Security

If connected to a backend, the application should additionally implement:

- Secure authentication
- Server-side role/permission checks
- Protected API routes
- Secure session management
- Rate limiting where appropriate
- Request validation
- Proper error handling without exposing internal details
- Database access controls

## 6. Current Assessment Scope

This project intentionally uses mock data and a mock session because the assessment focuses primarily on frontend architecture, business logic, UI implementation and testability.

The current mock implementation should **not be considered production-ready authentication or authorization**.

The service-layer separation allows the mock data source to be replaced with secured backend APIs later without requiring major UI restructuring.
