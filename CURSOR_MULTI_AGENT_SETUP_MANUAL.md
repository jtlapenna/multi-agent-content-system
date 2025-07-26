# 🤖 Cursor Multi-Agent Setup Manual

## 🎯 Overview

This manual provides a complete setup guide for our multi-agent content automation system using Cursor's Slack integration. The system uses specialized Slack channels for each agent, with n8n routing tasks to specific channels and agents reviewing their instructions on each prompt.

---

## 🏗️ System Architecture

### **Channel Structure**
```
#content-automation-hub (Main coordination channel)
├── #seo-agent (SEO Agent only)
├── #blog-agent (Blog Agent only)  
├── #review-agent (Review Agent only)
├── #image-agent (Image Agent only)
└── #publishing-agent (Publishing Agent only)
```

### **Agent Specialization**
Each agent operates in its own dedicated channel to:
- **Maintain context** and avoid confusion
- **Specialize responses** for specific tasks
- **Enable parallel processing** of multiple workflows
- **Simplify n8n routing** to specific agents

---

## 🔧 Step 1: Slack Channel Setup

### 1.1 Create Specialized Channels
Create these channels in your Slack workspace:

```
#content-automation-hub
#seo-agent
#blog-agent
#review-agent
#image-agent
#publishing-agent
```

### 1.2 Channel Purpose & Configuration

#### **#content-automation-hub**
- **Purpose**: Main coordination and monitoring
- **Members**: All team members, n8n bot
- **Use**: Workflow initiation, status monitoring, manual overrides

#### **#seo-agent**
- **Purpose**: SEO research and keyword analysis
- **Members**: SEO Agent only, n8n bot
- **Use**: SEO tasks, keyword research, topic analysis

#### **#blog-agent**
- **Purpose**: Content generation and writing
- **Members**: Blog Agent only, n8n bot
- **Use**: Blog content creation, affiliate research

#### **#review-agent**
- **Purpose**: Content review and optimization
- **Members**: Review Agent only, n8n bot
- **Use**: Content optimization, SEO enhancement

#### **#image-agent**
- **Purpose**: Image generation and processing
- **Members**: Image Agent only, n8n bot
- **Use**: Hero images, social media images

#### **#publishing-agent**
- **Purpose**: Deployment and publishing
- **Members**: Publishing Agent only, n8n bot
- **Use**: GitHub operations, Cloudflare deployment

---

## 🔧 Step 2: Cursor Slack Integration Setup

### 2.1 Install Cursor Slack App
1. **Go to Cursor integrations**: https://cursor.com/integrations
2. **Click "Connect" next to Slack**
3. **Install the Cursor app** in your Slack workspace
4. **Connect GitHub** and select your default repository
5. **Enable usage-based pricing**
6. **Confirm privacy settings**

### 2.2 Configure Channel Settings
For each specialized channel, configure default settings:

#### **#seo-agent Channel Settings**
```
@Cursor settings
```
Set:
- **Default Repository**: `your-org/multi-agent-content-system`
- **Default Model**: `o3` (or your preferred model)
- **Base Branch**: `main`

#### **#blog-agent Channel Settings**
```
@Cursor settings
```
Set:
- **Default Repository**: `your-org/multi-agent-content-system`
- **Default Model**: `o3`
- **Base Branch**: `main`

#### **#review-agent Channel Settings**
```
@Cursor settings
```
Set:
- **Default Repository**: `your-org/multi-agent-content-system`
- **Default Model**: `o3`
- **Base Branch**: `main`

#### **#image-agent Channel Settings**
```
@Cursor settings
```
Set:
- **Default Repository**: `your-org/multi-agent-content-system`
- **Default Model**: `o3`
- **Base Branch**: `main`

#### **#publishing-agent Channel Settings**
```
@Cursor settings
```
Set:
- **Default Repository**: `your-org/multi-agent-content-system`
- **Default Model**: `o3`
- **Base Branch**: `main`

---

## 🔧 Step 3: Agent Instruction Review System

### 3.1 Instruction Review Protocol
Each agent is configured to review their instructions before processing any task. This ensures they always have the latest guidance.

### 3.2 Agent Instruction Files
Create these files in your repository:

#### **SEO Agent Instructions** (`agents/seo/instructions.md`)
```markdown
# SEO Agent Instructions

## Purpose
Conduct comprehensive SEO research and keyword analysis for blog content.

## Trigger Pattern
Monitor Slack messages in #seo-agent channel for:
`@Cursor run SEOAgent for [blog-slug] topic: [topic] phase: SEO`

## Workflow Steps
1. Review these instructions completely
2. Parse the Slack command to extract blog-slug and topic
3. Scan for workflow_state.json files matching criteria
4. Execute SEO research using enhancedSEOProcessor.js
5. Update workflow_state.json with results
6. Trigger next agent via Slack message

## Success Criteria
- SEO research completed and saved to seo-results.json
- workflow_state.json updated with current_phase: "BLOG", next_agent: "BlogAgent"
- Next agent triggered via Slack message
```

