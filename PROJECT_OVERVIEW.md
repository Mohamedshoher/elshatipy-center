# Elshatipy Center Management System - Project Overview

## 1. System Summary
**Elshatipy Center Management System** is a comprehensive React-based web application designed to manage the educational, administrative, and financial aspects of "Elshatipy Center" (مركز الشاطبي). It serves multiple user roles including Directors, Supervisors, Teachers, and Parents, providing tailored interfaces for each to ensure smooth operations.

## 2. Technology Stack
*   **Frontend Framework**: React 18 (TypeScript)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (Vanilla CSS in `index.css` for custom animations)
*   **Database & Backend**: Firebase (Firestore, Auth - implied by usage patterns)
*   **Routing**: React Router DOM
*   **Icons**: Heroicons (Custom wrapper components in `components/icons`)
*   **State Management**: React Context / Local State / Prop Drilling (with some service-based logic)

## 3. Directory Structure
The project follows a standard React application structure:

### Root Directory
*   `App.tsx`: **CORE FILE**. Handles main routing, global state (CurrentUser, Students, Teachers, Groups), initial data fetching, and high-level layout logic.
*   `main.tsx`: Entry point.
*   `index.css`: Global styles and Tailwind directives.
*   `types.ts`: TypeScript definitions for all data models (Student, Teacher, Group, etc.).

### `/components`
Contains all the UI blocks and pages. Key sub-directories/files:
- **Core Views**:
    - `LandingPage.tsx`: The public face of the website. Responsive, dynamic content.
    - `LoginScreen.tsx` / `ParentLoginScreen.tsx`: Authentication portals.
    - `Dashboard.tsx`: General dashboard widgets (configurable).
    - `ParentDashboard.tsx`: Specific view for parents.
- **Management Pages** (Director/Supervisor):
    - `AllStudentsPage.tsx`: Student list management.
    - `GroupsPage.tsx`: Group management.
    - `TeacherManagerPage.tsx`: Staff management.
    - `FinancePage.tsx`: Financial overview, expenses, salaries.
    - `GeneralViewPage.tsx`: High-level daily overview.
- **Reports**:
    - `AttendanceReportPage.tsx`, `TestsReportPage.tsx`, `FinancialReportPage.tsx`.
- **Modals & Forms**:
    - `StudentForm.tsx`, `TeacherManagerModal.tsx`, `FeePaymentModal.tsx`.
    - `ChatPage.tsx`: Integrated internal messaging system.
- **CMS**:
    - `LandingPageContentManager.tsx`: Tool for Directors to edit the Landing Page content inline.

### `/services`
Business logic isolated from UI components:
*   `firebase.ts`: Firebase configuration and initialization.
*   `dataService.ts`: Helper functions for filtering and processing data.
*   `deductionService.ts`: Logic for calculating and applying salary deductions.
*   `notificationService.ts`: Handling system notifications.
*   `parentGenerationService.ts`: Logic to auto-generate parent accounts from student data.

### `/hooks`
Custom React hooks:
*   `useLandingPageContent.ts`: Fetches CMS content.
*   `useOnlineStatus.ts`: Tracks internet connectivity.
*   `useAutomationChecks.ts`: Periodic system checks (automated deductions, etc.).

## 4. User Roles & Permissions
The system dynamically renders content based on `currentUser.role`:

1.  **Director (`director`)**:
    *   **Access**: Full control. Can see all pages (Finance, Settings, Staff, Students).
    *   **Key Features**: Manage users, edit landing page, global notifications, financial reports.
2.  **Supervisor (`supervisor`)**:
    *   **Access**: Limited scope, often defined by `section`.
    *   **Key Features**: Manage students/groups within their section, attendance, reports.
3.  **Teacher (`teacher`)**:
    *   **Access**: Focused on assigned groups and students.
    *   **Key Features**: Daily reports, student attendance, adding test scores, viewing personal salary/deductions.
    *   **Note**: Teachers have a "Home" toggle to switch between their Dashboard and the Landing Page.
4.  **Parent (`parent`)**:
    *   **Access**: Read-only view of their children.
    *   **Key Features**: View children's progress, attendance, fees, and chat with teachers/admin.

## 5. Key Workflows

### Authentication
*   Users select their role (Staff/Parent) on the Landing Page login modal.
*   **Parents**: Login via Phone Number.
*   **Staff**: Select name from list + Password.

### Student Management
*   **Add/Edit**: Via `StudentForm` modal.
*   **Status**: Active, Archived, or Pending (for online registration).
*   **Details**: `StudentDetailsPage` shows full history (Notes, Payments, Attendance, Quran Progress).

### Attendance & Reports (Daily Workflow)
*   Teachers access their group view.
*   Submit daily reports (attendance + lesson taken).
*   System automatically calculates deductions for late/missing reports (managed by `deductionService`).

### Finance
*   **Fees**: Tracked per student via `FeePaymentModal`.
*   **Salaries**: Calculated based on base salary +/- deductions/bonuses.
*   **Expenses**: General center expenses logged in `FinancePage`.

## 6. Layout & Navigation
*   **Sidebar**: Main navigation for Directors/Supervisors.
*   **BottomNavBar**: Mobile navigation for quick access.
*   **Header**: Context-aware top bar (shows current view title, search, logout).
*   **Responsive Design**: The app is heavily optimized for mobile (Tailwind breakpoints `sm`, `md`, `lg`).

## 7. Important Configuration
*   **Timezone**: Operations are standardized to **Cairo Time** (UTC+2/UTC+3). See `services` for date handling.
*   **Language**: Arabic (RTL) is the primary and only interface language.
*   **Theme**: Blue/Indigo/Teal color scheme defined in Tailwind classes.

## 8. Development Notes
*   **Wait for Data**: The `App.tsx` handles a large initial data load. Use `Suspense` and Skeleton screens (`components/Skeleton.tsx`) for perceived performance.
*   **Navigation**: Use `handleBackButton()` in `App.tsx` logic for consistent "Back" behavior across deep hierarchies and modals.
