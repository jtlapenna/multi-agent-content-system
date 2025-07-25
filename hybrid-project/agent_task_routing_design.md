# 🧠 Agent Task Routing Design for Multi-Blog Support

## 🎯 Goal
Enable Cursor agents to detect which blog folder to work on next by evaluating multiple blog sessions in various phases, allowing concurrent or out-of-order publishing workflows.

---

## 🗂️ Folder Structure Context
Each blog lives in its own folder:
```
/content/blog-posts/YYYY-MM-DD-topic-slug/
```
Each folder contains a `workflow_state.json` file.

---

## 🔍 Agent Routing Logic
When an agent starts (e.g., BlogAgent), it scans all blog folders for a `workflow_state.json` file where:

- `current_phase` matches the agent’s expected starting phase (e.g., `SEO_COMPLETE` for BlogAgent)
- `next_agent` matches the current agent name
- `status` is `"in_progress"`

Agents will then:
1. Select the first matching folder (or all, if you batch-process)
2. Perform their task
3. Update outputs and commit
4. Update `workflow_state.json` with new values
5. Send Slack command to trigger the next agent (defined in `next_agent`)

---

## ✅ Supported Behaviors
- Multiple blogs in progress at different stages
- Ability to leave a blog in preview while starting or finishing others
- Resume any blog at any time based on its `workflow_state.json`
- Agents always pick up from the appropriate point in the workflow

---

## 🧾 Example Agent Routing Condition
```python
for folder in all_blog_folders:
  state = load_json(folder + "/workflow_state.json")
  if state["current_phase"] == "SEO_COMPLETE" and state["next_agent"] == "BlogAgent":
    process(folder)
    break  # or continue to batch-process all
```

---

## 📤 Output Format Update Example (after BlogAgent finishes)
```json
{
  "current_phase": "BLOG_COMPLETE",
  "next_agent": "ReviewAgent",
  "last_updated": "2025-07-25T01:15:00Z",
  ...
}
```

---

## 🧩 Benefits
- Agents don’t need to be hardcoded with folder paths
- Stateless agents can still resume from known folder states
- Easy to orchestrate, debug, and expand across many blog sessions

