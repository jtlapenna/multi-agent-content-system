# 🤖 Cursor Background Agent Setup Guide

## 🎯 Overview

This guide explains exactly how to configure Cursor background agents to monitor Slack messages and execute our multi-agent content automation workflow.

---

## 🔧 Step 1: Access Cursor Background Agents

### 1.1 Open Cursor Background Agents
1. **Open Cursor** application
2. **Go to Background Agents** section (usually in the sidebar or settings)
3. **Click "Create New Background Agent"** or "Add Agent"

### 1.2 Agent Configuration Interface
You should see a configuration interface with these fields:
- **Agent Name**: The name of your agent
- **Trigger Type**: What triggers the agent
- **Instructions**: What the agent should do
- **Files**: Files the agent can access
- **Settings**: Additional configuration options

---

## 🔧 Step 2: Configure Each Agent

### 2.1 SEO Agent Configuration

#### **Agent Name**
```
SEOAgent
```

#### **Trigger Configuration**
- **Trigger Type**: Slack Message
- **Channel**: #content-automation (or your chosen channel)
- **Message Pattern**: `@Cursor run SEOAgent for [blog-slug] topic: [topic] phase: SEO`

#### **Instructions**
Copy and paste the contents of `agents/seo/cursor-background-agent.md` into the instructions field.

#### **Files to Upload**
Upload these files to the agent's file list:
- `utils/enhancedSEOProcessor.js`
- `utils/googleAdsAPI.js`
- `utils/keywordBank.js`
- `utils/workflowStateManager.js`
- `workflow_state.json` (template)

### 2.2 Blog Agent Configuration

#### **Agent Name**
```
BlogAgent
```

#### **Trigger Configuration**
- **Trigger Type**: Slack Message
- **Channel**: #content-automation (or your chosen channel)
- **Message Pattern**: `@Cursor run BlogAgent for [blog-slug] topic: [topic] phase: BLOG`

#### **Instructions**
Copy and paste the contents of `agents/blog/cursor-background-agent.md` into the instructions field.

#### **Files to Upload**
Upload these files to the agent's file list:
- `utils/contentChecker.js`
- `utils/workflowStateManager.js`
- `workflow_state.json` (template)

### 2.3 Review Agent Configuration

#### **Agent Name**
```
ReviewAgent
```

#### **Trigger Configuration**
- **Trigger Type**: Slack Message
- **Channel**: #content-automation (or your chosen channel)
- **Message Pattern**: `@Cursor run ReviewAgent for [blog-slug] topic: [topic] phase: REVIEW`

#### **Instructions**
Copy and paste the contents of `agents/review/cursor-background-agent.md` into the instructions field.

#### **Files to Upload**
Upload these files to the agent's file list:
- `utils/contentChecker.js`
- `utils/workflowStateManager.js`
- `workflow_state.json` (template)

### 2.4 Image Agent Configuration

#### **Agent Name**
```
ImageAgent
```

#### **Trigger Configuration**
- **Trigger Type**: Slack Message
- **Channel**: #content-automation (or your chosen channel)
- **Message Pattern**: `@Cursor run ImageAgent for [blog-slug] topic: [topic] phase: IMAGE`

#### **Instructions**
Copy and paste the contents of `agents/image/cursor-background-agent.md` into the instructions field.

#### **Files to Upload**
Upload these files to the agent's file list:
- `utils/images.js`
- `utils/workflowStateManager.js`
- `workflow_state.json` (template)

### 2.5 Publishing Agent Configuration

#### **Agent Name**
```
PublishingAgent
```

#### **Trigger Configuration**
- **Trigger Type**: Slack Message
- **Channel**: #content-automation (or your chosen channel)
- **Message Pattern**: `@Cursor run PublishingAgent for [blog-slug] topic: [topic] phase: PUBLISHING`

#### **Instructions**
Copy and paste the contents of `agents/publishing/cursor-background-agent.md` into the instructions field.

