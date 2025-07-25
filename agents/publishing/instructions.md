# 📤 Publishing Agent Instructions

## 🎯 Purpose
Handle GitHub operations, create preview branches, and manage deployment to Cloudflare Pages.

## 📋 Responsibilities
- Create preview branches for blog content
- Deploy to Cloudflare Pages for preview
- Manage GitHub pull requests
- Update workflow state and trigger next agent

## 🛠️ Tools & Dependencies
- **GitHub Integration**: `githubAutomation.js` - Version control and PR management
- **Cloudflare Integration**: `cloudflareAPI.js` - Preview deployment
- **Blog Content**: `blog-final.md` and images from previous agents
- **Workflow State**: `workflow_state.json` - State management

## 🔄 Workflow Steps

### 1. Load Content and Assets
```bash
# Load final blog content and images
const blogContent = loadFile('blog-final.md');
const images = loadImages('images/');
```

### 2. Create Preview Branch
- Create new branch for blog post
- Add blog content to appropriate directory
- Include all generated images
- Commit changes with descriptive message

### 3. Deploy to Preview
- Trigger Cloudflare Pages deployment
- Deploy to preview environment
- Generate preview URL
- Verify deployment success

### 4. Create Pull Request
- Create PR from preview branch to main
- Add descriptive title and description
- Include preview URL in PR description
- Set up for review and approval

### 5. Update Workflow State
```json
{
  "current_phase": "PUBLISHING_COMPLETE",
  "next_agent": "SocialAgent",
  "preview_url": "https://preview.example.com/blog-post",
  "pr_number": 123,
  "branch": "preview/blog-post-slug",
  "last_updated": "2025-01-XXTXX:XX:XXZ"
}
```

### 6. Trigger Next Agent
- Commit updated `workflow_state.json`
- Send Slack command to trigger Social Agent
- Log completion in agent logs

## 📁 Output Files
- `workflow_state.json` - Updated state with publishing completion
- `logs/publishing-log.json` - Detailed execution log
- GitHub PR and preview deployment

## 🎯 Success Criteria
- ✅ Preview branch created
- ✅ Content deployed to preview
- ✅ Pull request created
- ✅ Preview URL generated
- ✅ Updated workflow state
- ✅ Triggered next agent

## 🔧 Configuration
- **GitHub Token**: Required for repository access
- **Cloudflare API**: Required for deployment
- **Repository Settings**: Configured for preview branches
- **Deployment Settings**: Cloudflare Pages configuration

## 📝 Publishing Guidelines
- **Branch Naming**: `preview/blog-post-slug`
- **Commit Messages**: Descriptive and clear
- **PR Title**: Include blog post title
- **PR Description**: Include preview URL and summary
- **Preview URL**: Verify deployment before proceeding

## 📝 Notes
- Ensure all content and assets are properly committed
- Verify preview deployment before creating PR
- Include clear PR description with preview URL
- Log all GitHub and deployment operations
- Handle deployment errors gracefully 