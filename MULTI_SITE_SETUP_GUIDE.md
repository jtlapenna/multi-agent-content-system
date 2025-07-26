# 🌐 Multi-Site Setup Guide

## 🎯 Overview

This guide explains how to set up multiple sites using a single Slack workspace with site-specific channels. This approach provides centralized management while maintaining site isolation.

---

## 🏗️ Multi-Site Architecture

### **Single Slack Workspace Structure**
```
Workspace: multi-agent-automation
├── #brightgift-hub
├── #brightgift-seo-agent
├── #brightgift-blog-agent
├── #brightgift-review-agent
├── #brightgift-image-agent
├── #brightgift-publishing-agent
├── #anothersite-hub
├── #anothersite-seo-agent
├── #anothersite-blog-agent
├── #anothersite-review-agent
├── #anothersite-image-agent
└── #anothersite-publishing-agent
```

### **Site-Specific Repositories**
```
GitHub Organization: your-org
├── brightgift-content-system
├── anothersite-content-system
└── thirdsite-content-system
```

---

## 🔧 Step 1: Slack Channel Setup

### 1.1 Create Site-Specific Channels
For each site, create these channels in your Slack workspace:

#### **BrightGift Site Channels**
```
#brightgift-hub
#brightgift-seo-agent
#brightgift-blog-agent
#brightgift-review-agent
#brightgift-image-agent
#brightgift-publishing-agent
```

#### **AnotherSite Channels**
```
#anothersite-hub
#anothersite-seo-agent
#anothersite-blog-agent
#anothersite-review-agent
#anothersite-image-agent
#anothersite-publishing-agent
```

### 1.2 Channel Configuration
Each channel should be configured with:
- **Purpose**: Site-specific agent operations
- **Members**: Site team members, n8n bot
- **Privacy**: Private channels for site isolation

---

## 🔧 Step 2: Cursor Integration Setup

### 2.1 Single Cursor Integration
1. **Install Cursor Slack app** once for the workspace
2. **Configure default settings** for the workspace
3. **Set up repository access** for all site repositories

### 2.2 Channel-Specific Settings
For each site's channels, configure Cursor settings:

#### **BrightGift Channels**
```
@Cursor settings
```
Set:
- **Default Repository**: `your-org/brightgift-content-system`
- **Default Model**: `o3`
- **Base Branch**: `main`

#### **AnotherSite Channels**
```
@Cursor settings
```
Set:
- **Default Repository**: `your-org/anothersite-content-system`
- **Default Model**: `o3`
- **Base Branch**: `main`

---

## 🔧 Step 3: n8n Multi-Site Configuration

### 3.1 Updated n8n Workflow
Use the `multi-site-agent-router.json` workflow which:

1. **Receives webhook** with site and agent details
2. **Routes to site-specific channel** based on site name and agent
3. **Sends instruction review command** to the appropriate channel
4. **Returns confirmation** response

### 3.2 Webhook Payload Format
```json
{
  "site_name": "brightgift",
  "agent_name": "SEOAgent",
  "blog_slug": "blog-2025-01-27-sleep-training",
  "topic": "sleep training tips",
  "current_phase": "SEO"
}
```

### 3.3 Channel ID Configuration
Get channel IDs for each site's channels:

1. **Right-click each channel** in Slack
2. **Select "Copy link"**
3. **Extract the channel ID** from the URL
4. **Update the n8n workflow** with the correct channel IDs

### 3.4 Environment Variables
```bash
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
# BrightGift channels
SLACK_CHANNEL_BRIGHTGIFT_HUB=C1234567890
SLACK_CHANNEL_BRIGHTGIFT_SEO=C1234567891
SLACK_CHANNEL_BRIGHTGIFT_BLOG=C1234567892
SLACK_CHANNEL_BRIGHTGIFT_REVIEW=C1234567893
SLACK_CHANNEL_BRIGHTGIFT_IMAGE=C1234567894
SLACK_CHANNEL_BRIGHTGIFT_PUBLISHING=C1234567895
# AnotherSite channels
SLACK_CHANNEL_ANOTHERSITE_HUB=C1234567896
SLACK_CHANNEL_ANOTHERSITE_SEO=C1234567897
SLACK_CHANNEL_ANOTHERSITE_BLOG=C1234567898
SLACK_CHANNEL_ANOTHERSITE_REVIEW=C1234567899
SLACK_CHANNEL_ANOTHERSITE_IMAGE=C1234567900
SLACK_CHANNEL_ANOTHERSITE_PUBLISHING=C1234567901
```

---

## 🔧 Step 4: Site-Specific Agent Instructions

### 4.1 Repository Structure
Each site should have its own repository with agent instructions:

#### **BrightGift Repository** (`your-org/brightgift-content-system`)
```
agents/
├── seo/instructions.md
├── blog/instructions.md
├── review/instructions.md
├── image/instructions.md
└── publishing/instructions.md
```

#### **AnotherSite Repository** (`your-org/anothersite-content-system`)
```
agents/
├── seo/instructions.md
├── blog/instructions.md
├── review/instructions.md
├── image/instructions.md
└── publishing/instructions.md
```