#### **Blog Agent Instructions** (`agents/blog/instructions.md`)
```markdown
# Blog Agent Instructions

## Purpose
Generate high-quality, SEO-optimized blog content.

## Trigger Pattern
Monitor Slack messages in #blog-agent channel for:
`@Cursor run BlogAgent for [blog-slug] topic: [topic] phase: BLOG`

## Workflow Steps
1. Review these instructions completely
2. Parse the Slack command to extract blog-slug and topic
3. Load SEO results from seo-results.json
4. Generate blog content using SEO data
5. Update workflow_state.json with results
6. Trigger next agent via Slack message

## Success Criteria
- Blog content generated and saved to blog-draft.md
- Content is 1,500+ words and SEO-optimized
- workflow_state.json updated with current_phase: "REVIEW", next_agent: "ReviewAgent"
- Next agent triggered via Slack message
```

### 3.3 Instruction Review Commands
Each agent uses this pattern to review instructions:

```bash
# Agent instruction review command
@Cursor [repo=your-org/multi-agent-content-system] review instructions from agents/[agent-name]/instructions.md and then execute the following task: [specific task]
```

---

## 🔧 Step 4: n8n Routing Configuration

### 4.1 Updated n8n Workflow
Update the `cursor-slack-trigger-workflow.json` to route to specific channels:

```json
{
  "name": "Cursor Multi-Agent Router",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "agent-router",
        "responseMode": "responseNode"
      },
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300]
    },
    {
      "parameters": {
        "functionCode": "// Route to specific agent channels\nconst agentChannels = {\n  'SEOAgent': 'C1234567890', // #seo-agent channel ID\n  'BlogAgent': 'C1234567891', // #blog-agent channel ID\n  'ReviewAgent': 'C1234567892', // #review-agent channel ID\n  'ImageAgent': 'C1234567893', // #image-agent channel ID\n  'PublishingAgent': 'C1234567894' // #publishing-agent channel ID\n};\n\nitem.agent_name = $input.first().json.agent_name || 'SEOAgent';\nitem.blog_slug = $input.first().json.blog_slug || 'blog-' + new Date().toISOString().split('T')[0];\nitem.topic = $input.first().json.topic || 'general';\nitem.phase = $input.first().json.current_phase || 'SEO';\nitem.channel_id = agentChannels[item.agent_name];\n\n// Construct instruction review command\nitem.slack_text = `@Cursor [repo=your-org/multi-agent-content-system] review instructions from agents/${item.agent_name.toLowerCase().replace('agent', '')}/instructions.md and then execute the following task: run ${item.agent_name} for ${item.blog_slug} topic: ${item.topic} phase: ${item.phase}`;\n\nreturn item;"
      },
      "name": "Route to Agent Channel",
      "type": "n8n-nodes-base.function",
      "position": [460, 300]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "https://slack.com/api/chat.postMessage",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{ $env.SLACK_BOT_TOKEN }}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "channel",
              "value": "={{ $json.channel_id }}"
            },
            {
              "name": "text",
              "value": "={{ $json.slack_text }}"
            }
          ]
        }
      },
      "name": "Send to Agent Channel",
      "type": "n8n-nodes-base.httpRequest",
      "position": [680, 300]
    }
  ]
}
```

### 4.2 Channel ID Configuration
Get the channel IDs for each specialized channel:

1. **Right-click each channel** in Slack
2. **Select "Copy link"**
3. **Extract the channel ID** from the URL (format: C1234567890)
4. **Update the n8n workflow** with the correct channel IDs

### 4.3 Environment Variables
Set these environment variables in n8n:

```bash
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL_ID_CSEO=C1234567890
SLACK_CHANNEL_ID_BLOG=C1234567891
SLACK_CHANNEL_ID_REVIEW=C1234567892
SLACK_CHANNEL_ID_IMAGE=C1234567893
SLACK_CHANNEL_ID_PUBLISHING=C1234567894
```

---

## 🔧 Step 5: Agent Workflow Commands

### 5.1 SEO Agent Command
```bash
@Cursor [repo=your-org/multi-agent-content-system] review instructions from agents/seo/instructions.md and then execute the following task: run SEOAgent for blog-2025-01-27-sleep-training topic: sleep training tips phase: SEO
```

### 5.2 Blog Agent Command
```bash
@Cursor [repo=your-org/multi-agent-content-system] review instructions from agents/blog/instructions.md and then execute the following task: run BlogAgent for blog-2025-01-27-sleep-training topic: sleep training tips phase: BLOG
```

### 5.3 Review Agent Command
```bash
@Cursor [repo=your-org/multi-agent-content-system] review instructions from agents/review/instructions.md and then execute the following task: run ReviewAgent for blog-2025-01-27-sleep-training topic: sleep training tips phase: REVIEW
```

