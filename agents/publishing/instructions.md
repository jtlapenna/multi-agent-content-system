# 📤 Publishing Agent Instructions

## 🎯 Purpose
Handle comprehensive publishing workflow including GitHub operations, preview branch creation, Cloudflare Pages deployment, pull request management, and live publishing after approval. Serve as the final deployment agent before social media promotion.

## 📋 Responsibilities
- **GitHub Operations**: Create preview branches, manage content uploads, and create pull requests
- **Cloudflare Deployment**: Deploy content to Cloudflare Pages for preview
- **Content Management**: Organize and upload blog content and images to appropriate directories
- **Deployment Verification**: Ensure successful deployment and generate preview URLs
- **Pull Request Management**: Create comprehensive PRs with preview links and descriptions
- **Approval Handling**: Monitor approval notifications and merge to main for live publishing
- **Live Publishing**: Merge approved content to main branch for production deployment
- **Workflow Integration**: Update workflow state and trigger next agent

## 🛠️ Tools & Dependencies
- **GitHub Integration**: `githubAPI.js` - Version control, branch management, PR creation, and merging
- **Cloudflare Integration**: `cloudflareAPI.js` - Preview deployment and status monitoring
- **Notification Service**: `notificationService.js` - Approval notifications and status updates
- **Blog Content**: `blog-final.md` from Review Agent
- **Images**: `images/` directory from Image Agent
- **Workflow State**: `workflow_state.json` - State management and agent handoff

## 🔄 Workflow Steps

### 1. Parse Input Parameters and Load Data
```javascript
// Extract parameters from the command
const blogSlug = process.argv[2] || 'blog-' + new Date().toISOString().split('T')[0];
const topic = process.argv[3] || 'general';
const phase = process.argv[4] || 'PUBLISHING';
const site = process.argv[5] || 'brightgift';

console.log(`Publishing Agent starting for: ${blogSlug}, topic: ${topic}, site: ${site}`);

// Load content and data
const contentDir = `content/blog-posts/${blogSlug}`;
const fs = require('fs');
const path = require('path');

const blogFinalPath = path.join(contentDir, 'blog-final.md');
const workflowStatePath = path.join(contentDir, 'workflow_state.json');
const imagesDir = path.join(contentDir, 'images');

if (!fs.existsSync(blogFinalPath)) {
  throw new Error(`Blog final content not found at: ${blogFinalPath}`);
}

const blogContent = fs.readFileSync(blogFinalPath, 'utf8');
const workflowState = JSON.parse(fs.readFileSync(workflowStatePath, 'utf8'));

console.log('Loaded blog final content and workflow state');
```

### 2. Prepare Publishing Data
- **Extract Blog Metadata**: Parse title, description, and content structure
- **Generate Branch Name**: Create preview branch name using slug format
- **Organize Content**: Prepare blog content and images for upload
- **Validate Assets**: Ensure all required files are present and valid
- **Prepare Social Posts**: Create fully optimized social posts for X, Bluesky, Pinterest, Facebook, and Instagram

### 3. Prepare Blog Content with Social Posts
- **Generate Platform-Optimized Posts**: Create fully prepared social posts optimized for each platform
- **X (Twitter)**: 280-character optimized post with hashtags and engagement hooks
- **Bluesky**: Platform-specific post leveraging Bluesky's unique features
- **Pinterest**: Pin-worthy description with relevant hashtags and visual appeal
- **Facebook**: Algorithm-optimized post for maximum engagement and reach
- **Instagram**: Instagram-optimized post with hashtag strategy and visual focus
- **Content Integration**: Ensure social posts are properly integrated with blog content
- **Preview Preparation**: Prepare content for web dashboard display and manual posting

### 4. GitHub Operations
- **Create Preview Branch**: Create new branch from main using GitHub API
- **Upload Blog Content**: Add blog content with social posts to appropriate directory structure
- **Upload Images**: Add all generated images to images directory
- **Commit Changes**: Create descriptive commit with all content and assets
- **Branch Verification**: Ensure branch creation and content upload succeeded

