# 🔐 Access & Auth Plan

## Auth Strategy
- Use **Supabase Auth** for user authentication
- Support email/password login and magic links initially
- Optionally expand to OAuth (Google, GitHub) later

## Roles & Permissions
- **Admin**: Full access to all sites, workflows, and settings
- **Site Manager**: Access to a specific web property
- **Viewer**: Read-only access to dashboard data

## Private vs. Public Views
| Feature                             | Public | Auth Required |
|-------------------------------------|--------|----------------|
| Hub Home Page                       | ✅     |                |
| Blog List (Live Posts)              | ✅     |                |
| Blog Status Dashboard               |        | ✅              |
| Blog Review / Approval Terminal     |        | ✅              |
| Workflow Initiation Panel           |        | ✅              |
| SEO Tools & Keyword Bank            |        | ✅              |
| Analytics + Affiliate Insights      |        | ✅              |

## Multi-Property Access
- Each Supabase user account can be linked to multiple properties
- Dashboard will use user session to query authorized `site_id`
- Optional invite system to allow collaborators to join a property

---

# 🧪 Test & QA Framework

## Linting
- Use ESLint + Prettier in frontend
- Markdown linting via `markdownlint`
- JSON/YAML validation (esp. for `workflow_state.json`)

## Agent Output Testing
- Test if agents:
  - Produce expected fields (`title`, `slug`, `body`, etc.)
  - Write correct trigger files
  - Update Supabase state correctly

## Metadata & Formatting Checks
- Validate blog frontmatter
- Check for broken links, missing alt tags, etc.
- Enforce word count and SEO target guidelines

## Optional Visual Tests
- Snapshot tests for frontend UI using Playwright or Percy
- Regression tests on key dashboard components

---

# 📤 Deployment Plan

## GitHub → Cloudflare Pages
- Use GitHub Actions to deploy from `main` to production
- Use preview branches for review builds (auto-preview PRs)

## Supabase Hosting
- Supabase project lives independently and connects via API
- Database and Auth are hosted in the Supabase project
- Webhooks can be hosted in one of:
  - Supabase Edge Functions
  - Cloudflare Workers
  - A separate Node app (optional)

## Domains & Routing
- Custom domain (e.g. `hub.brightgift.com`) via Cloudflare Pages
- Subroutes per web property (e.g. `/site/my-store`)

