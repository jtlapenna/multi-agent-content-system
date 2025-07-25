# 🔔 GitHub Webhook Listener Flow (n8n)

## 🎯 Purpose

This flow listens for commit events in GitHub, detects updates to `workflow_state.json` files, and initiates downstream actions like dashboard sync or agent chaining.

---

## 🧱 Flow Structure: `GitHub Webhook Handler`

### 🔹 Trigger Node

1. **Webhook (n8n)**
   - Type: `POST`
   - Path: `/github-webhook`
   - Security: Secret token validated against GitHub's webhook secret

### 🔸 GitHub Setup

- **Events to listen for**: `push`
- **Filters**:
  - Only watch `refs/heads/preview/*` or `refs/heads/main`
  - Trigger only when files like `workflow_state.json` are changed

---

### 🔸 Action Nodes

2. **Filter Relevant File Updates**

   - Loop through `commits[].modified`
   - Look for any path ending in `/workflow_state.json`

3. **Extract Metadata from File Path**

   - Derive blog folder name or `post_id` from path
   - Example: `content/blog-posts/blog-2025-07-25-sleep-training/workflow_state.json`

4. **(Optional) Fetch File Contents**

   - Use GitHub API to fetch the updated JSON file (if needed)

5. **Trigger Next Flow(s)**

   - Trigger: `Dashboard State Sync`
   - Optional: Trigger generic `Agent Runner` if logic requires

6. **(Optional) Log Event**

   - Write to Supabase/Airtable: post\_id, commit hash, timestamp, updated phase

---

## ✅ Benefits

- Decouples UI from GitHub monitoring logic
- Enables fully event-driven state syncing
- Modular: can feed into state display, alerts, retry logic, agent chaining
- Supports all blogs concurrently and independently

---

## 🧩 Example Commit Payload (Simplified)

```json
{
  "ref": "refs/heads/preview/blog-2025-07-25-sleep-training",
  "commits": [
    {
      "id": "abc123",
      "modified": [
        "content/blog-posts/blog-2025-07-25-sleep-training/workflow_state.json"
      ]
    }
  ]
}
```

This triggers processing logic downstream to update Supabase and optionally trigger the next agent.

