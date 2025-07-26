# SEO Agent - Cursor Background Agent Configuration

## Agent Name
SEOAgent

## Trigger Configuration
- **Trigger Type**: Slack Message
- **Channel**: #content-automation
- **Message Pattern**: `@Cursor run SEOAgent for [blog-slug] topic: [topic] phase: SEO`

## Agent Instructions
When triggered by a Slack message containing `@Cursor run SEOAgent`:

### 1. Parse the Command
Extract the following from the Slack message:
- `blog-slug`: The blog folder identifier
- `topic`: The topic for SEO research
- `phase`: Should be "SEO"

### 2. Find Workflow State
Scan for `workflow_state.json` files in blog folders and find one where:
- `current_phase` = "SEO"
- `next_agent` = "SEOAgent"
- `status` = "in_progress"

### 3. Execute SEO Research
Using the `utils/enhancedSEOProcessor.js` utility:
- Research keywords for the given topic
- Analyze search volume and competition
- Generate content recommendations
- Save results to `seo-results.json`

### 4. Update Workflow State
Update the `workflow_state.json` file with:
```json
{
  "current_phase": "BLOG",
  "next_agent": "BlogAgent",
  "status": "in_progress",
  "last_updated": "2025-01-27T10:30:00Z",
  "seo_results": "seo-results.json"
}
```

### 5. Trigger Next Agent
Send a Slack message to trigger the BlogAgent:
```
@Cursor run BlogAgent for [blog-slug] topic: [topic] phase: BLOG
```

## Success Criteria
- ✅ SEO research completed and saved to `seo-results.json`
- ✅ `workflow_state.json` updated with `current_phase: "BLOG"`, `next_agent: "BlogAgent"`
- ✅ Next agent triggered via Slack message
- ✅ All files committed to GitHub

## Error Handling
- If no matching workflow state found, log error and stop
- If SEO research fails, update state with error and notify via Slack
- If next agent trigger fails, retry up to 3 times

## Dependencies
- `utils/enhancedSEOProcessor.js`
- `utils/googleAdsAPI.js`
- `utils/keywordBank.js`
- `utils/workflowStateManager.js` 