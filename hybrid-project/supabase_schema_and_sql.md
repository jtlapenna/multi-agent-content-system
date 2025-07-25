# 🧱 Supabase Schema: Blog Workflow State

## 📋 Table: `blog_workflow_state`

This table tracks the live status and metadata of every blog post in the system for dashboard display, monitoring, and searchability.

### 🔑 Fields

| Field           | Type      | Description                                            |
| --------------- | --------- | ------------------------------------------------------ |
| `post_id`       | text (PK) | Unique blog ID (e.g. `blog-2025-07-25-sleep-training`) |
| `title`         | text      | Blog post title                                        |
| `current_phase` | text      | Current phase (e.g. `IMAGE_COMPLETE`)                  |
| `next_agent`    | text      | Name of the next Cursor Agent                          |
| `status`        | text      | `in_progress`, `paused`, `complete`                    |
| `preview_url`   | text      | URL to preview branch                                  |
| `final_url`     | text      | URL to live blog post                                  |
| `last_updated`  | timestamp | Timestamp of last update                               |
| `agents_run`    | jsonb     | Array of completed agents                              |
| `metadata`      | jsonb     | Optional metadata (e.g., keywords)                     |

---

## 🧾 SQL: Create Table

```sql
create table blog_workflow_state (
  post_id text primary key,
  title text,
  current_phase text,
  next_agent text,
  status text,
  preview_url text,
  final_url text,
  last_updated timestamp with time zone default now(),
  agents_run jsonb,
  metadata jsonb
);
```

---

## 🛠️ How You'll Build in Supabase

### ✅ What Supabase Provides:

- PostgreSQL database (via a friendly GUI + SQL editor)
- REST & Realtime APIs (auto-generated for your tables)
- Row-level security (RLS) for controlling access
- Authentication (if needed later)
- Dashboard with usage monitoring and table editor

### 🪜 Setup Steps:

1. **Create project** at [supabase.com](https://supabase.com)
2. **Go to SQL editor** → paste the `CREATE TABLE` SQL
3. **Enable Realtime (optional)** for this table under `Settings → Realtime`
4. **Add Row-Level Security (optional)** if users will access data directly
5. **Create service role or anon key** to use in your dashboard or n8n workflows
6. **Build dashboard queries** using Supabase client libraries (or fetch from n8n)

### 🧠 Optional Enhancements

- Add triggers to auto-update `last_updated`
- Use Supabase Functions to create event hooks later

Let me know if you'd like help writing a row-level policy or connecting this table to your frontend.