### 5. Cloudflare Pages Deployment
- **Create Preview Deployment**: Trigger Cloudflare Pages deployment for preview branch
- **Monitor Deployment**: Track deployment status and wait for completion
- **Verify Deployment**: Ensure deployment succeeded and generate preview URL
- **Error Handling**: Handle deployment failures and retry if necessary
- **URL Validation**: Verify preview URL is accessible and functional

### 6. Pull Request Creation
- **Create PR**: Generate pull request from preview branch to main
- **PR Title**: Include blog post title and descriptive information
- **PR Description**: Include comprehensive description with:
  - Blog post summary and key points
  - Preview URL for testing
  - Content type and target audience
  - Affiliate integration details
  - SEO optimization summary
- **PR Labels**: Add appropriate labels for content type and review status
- **Review Assignment**: Set up for human review and approval

### 7. Deployment Verification
- **Preview URL Testing**: Verify preview URL loads correctly
- **Content Validation**: Ensure blog content displays properly
- **Image Verification**: Confirm all images load and display correctly
- **Mobile Testing**: Verify content works on mobile devices
- **Performance Check**: Ensure page loads quickly and efficiently

### 8. Update Workflow State
```javascript
// Update workflow state with publishing completion
workflowState.current_phase = "PUBLISHING_COMPLETE";
workflowState.next_agent = "SocialAgent"; // Disabled for now
workflowState.last_updated = new Date().toISOString();
workflowState.updated_at = new Date().toISOString();
workflowState.agents_run.push("PublishingAgent");
workflowState.agent_outputs["PublishingAgent"] = "published/";

// Add publishing metadata
workflowState.publishing_metadata = {
  preview_url: previewUrl,
  pr_number: pr.number,
  pr_url: pr.html_url,
  branch_name: branchName,
  deployment_id: deployment.id,
  deployment_status: deploymentStatus.status,
  approval_status: "pending",
  content_files: ["blog-published.md", "banner.webp", "og.webp", "og.jpg"],
  social_posts: socialPosts,
  publish_time: new Date().toISOString()
};

// Update timestamps
workflowState.timestamps.publishing_started = workflowState.timestamps.publishing_started || new Date().toISOString();
workflowState.timestamps.publishing_completed = new Date().toISOString();

// Save updated workflow state
fs.writeFileSync(workflowStatePath, JSON.stringify(workflowState, null, 2));
console.log(`Workflow state updated: ${workflowStatePath}`);
```

### 9. Send Approval Notification
```javascript
// Send approval notification
const notificationService = new NotificationService();

try {
  await notificationService.sendApprovalNotification(
    workflowState.publishing_metadata,
    topic,
    socialPosts
  );
  console.log('Approval notification sent');
  
} catch (error) {
  console.error('Notification sending failed:', error.message);
  // Continue execution even if notification fails
}
```

### 10. Monitor Approval Status
```javascript
// Check for approval status (implementation needed)
const approvalStatus = await checkApprovalStatus(prNumber);
# Note: This method needs to be implemented based on your approval system
# Options: Webhook monitoring, API polling, or manual trigger
```
- Check for approval notifications or webhook calls
- Monitor PR status for approval/merge events
- Wait for human approval decision