### 4.2 Site-Specific Instructions
Each site's instructions should be customized for:
- **Brand voice and style**
- **Target audience**
- **Content guidelines**
- **SEO requirements**
- **Affiliate partnerships**

---

## 🔧 Step 5: Testing Multi-Site Setup

### 5.1 Test BrightGift Site
Send test commands in BrightGift channels:

#### **#brightgift-seo-agent**
```
@Cursor [repo=your-org/brightgift-content-system] review instructions from agents/seo/instructions.md and then execute the following task: run SEOAgent for test-blog-slug topic: test topic phase: SEO site: brightgift
```

#### **#brightgift-blog-agent**
```
@Cursor [repo=your-org/brightgift-content-system] review instructions from agents/blog/instructions.md and then execute the following task: run BlogAgent for test-blog-slug topic: test topic phase: BLOG site: brightgift
```

### 5.2 Test AnotherSite
Send test commands in AnotherSite channels:

#### **#anothersite-seo-agent**
```
@Cursor [repo=your-org/anothersite-content-system] review instructions from agents/seo/instructions.md and then execute the following task: run SEOAgent for test-blog-slug topic: test topic phase: SEO site: anothersite
```

#### **#anothersite-blog-agent**
```
@Cursor [repo=your-org/anothersite-content-system] review instructions from agents/blog/instructions.md and then execute the following task: run BlogAgent for test-blog-slug topic: test topic phase: BLOG site: anothersite
```

---

## 🔧 Step 6: Adding New Sites

### 6.1 Create New Site Channels
```
#newsite-hub
#newsite-seo-agent
#newsite-blog-agent
#newsite-review-agent
#newsite-image-agent
#newsite-publishing-agent
```

### 6.2 Update n8n Workflow
Add the new site to the `siteAgentChannels` mapping:

```javascript
const siteAgentChannels = {
  'brightgift': { /* existing channels */ },
  'anothersite': { /* existing channels */ },
  'newsite': {
    'SEOAgent': 'C1234567902', // #newsite-seo-agent
    'BlogAgent': 'C1234567903', // #newsite-blog-agent
    'ReviewAgent': 'C1234567904', // #newsite-review-agent
    'ImageAgent': 'C1234567905', // #newsite-image-agent
    'PublishingAgent': 'C1234567906' // #newsite-publishing-agent
  }
};
```

### 6.3 Update Repository Mapping
```javascript
const repoMapping = {
  'brightgift': 'your-org/brightgift-content-system',
  'anothersite': 'your-org/anothersite-content-system',
  'newsite': 'your-org/newsite-content-system'
};
```

### 6.4 Configure Channel Settings
Set Cursor settings for new site channels:
```
@Cursor settings
```
Set:
- **Default Repository**: `your-org/newsite-content-system`
- **Default Model**: `o3`
- **Base Branch**: `main`

---

## 🔧 Step 7: Monitoring and Management

### 7.1 Centralized Monitoring
- **Monitor all sites** from single Slack workspace
- **Cross-site analytics** and reporting
- **Unified error tracking** and alerting

### 7.2 Site Isolation
- **Private channels** prevent cross-site interference
- **Site-specific repositories** maintain code separation
- **Independent workflows** allow parallel processing

### 7.3 Team Management
- **Single login** for all sites
- **Role-based access** to site channels
- **Centralized permissions** management

---

## 🎯 Benefits of Multi-Site Single Workspace

### **✅ Advantages**
1. **Cost Efficiency**: Single Slack workspace subscription
2. **Centralized Management**: One place to monitor all sites
3. **Simplified Configuration**: Single Cursor integration
4. **Better Monitoring**: Cross-site analytics and reporting
5. **Team Efficiency**: Single login for all sites
6. **Scalable**: Easy to add new sites

### **⚠️ Considerations**
1. **Channel Management**: Need to organize many channels
2. **Permission Complexity**: Site-specific access controls
3. **Noise Management**: Multiple sites in one workspace
4. **Security**: Shared workspace (mitigated by private channels)

---

## 🔧 Best Practices

### **Channel Organization**
- Use consistent naming: `#site-name-agent-type`
- Create channel groups for each site
- Use private channels for site isolation

### **Repository Management**
- Separate repository per site
- Consistent structure across sites
- Site-specific configurations

### **Team Access**
- Grant access only to relevant site channels
- Use role-based permissions
- Regular access reviews

### **Monitoring**
- Set up site-specific alerts
- Monitor cross-site performance
- Track resource usage per site

---

## 📚 Additional Resources

- [Slack Channel Management](https://slack.com/help/articles/201402297-Create-a-channel)
- [Cursor Multi-Repository Setup](https://cursor.com/docs/multi-repo)
- [n8n Workflow Management](https://docs.n8n.io/workflows/)
- [GitHub Organization Management](https://docs.github.com/en/organizations)

---

## 🔧 Troubleshooting

### **Site Not Found Error**
1. Check site name in webhook payload
2. Verify site is configured in n8n workflow
3. Ensure channel IDs are correct

### **Wrong Repository**
1. Check @Cursor settings in site channels
2. Verify repository mapping in n8n
3. Test repository access permissions

### **Channel Access Issues**
1. Verify team member permissions
2. Check channel privacy settings
3. Ensure Cursor has channel access 