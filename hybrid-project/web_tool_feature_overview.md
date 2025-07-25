# 🌐 Web Tool Feature Overview

## 📃 Summary
This web tool is a full-featured dashboard for managing automated content workflows across multiple websites. It integrates with Supabase, Cursor agents, and n8n to track blog generation, content assets, and publishing phases—allowing users to monitor, approve, and control each step.

The tool is structured with a main hub and individual site dashboards, supporting real-time updates, stateful workflows, and content lifecycle management.

---

## 🧭 Key Features (v1 Viable Product)

### 🧩 Main Hub
- View all connected web properties
- Display:
  - Number of posted blogs
  - Number of blogs in preview, rejected, or pending publish
  - At-a-glance SEO performance (average score, recent improvements)

### 📊 Site Dashboard Pages
Each site has its own dashboard with:
- Overview panel (with blog counts, content status, traffic snippets)
- Blog Workflow Manager
- Holding areas for unfinished content
- Initiation Terminal for kicking off workflows
- Preview/Approval system
- Published Blogs Table (with links, word count, SEO, view data)
- Keyword Bank / SEO Target List

### ✅ Workflow Status Table
- Title
- Current Phase
- Agents run
- Last updated
- Preview and publish links
- Image and social metadata

### 🚦 Initiation Terminal
- Button or controls to start workflow
- View real-time status messages
- Receive completion data package
- Approve, reject, or pause the post

### 🕓 Holding Areas
- Blogs with preview links, awaiting review
- Rejected content for revision
- Approved blogs queued for publish

### 📂 Metadata Previews
- SEO keyword score
- Word count
- Image preview
- Social posts preview
- Agent audit logs

### 📣 Notifications (v1)
- Slack, email, and in-app alerts for:
  - Completion of workflow phases
  - Approval request
  - Errors or agent failures
  - Publish confirmation

### ⚠️ Error Handling & Reporting (v1)
- Alert system for failures (agent, n8n, Supabase)
- Dashboard flags issues with red status
- Manual override or restart options

### 🛠️ Monitoring Tools (v1)
- Agent health / heartbeat reporting (via Supabase or status pings)
- Workflow progression logs visible per session

### 📈 Analytics (v1)
- SEO score improvements over time
- Blog post performance metrics (traffic, CTR, shares)
- Workflow completion time
- Blog lifecycle stats

---

## ✨ Planned v2 Enhancements

### 🤖 AI Copilot Panel
- Suggest next workflow action
- Flag abandoned posts
- Give optimization suggestions for SEO, style, length, etc.

### 🔄 Auto-Retry & Escalation
- Automatically retry failed steps
- Option to escalate to human or rerun phase

### 🔢 Versioning & Rollback
- Save diffs and restore prior versions of blog posts
- Diff viewer UI for comparing edits

### 🧪 QA / Sandbox Mode
- Let users run test workflows in isolated, non-production mode

### 🔧 Workflow Templates
- Support different workflow types:
  - Blog
  - Product roundup
  - Gift list
  - SEO page
- Templates would customize which agents and flows are used

---

Let me know which section you’d like to scaffold next.

