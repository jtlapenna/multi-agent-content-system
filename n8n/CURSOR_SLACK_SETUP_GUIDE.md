# 🚀 Cursor Slack Integration Setup Guide

## 🎯 Overview

This guide explains how to configure Cursor background agents to work with Slack messages for our multi-agent content automation system. Based on the [official Cursor forum announcement](https://forum.cursor.com/t/cursor-is-now-available-in-slack/106350), Cursor now has native Slack integration that allows you to trigger background agents directly from Slack.

---

## 🔧 Step 1: Set Up Cursor Slack Integration

### 1.1 Connect Cursor to Slack
1. Go to **cursor.com/dashboard → Integrations → Slack**
2. Click "Connect Slack Workspace"
3. Authorize Cursor to access your Slack workspace
4. Select the channels where you want Cursor to be available

### 1.2 Configure Default Settings
In your connected Slack workspace, you can configure default settings:

**View current settings:**
```
@Cursor help
```

**Configure default settings:**
```
@Cursor settings
```

**Use specific settings for a single command:**
```
@Cursor [branch=dev, model=o3, repo=your-repo] [your command]
```

---

## 🔧 Step 2: Configure Background Agents

### 2.1 Agent Configuration Structure
Each Cursor background agent needs to be configured to:

1. **Monitor Slack messages** for `@Cursor` mentions
2. **Parse command parameters** (agent name, blog slug, topic)
3. **Execute the appropriate workflow** based on the parsed command
4. **Update workflow state** and trigger the next agent

### 2.2 Agent Command Format
Our system uses this command format:
```
@Cursor run [AgentName] for [blog-slug] topic: [topic] phase: [phase]
```

**Examples:**
```
@Cursor run SEOAgent for blog-2025-07-25-sleep-training topic: sleep training tips phase: SEO
@Cursor run BlogAgent for blog-2025-07-25-sleep-training topic: sleep training tips phase: BLOG
@Cursor run ReviewAgent for blog-2025-07-25-sleep-training topic: sleep training tips phase: REVIEW
```

### 2.3 Agent Detection Logic
Each Cursor background agent should implement this detection logic:

```javascript
// Agent Detection Logic (implemented in Cursor background agent)
function detectAgentCommand(slackMessage) {
  const cursorPattern = /@Cursor run (\w+) for ([^\s]+) topic: ([^,]+) phase: (\w+)/;
  const match = slackMessage.match(cursorPattern);
  
  if (match) {
    return {
      agentName: match[1],        // e.g., "SEOAgent"
      blogSlug: match[2],         // e.g., "blog-2025-07-25-sleep-training"
      topic: match[3],            // e.g., "sleep training tips"
      phase: match[4]             // e.g., "SEO"
    };
  }
  
  return null;
}
```

---

## 🔧 Step 3: Agent Routing Logic

### 3.1 Workflow State Management
Each agent should implement this routing logic:

```javascript
// Agent Routing Logic (implemented in Cursor background agent)
async function processAgentWork(agentName, blogSlug, topic, phase) {
  // 1. Scan for workflow_state.json files in blog folders
  const blogFolders = await scanBlogFolders();
  
  // 2. Find matching state
  const matchingState = await findMatchingState(blogFolders, {
    current_phase: phase,
    next_agent: agentName,
    status: "in_progress"
  });
  
  if (!matchingState) {
    console.log(`No matching workflow state found for ${agentName}`);
    return;
  }
  
  // 3. Process the work
  await executeAgentWork(agentName, matchingState);
  
  // 4. Update workflow state
  await updateWorkflowState(matchingState.folder, {
    current_phase: getNextPhase(agentName),
    next_agent: getNextAgent(agentName),
    status: "in_progress",
    last_updated: new Date().toISOString()
  });
  
  // 5. Trigger next agent via Slack
  await triggerNextAgent(getNextAgent(agentName), blogSlug, topic, getNextPhase(agentName));
}
```

### 3.2 Agent Phase Mapping
```javascript
const AGENT_PHASES = {
  'SEOAgent': {
    current_phase: 'SEO',
    next_phase: 'BLOG',
    next_agent: 'BlogAgent'
  },
  'BlogAgent': {
    current_phase: 'BLOG',
    next_phase: 'REVIEW',
    next_agent: 'ReviewAgent'
  },
  'ReviewAgent': {
    current_phase: 'REVIEW',
    next_phase: 'IMAGE',
    next_agent: 'ImageAgent'
  },
  'ImageAgent': {
    current_phase: 'IMAGE',
    next_phase: 'PUBLISHING',
    next_agent: 'PublishingAgent'
  },
  'PublishingAgent': {
    current_phase: 'PUBLISHING',
    next_phase: 'COMPLETE',
    next_agent: null
  }
};
```

---

## 🔧 Step 4: n8n Workflow Configuration

### 4.1 Updated n8n Workflow
Use the new `cursor-slack-trigger-workflow.json` which:

1. **Receives webhook** with agent details
2. **Constructs Cursor command** using `@Cursor` format
3. **Sends Slack message** via Slack API
4. **Returns confirmation** response

### 4.2 Environment Variables
Set these environment variables in n8n:

```bash
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL_ID=C1234567890
```

### 4.3 Webhook Payload Format
```json
{
  "agent_name": "SEOAgent",
  "blog_slug": "blog-2025-07-25-sleep-training",
  "topic": "sleep training tips",
  "current_phase": "SEO"
}
```

---

## 🔧 Step 5: Cursor Background Agent Setup

### 5.1 Create Background Agent Instructions
Each agent needs specific instructions for Cursor. Create these files:

**`agents/seo/cursor-instructions.md`:**
```markdown
# SEO Agent - Cursor Background Agent Instructions

## Purpose
Monitor Slack for @Cursor commands and execute SEO research tasks.

## Trigger Pattern
Monitor Slack messages containing: `@Cursor run SEOAgent for [blog-slug] topic: [topic] phase: SEO`

## Workflow Steps
1. Parse the Slack command to extract blog-slug and topic
2. Scan for workflow_state.json files matching the criteria
3. Execute SEO research using enhancedSEOProcessor.js
4. Update workflow_state.json with results
5. Send Slack message to trigger BlogAgent

## Success Criteria
- SEO research completed and saved to seo-results.json
- workflow_state.json updated with current_phase: "BLOG", next_agent: "BlogAgent"
- Next agent triggered via Slack message
```

### 5.2 Agent Implementation Example
```javascript
// Example: SEO Agent Implementation
class SEOAgent {
  async handleSlackCommand(slackMessage) {
    const command = this.parseCursorCommand(slackMessage);
    if (!command || command.agentName !== 'SEOAgent') return;
    
    // Find matching workflow state
    const workflowState = await this.findWorkflowState(command.blogSlug);
    if (!workflowState) return;
    
    // Execute SEO research
    const seoResults = await this.executeSEOResearch(command.topic);
    
    // Update workflow state
    await this.updateWorkflowState(workflowState.folder, {
      current_phase: 'BLOG',
      next_agent: 'BlogAgent',
      seo_results: seoResults
    });
    
    // Trigger next agent
    await this.triggerNextAgent('BlogAgent', command.blogSlug, command.topic, 'BLOG');
  }
}
```

---

## 🔧 Step 6: Testing the Integration

### 6.1 Test Slack Commands
Test the integration by sending these commands in Slack:

```
@Cursor run SEOAgent for test-blog-slug topic: test topic phase: SEO
```

### 6.2 Monitor Agent Execution
- Check Cursor dashboard for background agent activity
- Monitor Slack for agent responses and updates
- Verify workflow_state.json updates in blog folders

### 6.3 Debug Common Issues
Based on the [forum discussions](https://forum.cursor.com/t/cursor-is-now-available-in-slack/106350):

1. **Agent not responding**: Check Cursor Slack integration settings
2. **Wrong repository**: Use `@Cursor settings` to configure default repo
3. **Permission issues**: Ensure Cursor has access to the Slack channel

---

## 🔧 Step 7: Production Deployment

### 7.1 Environment Configuration
```bash
# Production environment variables
CURSOR_SLACK_CHANNEL_ID=C1234567890
CURSOR_SLACK_BOT_TOKEN=xoxb-production-token
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/cursor-agent-trigger
```

### 7.2 Monitoring and Logging
- Monitor Slack message delivery
- Log agent execution times and success rates
- Set up alerts for failed agent triggers

### 7.3 Backup and Recovery
- Document manual agent triggering procedures
- Set up fallback notification systems
- Create recovery procedures for failed workflows

---

## 📚 Additional Resources

- [Cursor Slack Integration Documentation](https://cursor.com/docs/slack-integration)
- [Slack API Documentation](https://api.slack.com/)
- [n8n Workflow Documentation](https://docs.n8n.io/)

---

## 🎯 Key Benefits of This Approach

1. **Native Integration**: Uses Cursor's official Slack integration
2. **Secure**: Agents run in Cursor's secure environment
3. **Real-time**: Direct Slack communication with immediate feedback
4. **Scalable**: Can handle multiple concurrent workflows
5. **Reliable**: Built-in error handling and retry mechanisms 