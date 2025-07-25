# 🔁 n8n Slack Trigger Flow: SEO Agent Kickoff

## 🎯 Purpose

Trigger the **SEO Agent** via Slack when:

- A user clicks “Start” on the dashboard, **or**
- A scheduled cron job runs the blog workflow

---

## 🧱 Flow Structure: `Trigger SEO Agent via Slack`

### 🔹 Trigger Options

1. **Webhook Trigger**

   - Triggered by frontend (user starts workflow)
   - Accepts blog folder slug or post metadata

2. **Cron Trigger**

   - Optional scheduled kickoff (e.g., daily 9am)

---

### 🔸 Action Nodes

3. **Set Slack Message Content**

   - Construct the command:
     ```
     /cursor run SEOAgent for blog-2025-07-25-sleep-training
     ```
   - Dynamically generate blog folder slug if needed

4. **Send Slack Message**

   - Node type: Slack API or HTTP Request
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
       "text": "/cursor run SEOAgent for blog-2025-07-25-sleep-training"
     }
     ```

5. **(Optional) Log Trigger Event**

   - Write to Supabase, Airtable, or Google Sheet
   - Log: timestamp, trigger type, blog slug

6. **(Optional) Notify User**

   - Slack/email message:
     > "✅ SEO Agent started for blog-2025-07-25-sleep-training."

---

## 🧠 Reusability

Create a reusable subworkflow that accepts:

- `agent_name`
- `blog_folder` And generates the Slack command accordingly.

---

## ✅ Benefits

- Clean trigger logic for agents
- Can be reused for all phases (SEO, Blog, Review, etc.)
- Can be triggered manually or on schedule
- Dashboard remains reactive without being the orchestration layer

