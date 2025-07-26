# Blog Agent - Cursor Background Agent Configuration

## Agent Name
BlogAgent

## Trigger Configuration
- **Trigger Type**: Slack Message
- **Channel**: #content-automation
- **Message Pattern**: `@Cursor run BlogAgent for [blog-slug] topic: [topic] phase: BLOG`

## Agent Instructions
When triggered by a Slack message containing `@Cursor run BlogAgent`:

### 1. Parse the Command
Extract the following from the Slack message:
- `blog-slug`: The blog folder identifier
- `topic`: The topic for blog content
- `phase`: Should be "BLOG"

### 2. Find Workflow State
Scan for `workflow_state.json` files in blog folders and find one where:
- `current_phase` = "BLOG"
- `next_agent` = "BlogAgent"
- `status` = "in_progress"

### 3. Load SEO Results
Load the `seo-results.json` file from the blog folder to get:
- Target keywords
- Content strategy
- Topic recommendations

### 4. Generate Blog Content
Using the SEO data and topic, generate blog content:
- Create engaging, SEO-optimized content
- Research and integrate relevant affiliate products
- Include proper structure with H2/H3 headers
- Target 1,500+ words for comprehensive content
- Save as `blog-draft.md`

### 5. Update Workflow State
Update the `workflow_state.json` file with:
```json
{
  "current_phase": "REVIEW",
  "next_agent": "ReviewAgent",
  "status": "in_progress",
  "last_updated": "2025-01-27T10:30:00Z",
  "blog_draft": "blog-draft.md"
}
```

### 6. Trigger Next Agent
Send a Slack message to trigger the ReviewAgent:
```
@Cursor run ReviewAgent for [blog-slug] topic: [topic] phase: REVIEW
```

## Success Criteria
- ✅ Blog content generated and saved to `blog-draft.md`
- ✅ Content is 1,500+ words and SEO-optimized
- ✅ Affiliate products integrated appropriately
- ✅ `workflow_state.json` updated with `current_phase: "REVIEW"`, `next_agent: "ReviewAgent"`
- ✅ Next agent triggered via Slack message
- ✅ All files committed to GitHub

## Error Handling
- If no matching workflow state found, log error and stop
- If content generation fails, update state with error and notify via Slack
- If next agent trigger fails, retry up to 3 times

## Dependencies
- `utils/contentChecker.js`
- `utils/workflowStateManager.js`
- SEO results from previous agent 