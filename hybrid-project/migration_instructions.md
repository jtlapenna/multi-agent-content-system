# 🚀 Migration Instructions: From Template to Live Project

## 🎯 Purpose

These instructions guide an agent (or human collaborator) on how to use the clean project template to initialize a new live implementation for a specific website or brand.

---

## 🧰 Prerequisites

Before beginning, ensure you have the following:

- Access to the clean template repository or zip archive
- Access to the destination GitHub repo (or permission to create one)
- Supabase project credentials (or ability to create one)
- Cursor workspace access (or invite link)
- Access to n8n instance (if used)

---

## 📦 Step 1: Clone and Rename Project

1. Download or clone the clean template:

   ```bash
   git clone <clean-template-repo> my-new-site
   cd my-new-site
   ```

2. Search and replace project-specific variables (e.g., `{{SITE_NAME}}`, `{{DOMAIN}}`)

3. Update project metadata (README, `package.json`, `.env`)

---

## 🛠️ Step 2: Configure Supabase

1. Create a new Supabase project via https\://supabase.com/
2. Open the SQL Editor and paste the contents of `supabase/schema.sql`
3. Save project URL and API keys into `.env`
4. Optionally seed test data

---

## 🧠 Step 3: Prepare Agents

1. Create new agents in Cursor workspace (or duplicate from existing ones)
2. Paste each `instructions.md` into its respective agent's context window
3. Upload `workflow_state.json` into each agent’s file list
4. Configure Slack channel if needed for agent triggering

---

## ⚙️ Step 4: Configure n8n (Optional)

1. Import necessary workflows from `/n8n/exported_flows/`
2. Update webhook URLs and environment variables
3. Test Slack and GitHub integration triggers

---

## 💻 Step 5: Launch the Frontend Dashboard

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Add `.env.local` with Supabase vars
3. Start local dev server:
   ```bash
   npm run dev
   ```
4. Push to GitHub to trigger Cloudflare Pages deployment

---

## ✅ Final Checklist

-

---

## 📘 Tips for Customization

- Add new agents by duplicating instruction files
- Add webhooks for other trigger mechanisms (e.g., cron, approvals)
- Use dashboard UI to visually manage state across multiple blog posts and projects

Let me know when you’re ready to move on to the final README file or want to start the setup tasks based on this migration outline.