### 5.4 Image Agent Command
```bash
@Cursor [repo=your-org/multi-agent-content-system] review instructions from agents/image/instructions.md and then execute the following task: run ImageAgent for blog-2025-01-27-sleep-training topic: sleep training tips phase: IMAGE
```

### 5.5 Publishing Agent Command
```bash
@Cursor [repo=your-org/multi-agent-content-system] review instructions from agents/publishing/instructions.md and then execute the following task: run PublishingAgent for blog-2025-01-27-sleep-training topic: sleep training tips phase: PUBLISHING
```

---

## 🔧 Step 6: Complete Workflow Example

### 6.1 Workflow Initiation
1. **User clicks "Start"** in dashboard
2. **n8n receives webhook** with agent details
3. **n8n routes to specific channel** based on agent name
4. **Agent receives command** with instruction review

### 6.2 Agent Processing
1. **Agent reviews instructions** from repository
2. **Agent executes task** based on latest instructions
3. **Agent updates workflow state** and commits changes
4. **Agent triggers next agent** via n8n webhook

### 6.3 Complete Flow
```
Dashboard → n8n → #seo-agent → SEO Agent → n8n → #blog-agent → Blog Agent → n8n → #review-agent → Review Agent → n8n → #image-agent → Image Agent → n8n → #publishing-agent → Publishing Agent
```

---

## 🔧 Step 7: Testing and Validation

### 7.1 Test Individual Agents
Send test commands in each specialized channel:

#### **#seo-agent**
```
@Cursor [repo=your-org/multi-agent-content-system] review instructions from agents/seo/instructions.md and then execute the following task: run SEOAgent for test-blog-slug topic: test topic phase: SEO
```

#### **#blog-agent**
```
@Cursor [repo=your-org/multi-agent-content-system] review instructions from agents/blog/instructions.md and then execute the following task: run BlogAgent for test-blog-slug topic: test topic phase: BLOG
```

### 7.2 Monitor Agent Activity
- **Check each channel** for agent responses
- **Verify instruction review** messages
- **Monitor workflow state** updates
- **Track agent handoffs** between channels

### 7.3 Debug Common Issues
1. **Agent not responding**: Check channel permissions and Cursor integration
2. **Wrong repository**: Verify @Cursor settings in each channel
3. **Instruction review failing**: Check file paths and repository access
4. **n8n routing issues**: Verify channel IDs and webhook configuration

---

## 🔧 Step 8: Production Deployment

### 8.1 Environment Configuration
```bash
# Production environment variables
CURSOR_SLACK_CHANNEL_ID_CSEO=C1234567890
CURSOR_SLACK_CHANNEL_ID_BLOG=C1234567891
CURSOR_SLACK_CHANNEL_ID_REVIEW=C1234567892
CURSOR_SLACK_CHANNEL_ID_IMAGE=C1234567893
CURSOR_SLACK_CHANNEL_ID_PUBLISHING=C1234567894
SLACK_BOT_TOKEN=xoxb-production-token
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/agent-router
```

### 8.2 Monitoring and Logging
- **Monitor Slack message delivery** to each channel
- **Log agent execution times** and success rates
- **Track instruction review** completion rates
- **Monitor workflow state** updates and handoffs

### 8.3 Backup and Recovery
- **Document manual agent triggering** procedures for each channel
- **Set up fallback notification** systems
- **Create recovery procedures** for failed workflows
- **Maintain instruction backup** in multiple locations

---

## 🎯 Key Benefits of This Setup

1. **Agent Specialization**: Each agent operates in its own channel with focused context
2. **Instruction Review**: Agents always review latest instructions before processing
3. **Parallel Processing**: Multiple workflows can run simultaneously in different channels
4. **Clear Routing**: n8n can easily route tasks to specific agents via channel targeting
5. **Context Isolation**: Each agent maintains clean conversation history
6. **Scalable Architecture**: Easy to add new agents and channels

---

## 📚 Additional Resources

- [Cursor Slack Documentation](https://docs.cursor.com/slack)
- [Slack API Documentation](https://api.slack.com/)
- [n8n Workflow Documentation](https://docs.n8n.io/)
- [GitHub Webhooks Documentation](https://docs.github.com/en/developers/webhooks-and-events)

---

## 🔧 Troubleshooting Guide

### **Agent Not Responding**
1. Check Cursor Slack integration settings
2. Verify channel permissions
3. Test @Cursor help in the channel
4. Check agent instruction file paths

### **Wrong Repository**
1. Run @Cursor settings in the channel
2. Verify repository access
3. Check GitHub integration in Cursor dashboard

### **Instruction Review Failing**
1. Verify file paths in repository
2. Check repository access permissions
3. Test manual file access via @Cursor

### **n8n Routing Issues**
1. Verify channel IDs in workflow
2. Check Slack bot permissions
3. Test webhook delivery
4. Monitor n8n execution logs 