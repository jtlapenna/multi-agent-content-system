# 📊 Analytics Schema Plan

This document outlines the foundational analytics we will use to track content performance, agent efficiency, and user engagement across the platform.

---

## 🎯 Goals
- Measure content effectiveness (SEO + engagement)
- Evaluate workflow efficiency and agent performance
- Monitor user interaction with dashboard tools
- Optimize content strategy based on actual outcomes

---

## 📈 Metrics to Track

### 🔍 SEO + Content Metrics
- Page views per blog post
- Unique visitors
- Time on page
- Bounce rate
- Keyword rankings (via external SEO API or search console import)
- Indexed status (yes/no)
- Internal clickthroughs to other posts

### 🔗 Affiliate Performance
- Clicks on affiliate links (per blog post, per product)
- Outbound link destinations
- If available: estimated earnings or conversions per product (via affiliate platform API)
- Conversion proxy (click + high dwell time or return visits)

### 🧠 Agent Efficiency Metrics
- Agent runtime per phase (SEO, Blog, Review, Image, Publish)
- Number of retries or errors per agent
- Time between agent trigger and completion
- Completion state (success/failure)

### 👥 User Interaction Metrics
- User actions on dashboard (clicks, approvals, rejections)
- Number of blogs initiated vs completed
- Number of approvals per user
- Number of edits requested

### 📱 Social Post Metrics
- Social posts generated per platform
- Clickthroughs from previewed posts (if tracked)
- Posting success (if integrated directly)

---

## 🧱 Schema Draft

**Table: `blog_analytics`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key |
| blog_id | uuid | FK to blog table |
| page_views | int | daily/weekly total |
| time_on_page | float | seconds |
| bounce_rate | float | % |
| keyword_rankings | json | keyword:rank pairs |
| indexed | boolean |  |
| internal_clicks | int | |
| affiliate_clicks | int | total clicks on affiliate links |
| affiliate_earnings | float | optional/nullable if tracked |
| updated_at | timestamp |  |

**Table: `agent_logs`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key |
| blog_id | uuid | FK to blog table |
| agent_name | text | e.g. seo_agent |
| started_at | timestamp |  |
| completed_at | timestamp |  |
| status | text | success, failed, retry |
| retries | int |  |
| error_message | text | optional |

**Table: `user_actions`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key |
| blog_id | uuid | FK to blog table |
| user_id | uuid | FK to user table |
| action | text | approve, reject, edit, push_live |
| timestamp | timestamp |  |

---

## 📌 Notes
- Optional use of analytics scripts (e.g. Plausible, Splitbee) for visitor tracking
- Affiliate earnings may be integrated from platforms like Amazon, ShareASale, etc. if API access is available
- Metrics may be refined as feature set expands

Would you like to scaffold the database creation SQL based on this schema?

