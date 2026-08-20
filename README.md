# Time-manager-calendar-
A deadline-driven calendar: add missions with a due date and a category, and their priority escalates automatically from green to black as time runs out, with a live countdown and your free-time slots on a week/day/month view. No build, no server, .ics import and export.

# Time Manager (Calendar)

**Time Manager is a single-page planner built around deadlines, not appointments.** You add
"missions" with a due date and a category (To Do, Exam, Homework); the app computes their priority
automatically as the deadline approaches — green → orange → red → black — and shows a live
countdown next to each one. A week / day / month calendar displays them alongside your declared
free-time slots, so you can see how many usable hours are left before each deadline.

Everything runs in the browser: one `index.html`, plain CSS and plain JavaScript. No build step, no
server, no account. Data lives in `localStorage`, and missions can be exported to (or imported
from) any calendar app through `.ics` files.

---

## Table of contents

1. [Technical context](#1-technical-context)
2. [Domain concepts](#2-domain-concepts)
3. [Running it](#3-running-it)
4. [File tree](#4-file-tree)
5. [Blocks → files](#5-blocks--files)
6. [Architecture conventions](#6-architecture-conventions)
7. [Where to change what](#7-where-to-change-what)
8. [Data model](#8-data-model)
9. [Priority engine](#9-priority-engine)
10. [Single-file version](#10-single-file-version)
11. [Pitfalls](#11-pitfalls)

---

## 1. Technical context

| Item | Value |
|---|---|
| Type | Desktop-first single-page app (max width 1100 px) |
| Stack | HTML5, CSS3 (custom properties, dark + light theme), **classic** JS scripts |
| Build | none for the app itself; `node build.js` only for the single-file copy |
| Dependencies | none |
| Persistence | `localStorage`: `mc4` (missions), `mc4_ft` (free time), `mc4_theme` |
| Interop | iCalendar `.ics` import and export, with `RRULE` and `VALARM` |
| Rendering | full `innerHTML` rebuild via `render()`, re-run every 60 s |
| UI language | French |

> **Legacy naming.** The app was previously called *Mission Control*. The storage keys still start
> with `mc` on purpose: renaming them would silently wipe existing users' data. The word "mission"
> is also kept as the domain term for a task.

## 2. Domain concepts

| Concept | Meaning |
|---|---|
| **Mission** | a task with a title, description, colour, category and a **mandatory** deadline |
| **Category** | `todo`, `exam`, `devoir` or `none`; it defines the priority thresholds |
| **Priority** | derived, never stored: `green` (A faire) → `orange` (Priorité) → `red` (Urgent) → `black` (Critique) |
| **Countdown** | live time left before the deadline, negative and flagged "Dépassé" once overdue |
| **Free time** | one start/end slot per weekday, drawn on the calendar and used to compute usable hours |
| **Hours available** | sum of the free-time slots between now and the deadline, shown on every card |
| **Recurrence** | `daily` / `weekly` / `monthly` with an optional end date; expanded at render time only |
| **Hide** | temporarily removes a mission from the list until 03:00 the next morning |
| **Postpone** | moves an overdue deadline to today 23:59 and bumps the iCalendar `SEQUENCE` |
| **Views** | week (default), day, month; double-click any day header or cell to drill into day view |

## 3. Running it

```bash
python3 -m http.server 8000     # → http://localhost:8000
```
Or open `standalone/index.html` directly. GitHub Pages: `Settings → Pages → main / root`.

## 4. File tree

```
time-manager-calendar/
├── index.html               DOM structure + load order
├── README.md
├── .gitignore
├── build.js                 generates the single-file copy
├── standalone/index.html    (generated — never edit by hand)
├── css/
│   ├── 01-theme.css         dark/light variables, reset, body
│   ├── 02-shell.css         header, tabs, stats
│   ├── 03-freetime.css      free-time panel
│   ├── 04-calendar.css      week / day / month views
│   ├── 05-tasks.css         mission list
│   ├── 06-forms.css         add panel, fields, colour picker
│   └── 07-modals.css        modals + responsive
└── js/
    ├── 01-config.js         constants (colours, categories, thresholds)
    ├── 02-utils.js          dates, escaping, helpers
    ├── 03-state.js          state, migration, persistence, theme
    ├── 04-priority.js       priority, countdown, free hours
    ├── 05-events.js         recurrence expansion
    ├── 06-render-shell.js   clock, stats, free time, colour picker
    ├── 07-calendar.js       week, day, month, navigation
    ├── 08-tasks.js          list and mission card
    ├── 09-detail.js         detail modal
    ├── 10-crud.js           create, edit, postpone, delete
    ├── 11-ics.js            iCalendar export / import
    └── 12-init.js           master render() and bootstrap
```

## 5. Blocks → files

| Block | Sub-parts | File |
|---|---|---|
| 1 | 1.1 dark palette · 1.2 light palette · 1.3 reset · 1.4 body | `css/01-theme.css` |
| 2 | 2.1 header · 2.2 tabs · 2.3 main · 2.4 stats | `css/02-shell.css` |
| 3 | 3.1 collapsible panel · 3.2 per-day inputs | `css/03-freetime.css` |
| 4 | 4.1 calendar header · 4.2 schedule grid · 4.3 events · 4.4 month grid | `css/04-calendar.css` |
| 5 | 5.1 section title · 5.2 card · 5.3 meta · 5.4 actions · 5.5 empty state | `css/05-tasks.css` |
| 6 | 6.1 add bar · 6.2 panel · 6.3 fields · 6.4 colour picker · 6.5 buttons | `css/06-forms.css` |
| 7 | 7.1 overlay · 7.2 box · 7.3 edit modal · 7.4 detail modal · 7.5 responsive | `css/07-modals.css` |
| 8 | 8.1 header · 8.2 tabs · 8.3 containers · 8.4 add panel · 8.5 modals | `index.html` |
| 9 | 9.1 palette · 9.2 layout constant · 9.3 categories · 9.4 day names | `js/01-config.js` |
| 10 | 10.1 ids & escaping · 10.2 time formatting · 10.3 date maths | `js/02-utils.js` |
| 11 | 11.1 migration · 11.2 state · 11.3 persistence · 11.4 theme | `js/03-state.js` |
| 12 | 12.1 priority · 12.2 labels & colours · 12.3 status · 12.4 free hours · 12.5 countdown | `js/04-priority.js` |
| 13 | 13.1 recurrence expansion | `js/05-events.js` |
| 14 | 14.1 clock · 14.2 stats · 14.3 free time · 14.4 colour picker | `js/06-render-shell.js` |
| 15 | 15.1 dispatch · 15.2 header · 15.3 week · 15.4 day · 15.5 month · 15.6 navigation | `js/07-calendar.js` |
| 16 | 16.1 list · 16.2 card | `js/08-tasks.js` |
| 17 | 17.1 open · 17.2 close | `js/09-detail.js` |
| 18 | 18.1 create · 18.2 delete/complete · 18.3 hide/postpone · 18.4 edit | `js/10-crud.js` |
| 19 | 19.1 build · 19.2 export · 19.3 import | `js/11-ics.js` |
| 20 | 20.1 UI toggles · 20.2 master render · 20.3 bootstrap | `js/12-init.js` |

## 6. Architecture conventions

- **Classic scripts, shared global scope.** The `<script>` order (01 → 12) is **contractual**;
  `12-init.js` calls `render()` and assumes everything else is loaded. No modules, no `defer`.
- **Priority and countdown are always derived**, never persisted. Changing a mission's category
  instantly changes its priority — that is by design.
- **Recurring missions are stored once.** `eventsInRange()` expands them on the fly for the current
  view, with a 500-iteration safety cap. No occurrence is ever written to storage.
- **Indices, not ids, drive the UI.** Handlers receive the array index `_i` captured at render
  time; any mutation is immediately followed by `save(); render();` so indices stay valid.
- `render()` re-runs every 60 s to refresh countdowns, the "now" line and expired hidden flags.
- Every user string goes through `esc()` before being injected into HTML.

## 7. Where to change what

| I want to… | File | Anchor |
|---|---|---|
| change the priority thresholds | `js/01-config.js` | `CATS` (values are in days) |
| add a category | `js/01-config.js` + `index.html` | `CATS`, plus an `<option>` in `#iCat` and `#eCat` |
| change the palette offered for missions | `js/01-config.js` | `COLORS` |
| change row height in the schedule | `js/01-config.js` | `HH` (px per hour) |
| change how free hours are counted | `js/04-priority.js` | `getFreeHours` |
| change the countdown wording | `js/04-priority.js` | `getCountdown` |
| support a new recurrence | `js/05-events.js` + `js/11-ics.js` | expansion loop, then `RRULE` mapping |
| restyle the week view | `css/04-calendar.css` | 4.2 / 4.3 |
| change the reminder in exported `.ics` | `js/11-ics.js` | `VALARM`, `TRIGGER:-PT30M` |
| change "hide until" behaviour | `js/10-crud.js` | `hideTask` (currently 03:00) |
| rename the app in the UI | `index.html` | `<title>` and `.logo` |

## 8. Data model

**Mission**
```js
{ uid: 'tm-...@tm',              // stable iCalendar identifier
  title, description,
  deadline: '2026-03-14T18:00',  // datetime-local string, always present
  category: 'todo'|'exam'|'devoir'|'none',
  color: '#3b82f6',
  sequence: 0,                   // iCalendar revision, bumped on every edit
  hiddenUntil: null,             // ISO string or null
  recurring: { type: 'none'|'daily'|'weekly'|'monthly', endDate: 'YYYY-MM-DD' } }
```

**Free time** — `{ mon: { s: '18:00', e: '20:00' }, … sun: {…} }`, one slot per weekday.

**localStorage keys** — `mc4`, `mc4_ft`, `mc4_theme` (legacy prefix, see §1). `migrate()` in
`js/03-state.js` backfills any missing field, so bump the key only on a truly breaking change.

## 9. Priority engine

`CATS` holds three thresholds **in days** per category. `getPriority()` compares the remaining days
to them, from the most urgent down:

| Category | black (Critique) | red (Urgent) | orange (Priorité) |
|---|---|---|---|
| To Do | 0.2083 (≈ 5 h) | 1 day | 2 days |
| Exam | 2 days | 4 days | 7 days |
| Devoir | 1 day | 2 days | 5 days |
| none | — | — | — (always green) |

## 10. Single-file version

`standalone/index.html` is generated by `node build.js`, which inlines every local `css/` and `js/`
file into one document: download it, double-click it, it works offline.
**Never edit it by hand** — edit the sources and rebuild.

## 11. Pitfalls

- ❌ Reordering the `<script>` tags → `ReferenceError` at boot.
- ❌ Renaming the `mc4*` storage keys → existing data silently disappears.
- ❌ Storing priority on the mission: it must stay derived from category + deadline.
- ❌ Materialising recurring occurrences into `tasks` — the app assumes one stored record per rule.
- ❌ Keeping a stale `_i` index across an async gap: always re-render right after mutating `tasks`.
- ❌ Injecting user text without `esc()`.
- ❌ Editing `standalone/index.html` instead of the sources.






mkdir time-manager-calendar && cd time-manager-calendar
# créer les fichiers des parties 1 à 4, plus build.js et le workflow
node build.js                       # génère standalone/index.html
git init && git add . && git commit -m "feat: Time Manager (Calendar), modular blocks 1-20"
gh repo create time-manager-calendar --public --source=. --push \
  --description "Time Manager (Calendar) is a deadline-driven planner: add missions with a due date and a category, and their priority escalates automatically from green to black as time runs out, with a live countdown and your free-time slots on a week/day/month view. No build, no server, .ics import/export."