### 11. Handle Approval and Live Publishing
```javascript
// Handle approval and live publishing
const approvalStatus = await checkApprovalStatus(prNumber);

if (approvalStatus === 'approved') {
  # Merge PR to main branch
  const githubAPI = new GitHubAPI();
  await githubAPI.mergePullRequest(prNumber);
  
  # Trigger production deployment
  const cloudflareAPI = new CloudflareAPI();
  await cloudflareAPI.deployToProduction('main');
  
  # Update workflow state
  workflowState.publishing_metadata.approval_status = "published";
  workflowState.publishing_metadata.live_url = "https://bright-gift.com/blog-post-slug";
  workflowState.publishing_metadata.published_at = new Date().toISOString();
  
  # Send live publishing notification
  await notificationService.sendLivePublishingNotification(
    workflowState.publishing_metadata
  );
  
  # Clean up preview branch
  await githubAPI.deleteBranch(branchName);
  
} else if (approvalStatus === 'rejected') {
  # Update workflow state
  workflowState.publishing_metadata.approval_status = "rejected";
  workflowState.publishing_metadata.rejection_reason = approvalStatus.reason;
  
  # Send rejection notification
  await notificationService.sendRejectionNotification(
    workflowState.publishing_metadata
  );
  
  # Archive content for review
  await archiveContent(blogSlug);
  
  # Clean up preview branch
  await githubAPI.deleteBranch(branchName);
}
```
- **If Approved**: 
  - Merge PR to main branch using GitHub API
  - Trigger production deployment to Cloudflare Pages
  - Update workflow state to "published"
  - Send live publishing notification
  - Clean up preview branch
- **If Rejected**:
  - Update workflow state to "rejected"
  - Send rejection notification with feedback
  - Archive content for review
  - Clean up preview branch

### 12. Generate Social Posts and Prepare Content
```javascript
// Generate platform-optimized social posts
const socialPosts = generateSocialPosts(blogContent, topic);

// Prepare blog content with social posts in frontmatter
const blogContentWithSocial = prepareBlogContentWithSocial(blogContent, socialPosts);

// Save updated blog content
const blogPublishedPath = path.join(contentDir, 'blog-published.md');
fs.writeFileSync(blogPublishedPath, blogContentWithSocial);
console.log(`Blog content with social posts saved to: ${blogPublishedPath}`);
```

### 13. Commit Changes to GitHub
```javascript
// Commit all changes to trigger next agent
const { execSync } = require('child_process');

try {
  // Add all files to git
  execSync('git add .', { cwd: process.cwd(), stdio: 'inherit' });
  console.log('Files added to git');
  
  // Commit changes
  const commitMessage = `Publishing Agent: Complete publishing for ${blogSlug} - ${topic}`;
  execSync(`git commit -m "${commitMessage}"`, { cwd: process.cwd(), stdio: 'inherit' });
  console.log('Changes committed to git');
  
  // Push to trigger GitHub webhook
  execSync('git push', { cwd: process.cwd(), stdio: 'inherit' });
  console.log('Changes pushed to GitHub');
  
} catch (error) {
  console.error('Git operations failed:', error.message);
  // Continue execution even if git fails
}
```

### 14. Trigger Next Agent
The GitHub commit above will automatically trigger the GitHub webhook, which will then trigger the next agent (SocialAgent) via n8n.

## 🔧 Helper Function Documentation

### **generateSocialPosts(blogContent, topic)**
```javascript
// Should return an object with keys for each platform (x, bluesky, pinterest, facebook, instagram)
```

### **prepareBlogContentWithSocial(blogContent, socialPosts)**
```javascript
// Should return a string with the blog content and social posts in frontmatter
```

### **GitHubAPI**
```javascript
// Class for GitHub operations: createBranch, uploadFile, createPullRequest, mergePullRequest, deleteBranch
```

### **CloudflareAPI**
```javascript
// Class for Cloudflare Pages deployment: deployPreview, waitForDeployment, deployToProduction
```

## 📁 Output Files
- `content/blog-posts/{blogSlug}/blog-published.md` - Blog content with social posts in frontmatter
- `content/blog-posts/{blogSlug}/workflow_state.json` - Updated state with comprehensive publishing metadata
- GitHub preview branch with all content and assets
- Cloudflare Pages preview deployment
- GitHub pull request with preview URL
- Publishing logs and metadata

## 🎯 Success Criteria
- ✅ **GitHub Operations**: Preview branch created and content uploaded successfully
- ✅ **Cloudflare Deployment**: Preview deployment completed with accessible URL
- ✅ **Pull Request**: Comprehensive PR created with preview link and description
- ✅ **Content Verification**: All content and images display correctly on preview
- ✅ **Performance**: Preview page loads quickly and works on all devices
- ✅ **Approval Notification**: Comprehensive notification sent with all required information
- ✅ **Approval Handling**: Proper monitoring and handling of approval/rejection decisions
- ✅ **Live Publishing**: Successful merge to main and production deployment (if approved)
- ✅ **Workflow State**: Comprehensive metadata updated and next agent triggered via GitHub commit

