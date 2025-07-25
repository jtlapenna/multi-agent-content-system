# 📘 Multi-Agent Content Automation System Overview

## 🔹 Summary

This system automates the end-to-end creation, optimization, and publishing of SEO-optimized blog posts using specialized Cursor background agents. A web-based control dashboard allows human-in-the-loop oversight (optionally only at the beginning and end), while n8n orchestrates notifications, state syncing, and dashboard updates. The system is modular, version-controlled, and designed for scalability across multiple sites.

---

## 🧱 Tech Stack

| Layer                 | Tool | Purpose |
| --------------------- | ---- | ------- |
| AI Logic & Automation |      |         |

|   |
| - |

|   |
| - |

| **Cursor Agents**      | Executes modular content tasks (SEO, writing, reviewing, etc.), triggers next agents via Slack |                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| State Mgmt (Live UI)   | **Cloudflare KV** *(or Supabase)*                                                              | Tracks real-time progress and UI display                                               |
| Version Control        | **GitHub**                                                                                     | Stores source content, commits trigger state for n8n monitoring                        |
| Workflow Orchestration | **n8n**                                                                                        | Triggers initial agent, manages Slack commands, updates dashboard state, notifications |
| Deployment & Preview   | **Cloudflare Pages**                                                                           | Auto-deploys preview branches on blog update                                           |
| Control Dashboard      | **Next.js (Cloudflare Pages)**                                                                 | Interface for workflow control and review                                              |

---

## ✨ Key Features

- ✅ Modular **Cursor Agents** for each workflow phase
- ✅ Web dashboard to initiate, approve, and monitor progress
- ✅ GitHub-based version control and state signaling
- ✅ Cloudflare-powered blog previews
- ✅ Slack-triggered agent chaining
- ✅ n8n for dashboard syncing and notification logic
- ✅ Cursor agents handle all work and trigger next phase directly
- ✅ Future-proof architecture for Cursor’s evolving features (agent scheduling, APIs)

---

## 🔄 Workflow Steps

1. **Start**\
   User clicks "Start" in the dashboard — or n8n triggers SEO Agent via Slack command.

2. **SEO Agent**\
   Gathers keyword data, recommends blog topics → commits `seo-results.json`, `workflow_state.json` with `phase: SEO_COMPLETE`. Triggers next agent via Slack.

3. **Blog Agent**\
   Generates blog draft → commits `blog-draft.md`, updates state → triggers Review Agent.

4. **Review Agent**\
   Optimizes for SEO, links, formatting → commits `blog-final.md`, `social-posts.md` → triggers Image Agent.

5. **Image Agent**\
   Generates prompts, fetches + processes images → updates image references → commits assets → triggers Publishing Agent.

6. **Publishing Agent**\
   Pushes blog to preview branch → optionally merges to main → finalizes state.

7. **n8n Watches Final Phase**\
   Detects completed state → updates Supabase/dashboard → notifies user via Slack/email.

---

## 📂 Agent Handoff via Slack

Each Cursor agent:

- Performs its specialized task
- Commits outputs + `workflow_state.json`
- Sends a Slack command to start the next Cursor agent

n8n only manages the **first Slack trigger** and **final dashboard update**.

---

## 📊 Dashboard UI Features

- **Live Phase Display** (from state file or Supabase)
- **Action Buttons**: Start, Approve, Push to Main (only if needed)
- **Preview & Live Links**: Auto-fetched from Cloudflare Pages
- **Agent Logs**: Per-run metadata and result summaries
- **Realtime status updates via Supabase** or polling GitHub

---

## 🧽 Architecture Diagram (Simplified)

```
[User Dashboard] ⇄ [Supabase/Cloudflare KV] ⇄ [GitHub Repo]
      ↓                    ↑                       ↓
   [n8n Flow] → [Slack Cmd] → [Cursor Agent] → [Next Agent via Slack]
                                                ↓
                                  [Cloudflare Preview / Main]
```

---

## ✅ Next Steps

- • **Sketch the file structure and workflow\_state.json format?**
- • **Help draft the first n8n flow to trigger an agent via Slack?**
- • **Create a dashboard state display model?**
- • **Draft a GitHub Action or webhook listener?**

