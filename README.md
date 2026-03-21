# TaskFlow — Task Management Dashboard

A modern, feature-rich task management dashboard built with React 18, TypeScript, Vite, and Tailwind CSS.

![TaskFlow Dashboard](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss)

---

## Features

### Core Features
- **Task Creation** — Create tasks with title, description, priority (Low/Medium/High), and due date
- **Task Display** — View tasks in **List View** or **Card View** (toggle-based)
- **Edit Tasks** — Edit any task via a modal-based editor
- **Delete Tasks** — Delete with confirmation dialog to prevent accidental removal
- **Task Status** — Toggle tasks between Pending/Completed with visual indicators (strikethrough, opacity, color coding)
- **Search & Filter** — Real-time search by title/description; filter by status and priority
- **Task Counts** — Dashboard stats showing Total, Pending, and Completed task counts
- **Data Persistence** — All data stored in `localStorage` and survives page refresh
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile

### Bonus Features
- **Card View Toggle** — Switch between list and grid card layouts
- **Dark / Light Mode** — Toggle with animated sun/moon icon; persists preference
- **Drag-and-Drop Reordering** — Reorder tasks by dragging; built as a **reusable component**
- **Smooth Animations** — Entrance animations, hover micro-interactions, modal transitions
- **TypeScript** — Fully typed with strict mode enabled
- **Unit Tests** — Jest + React Testing Library tests for utilities and components

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Vite** | Build tool & dev server |
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS 3** | Utility-first styling |
| **React Query (TanStack)** | API-ready data layer |
| **Jest** | Unit testing |
| **React Testing Library** | Component testing |
| **uuid** | Unique ID generation |

---

## Project Structure

```
src/
├── components/
│   ├── common/                # Reusable UI components
│   │   ├── DragAndDrop/       # ★ Reusable drag-and-drop component
│   │   │   ├── DragAndDrop.tsx # Main component (heavily commented)
│   │   │   └── index.ts       # Barrel export
│   │   ├── Badge.tsx          # Status/priority pill
│   │   ├── Button.tsx         # Multi-variant button
│   │   ├── ConfirmDialog.tsx  # Delete confirmation
│   │   ├── Modal.tsx          # Accessible modal dialog
│   │   └── index.ts           # Barrel export
│   ├── layout/
│   │   └── Header.tsx         # App header with logo + theme toggle
│   ├── tasks/
│   │   ├── Dashboard.tsx      # Main page orchestrator
│   │   ├── EmptyState.tsx     # No-tasks placeholder
│   │   ├── FilterBar.tsx      # Search + filter + view toggle
│   │   ├── TaskCard.tsx       # Card view item
│   │   ├── TaskForm.tsx       # Create/Edit form
│   │   ├── TaskList.tsx       # List wrapper with DnD
│   │   ├── TaskListItem.tsx   # List view item
│   │   └── TaskStats.tsx      # Count cards
│   └── theme/
│       └── ThemeToggle.tsx    # Dark/light mode button
├── context/
│   └── ThemeContext.tsx        # Theme state provider
├── hooks/
│   ├── useLocalStorage.ts     # Generic localStorage sync hook
│   └── useTasks.ts            # Task CRUD + reorder logic
├── types/
│   └── task.ts                # TypeScript interfaces & enums
├── utils/
│   └── taskUtils.ts           # Pure helper functions
├── App.tsx                    # Root component
├── main.tsx                   # Entry point
└── index.css                  # Global styles + Tailwind

__tests__/
├── taskUtils.test.ts          # Utility function tests
└── components.test.tsx        # Component rendering tests
```

---

## Drag-and-Drop Component

The drag-and-drop functionality is built as a **standalone, reusable component** located at `src/components/common/DragAndDrop/DragAndDrop.tsx`.

### Key Design Decisions
- Uses the **native HTML Drag and Drop API** (no external libraries)
- Fully **generic** — works with any data type via TypeScript generics
- Supports both **vertical list** and **CSS grid** layouts
- Extensively **commented** for learning purposes

### How to Reuse

```tsx
import { DragAndDropList } from '@/components/common/DragAndDrop';

<DragAndDropList
  items={myItems}                             // Your data array
  keyExtractor={(item) => item.id}            // Unique key per item
  renderItem={(item, index, isDragging) => (  // Your custom renderer
    <MyCard data={item} faded={isDragging} />
  )}
  onReorder={(fromIndex, toIndex) => {        // Handle the reorder
    reorderMyItems(fromIndex, toIndex);
  }}
  grid={false}                                // true for grid layout
/>
```

### How It Works (Step by Step)
1. Each item is wrapped in a `<div draggable="true">`
2. `onDragStart` — stores the index of the grabbed item
3. `onDragOver` — tracks the current hover target for visual feedback
4. `onDrop` — fires `onReorder(fromIndex, toIndex)` so the parent updates state
5. `onDragEnd` — cleans up all visual indicators

---

## Design Decisions

1. **Component Architecture** — Small, focused components with single responsibilities. All reusable components are in `common/` and can be used independently.

2. **State Management** — React hooks + Context API (no Redux needed for this scale). `useLocalStorage` provides persistence, `useTasks` encapsulates all CRUD logic.

3. **Styling** — Tailwind CSS with a custom design system (brand colors, custom fonts, animations). Dark mode uses Tailwind's `class` strategy with a context provider.

4. **TypeScript Strict Mode** — All types are explicit, no `any` usage. Enums for Priority and Status ensure type safety across the app.

5. **React Query** — Included and configured for future API integration. Currently the app uses localStorage, but swapping to API calls requires minimal changes.

6. **Accessibility** — Modals trap focus, use `aria-modal`, close on Escape. Buttons have `aria-label`. List items have proper ARIA roles.

---

## Setup & Installation

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Steps

```bash
# 1. Extract the ZIP and navigate to the project
cd task-management-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

### Other Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Screenshots

### Light Mode — List View
> The default view showing all tasks in a clean list layout with status counts.

### Dark Mode — Card View
> Toggle to dark mode and card view for a grid-based layout with colored priority borders.

### Create Task Modal
> Modal dialog with validated form fields for title, description, priority, and due date.

### Mobile Responsive
> Fully responsive layout that stacks gracefully on smaller screens.

---

## Deployment

The app is ready for deployment on any static hosting platform:

```bash
# Build the production bundle
npm run build

# The output is in the `dist/` folder
# Upload to Vercel, Netlify, or GitHub Pages
```

### Vercel (Recommended)
```bash
npx vercel
```

### Netlify
```bash
npx netlify deploy --prod --dir=dist
```

---

## License

This project was created as a coding assignment submission.
