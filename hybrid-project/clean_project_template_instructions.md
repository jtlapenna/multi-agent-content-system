# 🧼 Clean Project Template Instructions

## 🎯 Purpose

Create a clean, reusable project template for the Multi-Agent Content Automation system. This will serve as the baseline starting point for new deployments and implementations.

---

## 🧱 Structure & Scope

This template should:

- Contain a fully scaffolded file/folder structure (no production content)
- Include finalized agent instruction files (without prior campaign logic)
- Be verified to include all `.env` files, GitHub Actions, Cursor agent configurations, n8n workflows, Supabase schema, and frontend scaffolding
- Contain all utility files and sample metadata (e.g. `workflow_state.json`) to support testing and demonstration

---

## 📁 Files & Folders To Include

- `/agents/<agent-name>/instructions.md`
- `/data/workflow_templates/workflow_state.json`
- `/n8n/exported_flows/*.json`
- `/frontend/pages/dashboard.tsx`
- `/frontend/components/BlogStatusTable.tsx`
- `/frontend/lib/supabase.ts`
- `/supabase/schema.sql`
- `/supabase/README.md`
- `/utils/agent_runner.ts`
- `README.md` (templated)
- `.env.template`
- `.github/workflows/webhook-listener.yml`

---

## 🔍 Review & Verify Before Template Commit

1. ✅ **Agent Instructions**

   - Confirm all agents have `instructions.md` files
   - Remove references to specific brands or post topics
   - Include comments for prompts or injection points

2. ✅ **File/Folders**

   - Remove legacy content, test data, or user-specific notes
   - Rename any active workflow folders to `template_` prefix if helpful

3. ✅ **n8n Flows**

   - Export any stable workflows to `exported_flows/`
   - Use naming conventions like `agent-runner`, `state-updater`, `webhook-listener`

4. ✅ **Git & Configs**

   - Include `.env.template` with example vars
   - Include necessary GitHub Actions and webhook configs
   - Ensure no hardcoded secrets or PII

5. ✅ **Frontend**

   - Scaffold components and pages
   - Confirm Supabase is used via `lib/supabase.ts`
   - All calls should reference live data from Supabase

6. ✅ **Supabase**

   - Ensure SQL schema matches v1 design
   - Include seed/test data if needed
   - Write README with instructions for schema import

---

## ⚙️ Final Prep Instructions (For Agent Execution)

```markdown
- ❗ Confirm project directory is clean and committed
- 🧼 Remove all client content and test drafts
- 🗂️ Check all folders listed above exist
- ✅ Run test build of frontend + backend integration
- 📁 Zip into `/template/clean_project_template.zip`
- 📦 Upload to shared location or Cursor workspace for future initialization
```

---

## 🔄 How To Preserve the Current Project

To preserve your current work as you begin templating:

### Option 1: Create a New Branch (Recommended for Development)

```bash
git checkout -b clean-template-setup
```

This allows you to safely scaffold and test the clean version without affecting the production/main branch.

### Option 2: Duplicate the Repository (Recommended for Distribution)

```bash
git clone <repo-url> clean-template
cd clean-template
rm -rf .git
git init
git remote add origin <new-repo-url>
git add .
git commit -m "Initial commit of clean template"
git push -u origin main
```

Let me know when you're ready to move to **5. Migration Instructions** for how an agent will take this clean template and launch a real implementation.

