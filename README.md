# My Tasks ✨ — Sticky Note Todo App

A playful, feature-rich todo list web app built with pure HTML, CSS, and JavaScript. No frameworks. No build step dependencies beyond Vite's dev server. Everything is stored locally in the browser using `localStorage`.

---

## Features

### Core
- **Add tasks** — type a task and press **Enter** or click **Add**
- **Complete tasks** — check the circle to mark done; strikethrough confirms completion
- **Delete tasks** — click the trash icon, or select a card and press **Delete / Backspace**
- **Edit tasks inline** — double-click any task text to edit it in place; press **Enter** to save or **Escape** to cancel
- **Persistent storage** — all tasks (text, due dates, completion state) survive page refresh via `localStorage`

### Due Dates & Urgency
- Optional **date picker** on each task
- Smart **urgency badges** auto-applied to sticky notes:
  - 🔥 **Overdue** — red badge + red left border
  - ⚡ **Due today** — orange badge + orange border
  - 🌅 **Tomorrow** — yellow badge + yellow border
  - 📅 **Upcoming** — blue badge with formatted date (e.g. Jul 4)
- Tasks are **auto-sorted** by urgency: overdue → today → tomorrow → upcoming → no date → completed

### Filtering
- **All / Active / Completed** filter tabs
- Filter preference saved to `localStorage` and restored on next visit

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Enter` | Add new task |
| `Double-click` text | Edit task inline |
| `Enter` (while editing) | Save edit |
| `Escape` (while editing) | Cancel edit |
| Click a card | Select it |
| `Delete` or `Backspace` | Remove selected task |
| `Escape` | Deselect task |

### Design
- **Sticky note cards** — pastel colours (yellow, pink, mint, sky blue, lavender) with slight CSS rotation per card and a soft layered shadow
- **Hover lift** — cards flatten and float on hover
- **Dark mode** — toggle via the 🌙 / ☀️ button; preference saved to `localStorage`
- **Fully responsive** — stacks cleanly on mobile; rotations disabled on small screens
- **Nunito font** — rounded, youthful typeface from Google Fonts
- **Clear done** button — removes all completed tasks in one click with a broom icon

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, animations, media queries) |
| Logic | Vanilla JavaScript (ES6+) |
| Icons | Font Awesome 6 |
| Font | Google Fonts — Nunito |
| Storage | Browser `localStorage` |
| Dev server | Vite (static file serving only) |

---

## Project Structure

```
artifacts/todo-app/
├── index.html      # App shell and markup
├── style.css       # All styles — themes, sticky notes, badges, responsive
├── script.js       # All logic — CRUD, sorting, filtering, editing, dark mode
└── vite.config.ts  # Vite dev server config (PORT from env)
```

---

## Running Locally

The app runs inside a Replit pnpm workspace. The dev server is started automatically by the workflow.

To start manually:

```bash
pnpm --filter @workspace/todo-app run dev
```

The app is served at the port assigned by the `PORT` environment variable (default via workflow config).

---

## How localStorage Is Used

| Key | Value |
|-----|-------|
| `tasks` | JSON array of task objects `{ id, text, dueDate, completed }` |
| `filter` | Active filter tab (`"all"` \| `"active"` \| `"completed"`) |
| `darkMode` | `"true"` or `"false"` |

Data persists across sessions. Clearing browser storage resets the app to a blank state.

---

## Screenshots

> Add tasks with optional due dates, filter by status, edit inline, and toggle dark mode — all without leaving the page.

---

## License

MIT — free to use, modify, and distribute.
