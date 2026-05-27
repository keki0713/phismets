# PHISMETS — Member & Attendance Management System

A web-based admin dashboard and member portal for the **Philippine Society of Medical Technology Students (PHISMETS)**. Built to streamline attendance tracking, member management, and event coordination using QR-based check-in.

---

## Project Description

PHISMETS is a React-based web application that provides:

- **Admin Dashboard** — overview of members, events, attendance stats, and pending approvals
- **QR Scanner** — scan member IDs for real-time event check-in/check-out
- **Member Portal** — members can view their attendance history and profile
- **Auth Screens** — login and signup flow for officers and members
- **Reports** — exportable attendance and payment summaries

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

> No environment variables are required. This is a frontend prototype with mock data.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/keki0713/phismets.git
   ```

2. Navigate into the project folder:
   ```bash
   cd phismets
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at:
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

---

## Team Members and Roles

| Name | Role |
|------|------|
| Esmaya | Project Manager |
| Duquesa | QA/Test Engineer |
| Sanchez | Systems Analysist |
| Diola | Programmer/Developer |
| Gause | Software Architect |

---

## Links

- **Figma Prototype:** [Admin Dashboard Prototype](https://www.figma.com/design/tULz1Pm8eH85e4SxgMqUAY/PHISMETS-Prototype?node-id=0-1&t=O7OyXdHK5SgHX9hE-1)
- **Deployed Version:** *(Add link when deployed)*
- **Repository:** *(Add GitHub link)*

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui + Radix UI** — accessible component library
- **Recharts** — data visualization
- **Motion (Framer Motion)** — animations
- **React Router v7** — client-side routing
- **Lucide React** — icons