#### **Files to Upload**
Upload these files to the agent's file list:
- `utils/githubAPI.js`
- `utils/cloudflareAPI.js`
- `utils/notificationService.js`
- `utils/workflowStateManager.js`
- `workflow_state.json` (template)

---

## 🔧 Step 3: Configure Slack Integration

### 3.1 Set Up Cursor Slack Integration
1. **Go to cursor.com/dashboard → Integrations → Slack**
2. **Click "Connect Slack Workspace"**
3. **Authorize Cursor** to access your Slack workspace
4. **Select the channel** where you want Cursor to be available (#content-automation)

### 3.2 Configure Default Settings
In your connected Slack workspace, configure default settings:

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

## 🔧 Step 4: Test the Configuration

### 4.1 Test Individual Agents
Send test messages in Slack to verify each agent responds:

```
@Cursor run SEOAgent for test-blog-slug topic: test topic phase: SEO
@Cursor run BlogAgent for test-blog-slug topic: test topic phase: BLOG
@Cursor run ReviewAgent for test-blog-slug topic: test topic phase: REVIEW
@Cursor run ImageAgent for test-blog-slug topic: test topic phase: IMAGE
@Cursor run PublishingAgent for test-blog-slug topic: test topic phase: PUBLISHING
```

### 4.2 Monitor Agent Activity
- **Check Cursor dashboard** for background agent activity
- **Monitor Slack** for agent responses and updates
- **Verify file creation** in your blog folders
- **Check workflow_state.json** updates

### 4.3 Debug Common Issues
Based on the [forum discussions](https://forum.cursor.com/t/cursor-is-now-available-in-slack/106350):

1. **Agent not responding**: Check Cursor Slack integration settings
2. **Wrong repository**: Use `@Cursor settings` to configure default repo
3. **Permission issues**: Ensure Cursor has access to the Slack channel
4. **File access issues**: Verify all required files are uploaded to the agent

---

## 🔧 Step 5: Production Deployment

### 5.1 Environment Configuration
Ensure these environment variables are set in your Cursor environment:
```bash
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_CHANNEL_ID=C1234567890
GITHUB_TOKEN=your-github-token
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5.2 Agent Monitoring
Set up monitoring for:
- **Agent execution times** and success rates
- **Slack message delivery** and response times
- **File creation** and workflow state updates
- **Error rates** and retry attempts

### 5.3 Backup and Recovery
- **Document manual agent triggering** procedures
- **Set up fallback notification** systems
- **Create recovery procedures** for failed workflows

---

## 🎯 Key Configuration Points

### **Agent Trigger Pattern**
All agents use this consistent pattern:
```
@Cursor run [AgentName] for [blog-slug] topic: [topic] phase: [phase]
```

### **Workflow State Management**
Each agent:
1. **Finds matching workflow_state.json** based on current_phase and next_agent
2. **Executes its specific task**
3. **Updates workflow_state.json** with new phase and next agent
4. **Triggers the next agent** via Slack message

### **File Dependencies**
Each agent needs access to:
- **Utility files** from the `utils/` directory
- **Workflow state template** (`workflow_state.json`)
- **Agent-specific instructions** from the `agents/` directory

---

## 📚 Additional Resources

- [Cursor Slack Integration Documentation](https://cursor.com/docs/slack-integration)
- [Cursor Background Agents Guide](https://cursor.com/docs/background-agents)
- [Slack API Documentation](https://api.slack.com/)
- [n8n Workflow Documentation](https://docs.n8n.io/)

---

## 🎯 Benefits of This Configuration

1. **Native Integration**: Uses Cursor's official Slack integration
2. **Secure**: Agents run in Cursor's secure environment
3. **Real-time**: Direct Slack communication with immediate feedback
4. **Scalable**: Can handle multiple concurrent workflows
5. **Reliable**: Built-in error handling and retry mechanisms
6. **Maintainable**: Clear separation of concerns and modular design 