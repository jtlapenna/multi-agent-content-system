# 🪽 Frontend Dashboard Integration Plan

## 📃 Overview

This plan explains how to integrate the Supabase-powered state management system with your frontend dashboard (e.g., built with Next.js and deployed on Cloudflare Pages). It includes post workflow status, images, social content, links, and metadata for live preview and publishing control.

---

## 🔄 Data Source

All data is stored in the `blog_workflow_state` table in Supabase, maintained by n8n. Each row represents a blog post session.

---

## 📒 Dashboard Features & Data Mapping

| UI Feature                | Supabase Field(s)                         |         |
| ------------------------- | ----------------------------------------- | ------- |
|                           | **Blog title**                            | `title` |
| **Status badge**          | `current_phase`, `status`                 |         |
| **Preview URL**           | `preview_url`                             |         |
| **Final URL**             | `final_url`                               |         |
| **Agents run log**        | `agents_run`                              |         |
| **Last updated time**     | `last_updated`                            |         |
| **Hero/OG/social images** | `metadata.images.hero`, `.og`, `.social`  |         |
| **Social captions/posts** | `metadata.social_posts`                   |         |
| **Keywords/SEO info**     | `metadata.keywords`, `metadata.seo_score` |         |

---

## ⚙️ Integration Plan (Next.js)

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Configure Client

```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 3. Fetch Blog Data

```ts
const { data, error } = await supabase
  .from('blog_workflow_state')
  .select('*')
  .order('last_updated', { ascending: false })
```

### 4. Render Components

Use tables, cards, or dashboards to display:

- Blog name & phase badge
- Live preview/final links
- Latest images (metadata.images)
- Social post preview (metadata.social\_posts)
- Time since last update

### 5. Realtime Sync (Optional)

```ts
supabase
  .channel('blog_updates')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_workflow_state' }, payload => {
    // Update UI with new state
  })
  .subscribe()
```

### 6. Secure Access (Optional)

- For public access: no RLS needed
- For private team access: enable Supabase Auth + Row-Level Security (RLS)

---

## ✅ Benefits

- Live visibility into blog content and pipeline
- All data driven from a single source (Supabase)
- Integrates tightly with n8n and Cursor agents
- Reusable layout for multiple brand dashboards
- Supports preview vs. publish decision flows

Let me know when you're ready to scaffold components or pages in code.

