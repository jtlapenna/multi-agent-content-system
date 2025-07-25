# 📱 Social Agent Instructions

## 🎯 Purpose
Generate social media posts for blog content and prepare for scheduling across multiple platforms.

## 📋 Responsibilities
- Generate social media posts from blog content
- Create platform-specific content and hashtags
- Prepare posts for scheduling
- Update workflow state and complete workflow

## 🛠️ Tools & Dependencies
- **Social Posts**: `socialPostsProcessor.js` - Social media integration
- **Blog Content**: `blog-final.md` from Review Agent
- **Preview URL**: From Publishing Agent
- **Workflow State**: `workflow_state.json` - State management

## 🔄 Workflow Steps

### 1. Load Blog Content and Preview
```bash
# Load final blog content and preview URL
const blogContent = loadFile('blog-final.md');
const previewUrl = workflowState.preview_url;
```

### 2. Generate Social Posts
- Create platform-specific posts:
  - Twitter/X (280 characters)
  - LinkedIn (professional tone)
  - Facebook (engaging content)
  - Instagram (visual focus)
- Include relevant hashtags
- Add preview URL and call-to-action

### 3. Optimize for Each Platform
- **Twitter/X**: Concise, engaging, with hashtags
- **LinkedIn**: Professional tone, industry insights
- **Facebook**: Engaging, shareable content
- **Instagram**: Visual focus, story-friendly

### 4. Create Post Schedule
- Determine optimal posting times
- Create posting schedule
- Prepare for manual or automated scheduling
- Include all platform variations

### 5. Update Workflow State
```json
{
  "current_phase": "SOCIAL_COMPLETE",
  "next_agent": null,
  "status": "complete",
  "social_posts": {
    "twitter": "...",
    "linkedin": "...",
    "facebook": "...",
    "instagram": "..."
  },
  "schedule": "...",
  "last_updated": "2025-01-XXTXX:XX:XXZ"
}
```

### 6. Complete Workflow
- Commit `social-posts.md` and final `workflow_state.json`
- Send completion notification
- Log final completion in agent logs

## 📁 Output Files
- `social-posts.md` - Generated social media posts
- `workflow_state.json` - Final state with completion
- `logs/social-log.json` - Detailed execution log

## 🎯 Success Criteria
- ✅ Generated posts for all platforms
- ✅ Platform-specific optimization
- ✅ Relevant hashtags included
- ✅ Preview URL and CTA added
- ✅ Posting schedule created
- ✅ Workflow completed

## 🔧 Configuration
- **Social Platforms**: Configured for target platforms
- **Posting Schedule**: Optimal times for each platform
- **Content Style**: Platform-specific guidelines
- **Hashtag Strategy**: Relevant and trending hashtags

## 📝 Social Media Guidelines
- **Twitter/X**: Concise, engaging, hashtags, preview URL
- **LinkedIn**: Professional, industry insights, thought leadership
- **Facebook**: Engaging, shareable, community-focused
- **Instagram**: Visual, story-friendly, hashtag-rich
- **Hashtags**: Relevant, trending, platform-appropriate
- **Call-to-Action**: Clear, compelling, action-oriented

## 📝 Notes
- Generate platform-specific content
- Include relevant hashtags for discoverability
- Add preview URL for traffic generation
- Create engaging call-to-action
- Consider optimal posting times
- Log all social media generation steps 