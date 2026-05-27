# PHISMETS Style Guide

This document defines the coding standards and conventions for the PHISMETS project. All team members must follow these rules. Graders and reviewers will check the actual code against this guide.

---

## 1. Naming Conventions

### Files and Folders
- **Components:** PascalCase — `AdminDashboard.tsx`, `MemberPortal.tsx`
- **Utilities / helpers:** camelCase — `mockData.ts`, `utils.ts`
- **Styles:** kebab-case — `tailwind.css`, `theme.css`
- **Folders:** camelCase — `components/`, `app/`, `styles/`

### Variables and Functions
- **Variables:** camelCase — `scannerOpen`, `memberModal`, `pendingPayments`
- **Functions:** camelCase, verb-first — `handleScanLog()`, `onAdminLogin()`, `setMembers()`
- **Boolean variables:** prefix with `is`, `has`, or `show` — `isActive`, `hasError`, `showPassword`
- **Constants:** UPPER_SNAKE_CASE — `MAX_RETRIES`, `API_BASE_URL`

### Types and Interfaces
- **Types:** PascalCase — `Member`, `Event`, `ScanLog`, `Tab`
- **Props interfaces:** PascalCase with `Props` suffix — `AdminDashboardProps`, `ButtonProps`

### CSS / Tailwind
- Use Tailwind utility classes by default
- Custom CSS variables use kebab-case — `--color-primary`, `--font-heading`
- Avoid inline styles except for dynamic values (e.g., computed widths, brand colors from theme)

---

## 2. Formatting Rules

### General
- **Indentation:** 2 spaces (no tabs)
- **Line length:** max 100 characters
- **Quotes:** double quotes `"` for JSX attributes; single quotes `'` for JS/TS strings
- **Semicolons:** omitted (rely on ASI) — consistent with the existing codebase
- **Trailing commas:** always in multi-line objects and arrays

### React / JSX
- One component per file
- Self-close tags with no children: `<Logo />` not `<Logo></Logo>`
- Destructure props at the function signature level:
  ```tsx
  // ✅ Good
  export function Button({ label, onClick }: ButtonProps) { ... }

  // ❌ Bad
  export function Button(props: ButtonProps) {
    const label = props.label;
  }
  ```
- Keep JSX return statements clean — extract complex logic into named variables above the return

### TypeScript
- Always type function parameters and return values
- Use `type` for object shapes; use `interface` only when extension is needed
- Avoid `any` — use `unknown` or proper types instead

---

## 3. Commenting Standards

### When to Comment
- Comment **why**, not **what** — the code shows what, comments explain intent
- All non-obvious logic must have an inline comment
- All exported functions and components must have a JSDoc comment

### JSDoc (for exported functions/components)
```tsx
/**
 * Renders the main admin sidebar with navigation tabs.
 * Highlights the active tab and shows a badge for pending approvals.
 */
export function AdminDashboard({ onLogout }: { onLogout: () => void }) { ... }
```

### Inline Comments
```tsx
// Limit scan log history to last 30 entries to avoid memory bloat
setScans((s) => [log, ...s].slice(0, 30));
```

### What NOT to Comment
```tsx
// ❌ Bad — states the obvious
const count = members.length; // get the length of members
```

---

## 4. Branch Naming

All branches must follow this format:

```
type/short-description
```

### Types
| Type | When to use |
|------|-------------|
| `feat` | New feature or screen |
| `fix` | Bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no feature change |
| `chore` | Config, dependencies, tooling |

### Examples
```
feat/admin-dashboard
feat/qr-scanner
fix/login-redirect
docs/readme-setup
refactor/member-portal-cleanup
```

**Rules:**
- All lowercase, words separated by hyphens
- No spaces, no underscores, no special characters
- Branch off from `main` for features; merge back via Pull Request only

---

## 5. Commit Message Format

Follow the **Conventional Commits** standard:

```
type(scope): short description
```

- **type** — same types as branch naming (`feat`, `fix`, `docs`, `style`, `refactor`, `chore`)
- **scope** — the component or area affected (optional but recommended)
- **description** — present tense, lowercase, no period at the end

### Examples
```
feat(dashboard): add attendance summary cards
feat(qr-scanner): implement check-in and check-out logging
fix(auth): redirect officer to dashboard after login
docs(readme): add setup instructions and team roles
style(sidebar): fix active tab highlight alignment
refactor(mockData): extract types to separate types.ts file
chore(deps): update lucide-react to 0.487.0
```

### Rules
- **Never commit directly to `main`** — always use a branch + Pull Request
- Commit often and in small chunks — one logical change per commit
- Avoid: `"update"`, `"fix stuff"`, `"final"`, `"asdfg"`, `"changes"`

---

## 6. Pull Request Standards

- Every feature branch must be merged via a PR, not a direct push
- PR title must follow the same format as commit messages
- PR description must include:
  - What was changed
  - Why it was changed
  - Screenshots if UI was affected
- At least one team member must review before merging

---

## Color & Design Tokens

Primary brand colors used throughout the app (defined in `theme.css`):

| Token | Value | Usage |
|-------|-------|-------|
| Primary Dark | `#083026` | Sidebar background, headers |
| Primary Mid | `#145E32` | Gradient start, accents |
| Primary Green | `#22C55E` | Highlights, badges, active states |
| Background | `#F3F4F6` | App background |
| Text Light | `#EBF5E9` | Text on dark backgrounds |
| Danger | `#EF4444` | Error states, unpaid badges |

Font families:
- **Headings / Logo:** `Poppins` (700 weight)
- **Body / UI:** `Inter`
