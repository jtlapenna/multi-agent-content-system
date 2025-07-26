# BrightGift Slack Channel IDs

## Channel Mapping

| Agent | Channel Name | Channel ID |
|-------|-------------|------------|
| SEO | #brightgift-seo-agent | `C097J4EGEN9` |
| Blog | #brightgift-blog-agent | `C0987CMJN1E` |
| Review | #brightgift-review-agent | `C097G9YCQT0` |
| Image | #brightgift-image-agent | `C0973KH68EB` |
| Publishing | #brightgift-publishing-agent | `C097J4WA0LD` |

## Webhook Secret
From your GitHub webhook configuration:
- **Secret**: `n8n-agent-workflow-triggers`

## Usage
These channel IDs are already configured in all n8n workflows:
- `n8n/workflows/dashboard-seo-trigger.json`
- `n8n/workflows/agent-to-agent-router.json`
- `n8n/workflows/publishing-approval-handler.json` 