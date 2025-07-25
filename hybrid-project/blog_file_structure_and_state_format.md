# 🗂️ Blog File Structure and State Format

## 📁 Suggested File Structure (Per Blog Post Session)

```
/content/
  blog-posts/
    YYYY-MM-DD-topic-slug/
      seo-results.json
      blog-draft.md
      blog-final.md
      social-posts.md
      images/
        hero.jpg
        og.jpg
        social.jpg
      metadata.json
      workflow_state.json
      logs/
        seo-log.json
        blog-log.json
        review-log.json
        image-log.json
        publish-log.json
```

> Each blog session lives in its own folder named by date and topic slug. All agents work within this folder and append or update files. This keeps the repo clean and versioned.

---

## 🧾 `workflow_state.json` Format

```json
{
  "post_id": "2025-07-24-gentle-parenting-myths",
  "title": "5 Gentle Parenting Myths—Debunked",
  "current_phase": "REVIEW_COMPLETE",
  "next_agent": "ImageAgent",
  "last_updated": "2025-07-24T22:45:00Z",
  "human_review_required": false,
  "branch": "preview/gentle-parenting-myths",
  "preview_url": "https://preview.example.com/gentle-parenting-myths",
  "final_url": null,
  "status": "in_progress",
  "agents_run": ["SEOAgent", "BlogAgent", "ReviewAgent"],
  "agent_outputs": {
    "SEOAgent": "seo-results.json",
    "BlogAgent": "blog-draft.md",
    "ReviewAgent": "blog-final.md"
  }
}
```

---

## ✅ Benefits of This Structure

- Keeps all blog data self-contained and organized
- Enables easy agent handoff using `next_agent`
- Tracks current status for each post independently
- Works across multiple concurrent blog workflows
- Simplifies dashboard queries and filtering
- Enables detailed logging, auditing, and version control

