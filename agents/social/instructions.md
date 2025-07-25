# 📱 Social Agent Instructions

## 🎯 Purpose
**CURRENTLY DISABLED** - This agent will be implemented later to handle social media post scheduling and publishing. For now, fully optimized social posts are created by the Publishing Agent and included in blog frontmatter, ready for manual posting or future automation.

## 📋 Responsibilities
- **DISABLED**: Generate platform-specific social media posts (X, Bluesky, Pinterest, Facebook, Instagram)
- **DISABLED**: Optimize posts for each platform's requirements and best practices
- **DISABLED**: Schedule posts for optimal engagement times
- **DISABLED**: Track social media performance and engagement
- **DISABLED**: Update workflow state and complete the automation cycle

## 🛠️ Tools & Dependencies
- **DISABLED**: Social media APIs and scheduling tools
- **DISABLED**: Content optimization utilities
- **DISABLED**: Analytics and performance tracking
- **DISABLED**: Workflow state management

## 🔄 Workflow Steps

### **CURRENT STATUS: DISABLED**
The Social Agent is currently disabled. Fully optimized social posts are created by the Publishing Agent and included in blog frontmatter, ready for manual posting or future automation.

### **FUTURE IMPLEMENTATION (When Enabled):**

#### 1. Load Blog Content and Social Posts
```bash
# Load blog content and fully optimized social posts from frontmatter
const blogContent = loadFile('blog-final.md');
const socialPosts = extractSocialPosts(blogContent); // Already optimized for each platform
```

#### 2. Schedule and Publish Optimized Posts
- **X (Twitter)**: Schedule optimized 280-character post with hashtags and engagement hooks
- **Bluesky**: Schedule platform-specific post leveraging Bluesky's unique features
- **Pinterest**: Schedule pin-worthy description with relevant hashtags and visual appeal
- **Facebook**: Schedule algorithm-optimized post for maximum engagement and reach
- **Instagram**: Schedule Instagram-optimized post with hashtag strategy and visual focus

#### 3. Schedule and Publish
- Schedule fully optimized posts for optimal engagement times
- Publish to each platform using platform-specific APIs
- Track performance and engagement metrics

#### 4. Update Workflow State
```json
{
  "current_phase": "SOCIAL_COMPLETE",
  "workflow_status": "completed",
  "social_metadata": {
    "posts_published": 5,
    "platforms": ["x", "bluesky", "pinterest", "facebook", "instagram"],
    "scheduled_times": {...},
    "performance_tracking": {...}
  }
}
```

## 📁 Output Files
- **DISABLED**: Social media scheduling and publishing automation
- **DISABLED**: Performance analytics and engagement metrics
- **DISABLED**: Updated workflow state
- **ENABLED**: Fully optimized social posts are created by Publishing Agent and ready for manual posting

## 🎯 Success Criteria
- **DISABLED**: Social posts scheduled and published automatically
- **DISABLED**: Performance tracking implemented
- **DISABLED**: Workflow cycle completed
- **ENABLED**: Fully optimized social posts created and ready for manual posting

## 🔧 Configuration
- **DISABLED**: Social media API credentials
- **DISABLED**: Scheduling and automation tools
- **DISABLED**: Analytics and performance tracking

## 📝 Social Media Guidelines

### **Platform-Specific Requirements:**
- **X (Twitter)**: 280 characters, hashtags, engagement focus
- **Bluesky**: Platform-specific features, community engagement
- **Pinterest**: Visual descriptions, relevant hashtags, pin optimization
- **Facebook**: Algorithm optimization, engagement strategies
- **Instagram**: Visual content, hashtag strategy, story integration

### **Content Optimization:**
- Platform-specific formatting and requirements
- Optimal posting times for each platform
- Engagement and interaction strategies
- Hashtag and mention optimization

## 📝 Notes
- **CURRENT STATUS**: Social Agent is disabled and will be implemented in a future phase
- **SOCIAL POSTS**: Fully optimized social posts are created by Publishing Agent and included in blog frontmatter
- **DASHBOARD INTEGRATION**: Social posts are displayed in the web dashboard from blog frontmatter
- **MANUAL POSTING**: Users can manually post the optimized social posts to each platform
- **FUTURE DEVELOPMENT**: This agent will be developed when social media automation is prioritized
- **WORKFLOW COMPLETION**: The current workflow ends with the Publishing Agent, but social posts are ready for posting 