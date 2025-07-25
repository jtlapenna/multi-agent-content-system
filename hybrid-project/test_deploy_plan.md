# ✅ Test & QA Framework

## 🧪 Linting

- **JavaScript/TypeScript:** Use ESLint with Prettier for consistent formatting and standards.
- **Markdown:** Integrate `markdownlint` to enforce formatting and header hierarchy.
- **JSON:** Use JSON schema validation or `jsonlint` to ensure correctness, especially for `workflow_state.json`.

## 🔍 Testing Agent Output

- **Basic Output Validation:**
  - Ensure agents return expected structured data (blog markdown, SEO JSON, image metadata).
  - Validate required fields like title, description, keywords, etc.
- **Markdown QA:**
  - Confirm image URLs are valid and relative paths are correct.
  - Detect missing alt text, metadata, or misformatted markdown.

## 🧪 Metadata Validation

- Ensure SEO metadata fields exist and are formatted properly:
  - `meta_title`
  - `meta_description`
  - `keywords[]`
- Optional: Write test scripts to auto-check for keyword density, title length, etc.

## 🖼️ Visual Snapshot Testing (Optional for v1, Recommended for v2)

- Use [Playwright](https://playwright.dev/) or [Percy](https://percy.io/) to visually snapshot blog preview pages and dashboard views.
- Use GitHub Actions to run visual regressions on push to `main`.

## ✅ Additional QA Enhancements (v2+)

- Unit tests for dashboard UI components
- Agent reliability checks (test prompt → expected output scenarios)
- Content scoring: Automated readability or tone-of-voice scoring

---

# 🚀 Deployment Plan

## 🔁 GitHub + Cloudflare Pages

- **Main Branch:** Deploys to live production site
- **Preview Branch:** Deploys preview blog content for review/approval phase

> Preview deployments will be triggered by GitHub Actions whenever a PR or commit is pushed to a branch with a preview blog post.

## 🌐 Hosting Considerations

- **Frontend Dashboard:** Hosted via Cloudflare Pages
- **Supabase Backend:** Fully managed by Supabase (Postgres, auth, edge functions)
- **Webhooks:**
  - **Option A:** Host as Supabase Edge Functions (tight integration)
  - **Option B:** Host on lightweight serverless functions via Cloudflare Workers or Vercel

## 📡 Environment Variables

- Ensure Supabase project keys, Slack webhook URLs, etc. are safely managed in `.env` files and GitHub Secrets.

## 📦 CI/CD Steps

- Format check (Prettier, markdownlint)
- Lint check (ESLint)
- Build and deploy frontend to Cloudflare Pages
- Trigger visual regression testing (if configured)

Let me know when you’re ready to proceed with the final README, or want to expand testing or deployment sections further.

