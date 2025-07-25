# 🧰 Generic Agent Runner Flow (n8n)

## 🎯 Purpose

Create a reusable n8n subworkflow to launch **any Cursor Agent** via Slack based on two inputs:

- `agent_name` (e.g., SEOAgent, BlogAgent, ImageAgent)
- `blog_folder` (e.g., blog-2025-07-25-sleep-training)

This can be used by other n8n flows or your dashboard trigger to dynamically launch any phase of your pipeline.

---

## 🧱 Flow Structure: `Run Cursor Agent`

### 🔹 Input Variables

- `agent_name` (string)
- `blog_folder` (string or slug)

These can come from:

- Webhook parameters
- Environment variables
- Previous workflow output

---

### 🔸 Action Nodes

1. **Construct Slack Message**

   - Example output:
     ```
     /cursor run BlogAgent for blog-2025-07-25-sleep-training
     ```
   - Use a Set or Function node to dynamically format this message using inputs

2. **Send Slack Message**

   - Use Slack API or HTTP Request node
   - Endpoint: `https://slack.com/api/chat.postMessage`
   - Headers:
     ```
     Authorization: Bearer xoxb-...
     Content-Type: application/json
     ```
   - Body:
     ```json
     {
       "channel": "YOUR_CHANNEL_ID",
       "text": "/cursor run {{agent_name}} for {{blog_folder}}"
     }
     ```

3. **(Optional) Log Execution**

   - Log timestamp, agent name, folder slug to Supabase or external DB

4. **(Optional) Return Summary**

   - Return a success message that can be used downstream or as a webhook response

---

## 🔁 Example Use Cases

- Used by dashboard to launch next phase
- Triggered from GitHub webhook logic
- Manually launched via fallback retry
- Batched to launch multiple agents across blog sessions

---

## ✅ Benefits

- Modular and reusable
- Supports every agent type
- Makes Slack-based orchestration dynamic and DRY
- Decouples UI from Slack syntax and execution logic