## 🔧 Configuration
- **GitHub Token**: Required for repository access and operations
- **Cloudflare API**: Required for deployment and status monitoring
- **Repository Settings**: Configured for preview branches and PR workflows
- **Deployment Settings**: Cloudflare Pages project configuration

## 📝 Publishing Guidelines

### **Branch Management:**
- **Branch Naming**: `preview/blog-post-slug` format
- **Branch Source**: Always create from main branch
- **Content Organization**: Maintain proper directory structure
- **Commit Messages**: Descriptive and include content type

### **Deployment Process:**
- **Preview Deployment**: Always deploy to preview environment first
- **Deployment Monitoring**: Track status and wait for completion
- **URL Verification**: Ensure preview URL is accessible
- **Error Handling**: Retry deployment on failures

### **Pull Request Standards:**
- **PR Title**: Include blog post title and content type
- **PR Description**: Comprehensive description with:
  - Content summary and key points
  - Preview URL for testing
  - Target audience and content type
  - SEO and affiliate integration details
  - Technical implementation notes
- **PR Labels**: Add appropriate labels for review and categorization
- **Review Process**: Set up for human review and approval

### **Content Organization:**
- **Blog Content**: Upload to appropriate blog directory with social posts in frontmatter
- **Images**: Organize in images directory with proper naming
- **Metadata**: Include all necessary frontmatter, metadata, and social posts
- **File Structure**: Maintain consistent directory organization
- **Social Posts**: Include 5 fully optimized, platform-specific posts in blog frontmatter for dashboard display and manual posting

### **Social Post Optimization Guidelines:**
- **X (Twitter)**: 280 characters max, include relevant hashtags, engagement hooks, and preview URL
- **Bluesky**: Leverage platform-specific features, community engagement, and Bluesky's unique capabilities
- **Pinterest**: Pin-worthy descriptions with visual appeal, relevant hashtags, and Pinterest-optimized language
- **Facebook**: Algorithm-optimized content for maximum reach, engagement, and sharing potential
- **Instagram**: Visual-focused content with hashtag strategy, Instagram-specific language, and story integration hints
- **Platform-Specific Hashtags**: Use relevant, trending hashtags appropriate for each platform
- **Call-to-Action**: Include clear, compelling CTAs appropriate for each platform
- **Preview URL**: Include blog post URL for traffic generation

### **Approval Workflow Guidelines:**
- **Approval Notification**: Send comprehensive notification with preview URL, PR link, and social posts
- **Approval Monitoring**: Check for approval status via webhook or notification system
- **Live Publishing**: Merge to main branch and trigger production deployment when approved
- **Rejection Handling**: Archive content and send rejection notification with feedback
- **Branch Cleanup**: Remove preview branches after approval/rejection decision
- **State Tracking**: Update workflow state with approval status and live URL
- **Production Deployment**: Ensure Cloudflare Pages deploys from main branch to live site

## 📝 Notes
- **Deployment Verification**: Always verify deployment success before proceeding
- **Error Handling**: Implement comprehensive error handling for all operations
- **Performance Focus**: Ensure preview pages load quickly and efficiently
- **Mobile Optimization**: Verify content works well on mobile devices
- **Security**: Use proper authentication and access controls
- **Logging**: Maintain detailed logs of all publishing operations
- **Rollback Capability**: Be prepared to rollback failed deployments
- **Quality Assurance**: Verify all content displays correctly before triggering next agent
- **Approval Workflow**: Monitor approval status and handle live publishing automatically
- **Production Deployment**: Ensure main branch merges trigger live site deployment
- **Branch Management**: Clean up preview branches after approval/rejection decisions
- **Notification System**: Send comprehensive notifications for all approval events 