# 🧾 Project README for Multi-Agent Content System

This repository contains all planning, architecture, workflows, and code scaffolding for a multi-agent content automation system designed to autonomously generate, review, and publish SEO-optimized blog content with image and social media support. It integrates Cursor agents, Supabase, n8n, GitHub, and Cloudflare Pages.

This README is intended for:
- 🤖 **Cursor Agents** executing or maintaining the system
- 👩‍💻 **Developers** implementing or extending the project
- 🧠 **Humans** needing a clear mental model of the system

---

## 📂 File Index & Descriptions

### 🔄 Workflows & Architecture
- `multi_agent_content_system.md` — Primary overview of the full automation system
- `comprehensive_implementation_plan.md` — Complete implementation roadmap with all phases
- `agent_task_routing_design.md` — Task handoff logic and chaining between agents
- `dashboard_state_sync_flow.md` — Describes how the frontend syncs blog status from Supabase
- `n_8_n_slack_trigger_flow.md` — Outlines n8n's Slack-triggered agent workflow
- `generic_agent_runner_flow.md` — General pattern for how any Cursor agent is triggered and responds
- `git_hub_webhook_listener_flow.md` — Listens for commits to initiate downstream automations

### 🧠 Agent Configuration & Support
- `agent_instructions_for_implementation.md` — Task-by-task guidance agents use to build the system
- `migration_instructions.md` — Instructions for migrating from a clean template into a live project
- `clean_project_template_instructions.md` — Details what constitutes a clean project repo and how to use it
- `Cursor_vs_n8n_Responsibilities.csv` — Explains which roles are better served by Cursor agents vs n8n

### 🏗 File Structure & Formats
- `blog_file_structure_and_state_format.md` — Defines blog directory structure and `workflow_state.json` layout
- `n8n_trigger_seo_agent.json` — JSON export of one of the n8n Slack trigger flows
- `env-for-supabase.txt` — Example `.env.local` for Supabase frontend integration

### 🌐 Frontend & Supabase Integration
- `frontend_dashboard_integration_plan.md` — Strategy for syncing Supabase data into a UI dashboard
- `supabase_schema_and_sql.md` — Defines Supabase schema, tables, and example creation SQL
- `supabase_blog_data_hook.jsx` — React hook to query blog workflow posts
- `use_blog_workflow_posts_hook.js` — Additional frontend hook for accessing Supabase blog data

### 🖼 UI Components
- `blog_status_table_component.jsx` — Table component showing blog posts and their status
- `blog_dashboard_page.jsx` — Blog dashboard UI scaffold
- `initiation_terminal_ui.jsx` — Terminal-style user interface to monitor or initiate workflows

### 📈 Analytics & Access
- `analytics_schema_plan.md` — Defines metrics tracked (e.g., agent performance, affiliate clicks, blog views)
- `access_auth_test_deploy.md` — Explains Supabase auth and deployment plan
- `test_deploy_plan.md` — Covers linting, QA, analytics, and deployment structure

### 🎨 Assets
- `bright-gift-banner.jpg` / `bright-gift-banner.psd` — Example branding image

### 🔍 Audit & Analysis
- `audit-findings.md` — Complete audit results and component assessment
- `files-requiring-updates.md` — Detailed file update requirements with architectural context
- `agent_reference_guide.md` — Essential reference for agents working on the system

### 🧼 Clean Template
- `template/` — Complete clean foundation for new projects
  - All reusable utility files from audit
  - Complete CLI system with 12 commands
  - Web-based approval hub (React + Cloudflare Pages)
  - Agent instructions for all 6 agents
  - Database schema and configuration
  - n8n workflows and environment setup

---

## ✅ Suggested Review Order for Agents

1. `agent_reference_guide.md` — **START HERE**: Essential architecture insights and component mapping
2. `multi_agent_content_system.md` — System architecture overview
3. `comprehensive_implementation_plan.md` — Complete implementation roadmap
4. `audit-findings.md` — What we learned from the old system
5. `files-requiring-updates.md` — How to update ported files for new system
6. `agent_task_routing_design.md` — Agent workflow and handoff logic
7. `migration_instructions.md` — How to use the clean template
8. `blog_file_structure_and_state_format.md` — File organization and state management
9. `supabase_schema_and_sql.md` — Database design and schema
10. `dashboard_state_sync_flow.md` — Real-time dashboard updates
11. `frontend_dashboard_integration_plan.md` — Dashboard development plan
12. `n8n_trigger_seo_agent.json` — n8n workflow for agent triggering
13. UI files + hooks (`jsx` + `hook.js` files)
14. Analytics and test plans

---

## 💡 Tips for Cursor Agents

- Always check for a `workflow_state.json` file when working on blog generation.
- Use file paths and commit messages consistently (see `blog_file_structure_and_state_format.md`).
- When done with your task, write a new `workflow_state.json`, commit it, and notify the next agent.
- Refer to the dashboard sync flow if you're responsible for updating state info post-task.

---

## 🌱 Extending the System
- You can add new agents by duplicating existing ones and updating routing logic.
- n8n flows can be cloned and modified with new triggers.
- Supabase and dashboard are extensible with minimal code changes.

---

## 🚀 **Clean Slate Implementation**

### **Recommended Approach: New Repository**
For the cleanest implementation, create a new repository:

```bash
# Create new repository
git clone https://github.com/jtlapenna/blog-automation.git multi-agent-content-system
cd multi-agent-content-system

# Remove old project files
rm -rf content-automation-export-v2/
rm -rf approval-hub/  # (we have it in template now)

# Copy template to root level
cp -r template/* .
rm -rf template/

# Initialize new git repository
git init
git add .
git commit -m "Initial commit: Multi-agent content automation system"
```

### **What's Included in the Clean Template:**
- ✅ **All reusable utility files** from audit findings
- ✅ **Complete CLI system** with 12 commands
- ✅ **Web-based approval hub** (React + Cloudflare Pages)
- ✅ **Agent instructions** for all 6 agents
- ✅ **Database schema** and configuration
- ✅ **n8n workflows** and environment setup
- ✅ **Comprehensive documentation** and update guides

### **Next Steps:**
1. **Phase 2**: Update ported files for new architecture (see `files-requiring-updates.md`)
2. **Phase 3**: Set up Supabase and n8n infrastructure
3. **Phase 4**: Build and test agent system
4. **Phase 5**: Deploy dashboard and production system

---

Let me know when you're ready to move this into the repo or want to generate a PDF version of this README for agent reference.

