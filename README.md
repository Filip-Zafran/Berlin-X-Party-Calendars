# Berlin Events Platform

A small production-ready React app for a Berlin events platform with:

- Public page with two expandable event calendars
- Admin login via Supabase Auth
- Admin dashboard for create / edit / delete
- Supabase-backed events table
- Row Level Security example policies

## Stack

- React
- Vite
- Tailwind CSS
- React Router
- Supabase
- Framer Motion
- date-fns
- lucide-react

## File structure

```text
berlin-events-full/
├── public/
├── src/
│   ├── components/
│   │   ├── CalendarPreview.jsx
│   │   ├── EventFilters.jsx
│   │   ├── EventForm.jsx
│   │   ├── EventModal.jsx
│   │   ├── EventTable.jsx
│   │   ├── ExpandableCalendar.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── StatusMessage.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useEvents.js
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   └── Home.jsx
│   ├── utils/
│   │   └── eventUtils.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase/
│   └── schema.sql
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

Copy `.env.example` to `.env` and add your values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run the SQL

Open your Supabase SQL editor and run:

```text
supabase/schema.sql
```

This creates:

- `events` table
- `organizer_accounts` table
- helper function `is_organizer()`
- RLS policies
- 2 sample events

### 4. Create an organizer user

In Supabase Auth:

- create a user with email + password
- copy that user's UUID
- run:

```sql
insert into public.organizer_accounts (user_id)
values ('YOUR_AUTH_USER_UUID_HERE');
```

### 5. Start the app

```bash
npm run dev
```

### 6. Build for production

```bash
npm run build
```

## Routes

- `/` public events page
- `/admin` organizer login
- `/admin/dashboard` protected organizer dashboard

## How the expand/minimize interaction works

The homepage stores one shared state value called `activeCategory`.

- If `activeCategory === 'non_monogamous'`, that calendar expands
- If `activeCategory === 'sex_positive'`, that calendar expands
- The inactive calendar shrinks
- On desktop both are visible in one row, with the active one getting more flex width
- On mobile they stack, and the active one visually dominates

The animation uses Framer Motion `layout` transitions for smooth resizing.

## Notes

- Public users can read events
- Only organizer accounts can insert, update, or delete
- The app intentionally keeps state simple and beginner-friendly
- If Supabase env vars are missing, the UI shows a helpful setup message instead of crashing
