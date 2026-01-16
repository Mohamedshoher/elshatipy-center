# Professional AI Prompt: Educational Management System (Rebuild)

**Role:** You are a Senior Frontend Architect and Full-Stack Engineer specializing in React, Next.js, and Firebase.

**Objective:** Build a comprehensive, production-grade Educational Management System (LMS/ERP) named "El-Shatibi Center".

**CRITICAL ARCHITECTURAL CONSTRAINT:**
> **⛔ ABSOLUTELY NO MONOLITHIC FILES.**
> You typically pile all routing, state, and fetching logic into a single `App.tsx` file. **THIS IS FORBIDDEN.**
> You MUST use a **Feature-Based Architecture** within **Next.js (App Router)**.
> Every feature (Students, Teachers, Finance) must be self-contained with its own components, hooks, and types.

---

## 1. Technology Stack (Strict)
- **Framework:** Next.js 14+ (App Router) - *To enforce file-based routing.*
- **Language:** TypeScript (Strict mode) - *For distinct interfaces.*
- **Styling:** Tailwind CSS (Mobile-first, premium UI, glassmorphism support).
- **Backend:** Firebase v9 (Firestore, Auth, Storage) - *Modular SDK usage.*
- **State Management:** Zustand (for global state) + React Query (TanStack Query) for data fetching. *Do not use raw `useEffect` for data fetching.*
- **Icons:** Lucide React or Heroicons.

---

## 2. Directory Structure (Mandatory)
Do not create a flat structure. Follow this exact tree:

```
src/
├── app/                        # Next.js App Router (Pages & Layouts only)
│   ├── (auth)/login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Sidebar & Header Logic here
│   │   ├── page.tsx            # Main Dashboard
│   │   ├── students/           # Students Route
│   │   ├── teachers/           # Teachers Route
│   │   └── finance/            # Finance Route
│   └── layout.tsx              # Root Layout (Providers)
│
├── components/                 # Shared UI Components (Atoms/Molecules)
│   ├── ui/                     # Button, Modal, Input, Card (Generic)
│   └── ...
│
├── features/                   # THE CORE LOGIC (Domain Driven)
│   ├── students/
│   │   ├── components/         # StudentCard, StudentForm (Specific)
│   │   ├── hooks/              # useStudents, useAttendance
│   │   ├── services/           # firebase/studentService.ts
│   │   └── types/              # Student Interfaces
│   │
│   ├── teachers/               # Teachers Domain
│   │   ├── components/
│   │   ├── hooks/
│   │   └── ...
│   │
│   ├── finance/                # Finance Domain
│   │   └── ...
│
├── lib/                        # Configurations
│   ├── firebase.ts
│   └── utils.ts
│
├── store/                      # Global State (Zustand)
│   ├── useAuthStore.ts
│   └── useUIStore.ts
```

---

## 3. Core Features & Requirements

### A. Authentication & Roles
- **System:** Custom Login Screen (No generic auth UI).
- **Roles:**
  1. **Director (Admin):** Full access to everything.
  2. **Supervisor:** Access to specific groups/sections.
  3. **Teacher:** Access only to their own groups and students.
  4. **Parent:** Access only to their children's reports.
- **Logic:** Store user role in a global `useAuthStore` and protect routes using Next.js Middleware or Layout checks.

### B. Student Management (`features/students`)
- **CRUD:** Add, Edit, Archive, Delete students.
- **Details:** A comprehensive profile page for each student with tabs:
  - *Attendance Log* (Calendar view).
  - *Progress Plan* (Quran memorization tracking).
  - *Tests/Exams* (Scores and dates).
  - *Fees* (Payment history).
- **Logic:** Use `useStudents` hook to fetch data. Do NOT fetch inside the UI component.

### C. Teacher & HR Management (`features/teachers`)
- **Profiles:** Manage teachers and their assigned groups.
- **Attendance:** Track teacher attendance (Present, Absent, Excuse).
- **Automation (Crucial):**
  - If a teacher fails to submit a daily report by 12:00 AM, the system must auto-deduct/flag them.
  - *Implementation:* Create a persistent hook or backend function that checks `lastLogin` or report timestamps.

### D. Financial System (`features/finance`)
- **Modules:**
  - Income (Student Fees, Donations).
  - Expenses (Salaries, bills).
  - Reports (Monthly/Yearly summaries).
- **Logic:** All calculations must be in `services/financeCalculations.ts`, not in the UI.

### E. User Experience (UX/UI)
- **Design:** "Premium, Modern, Glassmorphism". High attention to padding, rounded corners, and smooth transitions.
- **Responsiveness:** 100% Mobile-first. Sidebars must become bottom sheets or hamburger menus on mobile.
- **Loading:** Use Skeleton loaders (`react-loading-skeleton`) for all data fetches.

---

## 4. Implementation Rules for You (The AI)
1.  **One File, One Component:** Never put multiple exported components in one file.
2.  **Service Layer Pattern:** All Firebase calls (`getDocs`, `updateDoc`) must be in the `services/` folder. The UI components should only call hooks (e.g., `const { data } = useStudents()`).
3.  **Strict Typing:** No `any`. Define interfaces for `Student`, `Teacher`, `Transaction` and import them.
4.  **Incremental Build:** Do not try to generate the whole app at once. Start with the **Project Skeleton**, then **Authentication**, then **Student Feature**.

---

**Start by generating the project structure and the `types/index.ts` file to define our data models.**
