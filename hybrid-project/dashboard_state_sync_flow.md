# 📊 Dashboard State Sync Flow (n8n)

## 🎯 Purpose
This flow keeps the web dashboard in sync with blog post workflow progress by:
- Monitoring updates to `workflow_state.json`
- Extracting key metadata
- Writing current state to Supabase (or Cloudflare KV)

This enables real-time visibility in your UI for multiple blogs at different stages.

---

## 🧱 Flow Structure: `Sync Dashboard State`

### 🔹 Trigger Options
1. **GitHub Webhook**
   - Triggered when any `workflow_state.json` is committed

2. **Scheduled Polling** *(fallback)*
   - Checks for recent updates across folders (e.g. every 5 mins)

---

### 🔸 Action Nodes

3. **Fetch File (if using webhook)**
   - Parse payload to get the updated file path
   - Use GitHub API to fetch the raw `workflow_state.json`

4. **Parse JSON & Extract Metadata**
   - Fields to extract:
     - `post_id`
     - `current_phase`
     - `next_agent`
     - `last_updated`
     - `status`
     - `preview_url`
     - `final_url`
     - `title`

5. **Update Supabase Row**
   - Match on `post_id`
   - If exists → update
   - If not → insert new row

6. **(Optional) Notify UI or Trigger Rebuild**
   - Send webhook to Next.js ISR or revalidation endpoint
   - Optionally notify Slack: "🟡 Blog `X` now in phase `Y`"

---

## ✅ Benefits
- Enables UI to show real-time status per blog
- Avoids polling GitHub from the frontend
- Supports filtering, sorting, and human decision-making
- Keeps Supabase as the single source of UI truth

---

## 🧩 Data Table Example (Supabase)
| post_id | title | current_phase | status | preview_url | final_url | last_updated |
|---------|-------|----------------|--------|--------------|-----------|----------------|
| blog-2025-07-25-sleep-training | Sleep Training Tips | REVIEW_COMPLETE | in_progress | https://... | null | 2025-07-25T03:10Z |

