# 🔗 n8n Integration Guide

## Overview

This guide covers the complete integration of n8n with the Multi-Agent Content System, including Slack triggers, agent communication, and external service connections.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation & Setup](#installation--setup)
3. [Workflow Architecture](#workflow-architecture)
4. [Slack Integration](#slack-integration)
5. [Agent Communication](#agent-communication)
6. [External Service Connections](#external-service-connections)
7. [Complete Workflow Examples](#complete-workflow-examples)
8. [Testing & Troubleshooting](#testing--troubleshooting)

---

## 🛠️ Prerequisites

### Required Services
- **n8n**: Workflow automation platform
- **Slack**: Communication and triggers
- **Supabase**: Database and state management
- **GitHub**: Version control and webhooks
- **Cloudflare**: Deployment and hosting

### Required Credentials
- Slack Bot Token
- Slack Webhook URLs
- Supabase API Key
- GitHub Personal Access Token
- Cloudflare API Token

---

## 🚀 Installation & Setup

### 1. Install n8n
```bash
npm install -g n8n
```

### 2. Start n8n
```bash
n8n start
```

### 3. Access n8n UI
Open: `http://localhost:5678`

### 4. Import Workflows
Import the following workflows from `n8n/workflows/`:
- `agent-trigger-workflow.json`
- `state-sync-workflow.json`
- `error-handling-workflow.json`

---

## 🏗️ Workflow Architecture

### Core Workflows

#### 1. **Slack → Agent Trigger Workflow**
```
Slack Message → Parse Command → Route to Agent → Execute Agent → Update State → Notify Slack
```

#### 2. **Agent → State Sync Workflow**
```
Agent Complete → Update Supabase → Notify Dashboard → Send Slack Update
```

#### 3. **Error Handling Workflow**
```
Error Detected → Log to Supabase → Send Slack Alert → Retry Logic
```

### Data Flow
```
User (Slack) → n8n → Agent API → Agent Execution → State Update → Dashboard → Slack Notification
```

---

## 💬 Slack Integration

### 1. Slack App Setup

#### Create Slack App
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App"
3. Choose "From scratch"
4. Name: "Content Automation Bot"
5. Select your workspace

#### Configure Bot Permissions
Add these OAuth scopes:
- `chat:write` - Send messages
- `channels:read` - Read channel info
- `channels:history` - Read message history
- `commands` - Add slash commands
- `incoming-webhook` - Send webhooks

#### Install App
1. Go to "OAuth & Permissions"
2. Click "Install to Workspace"
3. Copy the "Bot User OAuth Token"

### 2. Slack Triggers

#### Slash Commands
Create these slash commands in your Slack app:

**`/create-blog`**
- Command: `/create-blog`
- Request URL: `http://localhost:5678/webhook/slack-blog-trigger`
- Short Description: "Create a new blog post"

**`/blog-status`**
- Command: `/blog-status [post-id]`
- Request URL: `http://localhost:5678/webhook/slack-status-trigger`
- Short Description: "Check blog post status"

#### Message Triggers
Set up message triggers for specific channels:
- Channel: `#content-automation`
- Trigger words: "create blog", "start workflow", "check status"

### 3. Slack Notifications

#### Webhook URLs
Create these webhook URLs in Slack:
1. **General Notifications**: `#content-automation`
2. **Error Alerts**: `#content-errors`
3. **Success Updates**: `#content-success`

#### Message Templates

**Agent Start Notification**
```json
{
  "text": "🤖 Starting {{agent_name}} for {{post_id}}",
  "attachments": [
    {
      "color": "#36a64f",
      "fields": [
        {
          "title": "Post ID",
          "value": "{{post_id}}",
          "short": true
        },
        {
          "title": "Agent",
          "value": "{{agent_name}}",
          "short": true
        }
      ]
    }
  ]
}
```

**Agent Complete Notification**
```json
{
  "text": "✅ {{agent_name}} completed for {{post_id}}",
  "attachments": [
    {
      "color": "#36a64f",
      "fields": [
        {
          "title": "Status",
          "value": "{{status}}",
          "short": true
        },
        {
          "title": "Next Agent",
          "value": "{{next_agent}}",
          "short": true
        }
      ]
    }
  ]
}
```

**Error Notification**
```json
{
  "text": "🚨 Error in {{agent_name}} for {{post_id}}",
  "attachments": [
    {
      "color": "#ff0000",
      "fields": [
        {
          "title": "Error",
          "value": "{{error_message}}",
          "short": false
        }
      ]
    }
  ]
}
```

---

## 🤖 Agent Communication

### 1. Agent API Endpoints

#### Base URL
```
http://localhost:3000/api/agents
```

#### Available Endpoints

**Trigger Individual Agent**
```http
POST /api/agents/{agent_name}
Content-Type: application/json

{
  "postId": "blog-2024-01-15-gift-ideas",
  "topic": "gift ideas for parents",
  "currentPhase": "INITIALIZED"
}
```

**Run Complete Workflow**
```http
POST /api/agents/complete-workflow
Content-Type: application/json

{
  "topic": "gift ideas for parents",
  "metadata": {
    "contentType": "gift_guide",
    "targetAudience": "adults"
  }
}
```

**Get Workflow Status**
```http
GET /api/agents/status/{postId}
```

**Get All Statuses**
```http
GET /api/agents/status
```

### 2. Agent Trigger Flow

#### From Slack Command
```
Slack Command → n8n Webhook → Parse Command → HTTP Request → Agent API → Agent Execution
```

#### From Agent Completion
```
Agent Complete → Update State → n8n Webhook → Parse State → Trigger Next Agent → Send Slack Update
```

### 3. State Management

#### State Update Flow
```
Agent Complete → Update Supabase → n8n State Sync → Parse State → Trigger Next Agent → Update Dashboard
```

#### State Schema
```json
{
  "postId": "blog-2024-01-15-gift-ideas",
  "currentPhase": "SEO_COMPLETE",
  "nextAgent": "BlogAgent",
  "status": "in_progress",
  "agentOutputs": {
    "SEOAgent": "seo-results.json",
    "BlogAgent": "blog-draft.md"
  },
  "metadata": {
    "topic": "gift ideas for parents",
    "wordCount": 2500,
    "contentType": "gift_guide"
  },
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

---

## 🔌 External Service Connections

### 1. Supabase Integration

#### Database Tables

**workflow_states**
```sql
CREATE TABLE workflow_states (
  id SERIAL PRIMARY KEY,
  post_id VARCHAR(255) UNIQUE NOT NULL,
  current_phase VARCHAR(100) NOT NULL,
  next_agent VARCHAR(100),
  status VARCHAR(50) DEFAULT 'initialized',
  agent_outputs JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**error_logs**
```sql
CREATE TABLE error_logs (
  id SERIAL PRIMARY KEY,
  post_id VARCHAR(255),
  agent VARCHAR(100),
  error_message TEXT,
  severity VARCHAR(20),
  context JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### n8n Supabase Node Configuration
- **Operation**: Upsert
- **Table**: workflow_states
- **Columns**: Map JSON fields to database columns
- **Credentials**: Supabase API key

### 2. GitHub Integration

#### Webhook Events
- **Push Events**: Monitor content updates
- **Pull Request Events**: Monitor approval status
- **Branch Events**: Monitor deployment status

#### GitHub API Endpoints
```http
GET /repos/{owner}/{repo}/commits
GET /repos/{owner}/{repo}/pulls
POST /repos/{owner}/{repo}/pulls
PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge
```

### 3. Cloudflare Integration

#### Deployment API
```http
POST /accounts/{account_id}/pages/projects/{project_name}/deployments
GET /accounts/{account_id}/pages/projects/{project_name}/deployments/{deployment_id}
```

#### n8n Cloudflare Node Configuration
- **Operation**: Create Deployment
- **Project**: Your Cloudflare Pages project
- **Branch**: Preview branch name
- **Credentials**: Cloudflare API token

---

## 🔄 Complete Workflow Examples

### 1. Slack → Blog Creation Workflow

#### Trigger: Slack Slash Command `/create-blog`
```
Slack Command → n8n Webhook → Parse Command → Create Workflow → Trigger SEO Agent → Send Confirmation
```

#### n8n Workflow Steps:
1. **Slack Trigger Node**
   - Event: Slash Command
   - Command: `/create-blog`

2. **Parse Command Node**
   - Extract topic from command text
   - Validate input

3. **Create Workflow Node**
   - HTTP Request to `/api/agents/complete-workflow`
   - Send topic and metadata

4. **Send Confirmation Node**
   - Slack message to user
   - Include post ID and status

### 2. Agent Completion → Next Agent Workflow

#### Trigger: Agent State Update
```
Agent Complete → State Update → n8n Webhook → Parse State → Trigger Next Agent → Send Slack Update
```

#### n8n Workflow Steps:
1. **Webhook Trigger Node**
   - Event: State Update
   - URL: `/webhook/state-sync`

2. **Parse State Node**
   - Extract next agent from state
   - Check if workflow should continue

3. **Trigger Next Agent Node**
   - HTTP Request to appropriate agent endpoint
   - Send post ID and current state

4. **Send Slack Update Node**
   - Notify channel of progress
   - Include next agent and estimated time

### 3. Error Handling Workflow

#### Trigger: Agent Error
```
Agent Error → Error Log → n8n Webhook → Parse Error → Send Alert → Retry Logic
```

#### n8n Workflow Steps:
1. **Webhook Trigger Node**
   - Event: Error Report
   - URL: `/webhook/error-handler`

2. **Parse Error Node**
   - Extract error details
   - Determine severity

3. **Log Error Node**
   - Supabase insert to error_logs
   - Include context and metadata

4. **Send Alert Node**
   - Slack message to error channel
   - Include error details and post ID

5. **Retry Logic Node**
   - Check retry count
   - Either retry or mark as failed

---

## 🧪 Testing & Troubleshooting

### 1. Testing Workflows

#### Test Slack Commands
```bash
# Test slash command
curl -X POST http://localhost:5678/webhook/slack-blog-trigger \
  -H "Content-Type: application/json" \
  -d '{
    "command": "/create-blog",
    "text": "gift ideas for parents",
    "user_id": "U123456",
    "channel_id": "C123456"
  }'
```

#### Test Agent API
```bash
# Test agent trigger
curl -X POST http://localhost:3000/api/agents/seo \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "test-blog-001",
    "topic": "test topic",
    "currentPhase": "INITIALIZED"
  }'
```

#### Test State Sync
```bash
# Test state update
curl -X POST http://localhost:5678/webhook/state-sync \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "test-blog-001",
    "currentPhase": "SEO_COMPLETE",
    "nextAgent": "BlogAgent",
    "status": "in_progress"
  }'
```

### 2. Common Issues

#### n8n Webhook Not Receiving Data
- Check webhook URL is correct
- Verify n8n is running on correct port
- Check firewall settings
- Test webhook with curl

#### Agent API Not Responding
- Verify agent server is running
- Check agent server logs
- Verify API endpoint URLs
- Test with Postman or curl

#### Slack Notifications Not Sending
- Verify Slack webhook URL
- Check Slack app permissions
- Verify channel names
- Test webhook URL directly

#### Supabase Connection Issues
- Verify Supabase credentials
- Check database table exists
- Verify API key permissions
- Test connection with Supabase client

### 3. Debugging Tips

#### Enable n8n Debug Logging
```bash
n8n start --debug
```

#### Check Agent Server Logs
```bash
node server.js
# Look for error messages and API calls
```

#### Monitor Slack Events
- Use Slack's Event API tester
- Check Slack app logs
- Verify webhook URLs

#### Test Database Connections
```bash
# Test Supabase connection
curl -X GET "https://your-project.supabase.co/rest/v1/workflow_states" \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 📚 Additional Resources

### Documentation
- [n8n Documentation](https://docs.n8n.io/)
- [Slack API Documentation](https://api.slack.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub API Documentation](https://docs.github.com/en/rest)

### Tools
- [n8n Community](https://community.n8n.io/)
- [Slack API Tester](https://api.slack.com/tools/block-kit-builder)
- [Supabase Dashboard](https://app.supabase.com/)
- [GitHub Webhook Tester](https://webhook.site/)

### Support
- n8n Discord: [n8n Community](https://discord.gg/n8n)
- Slack API Support: [Slack Developer Support](https://api.slack.com/support)
- Supabase Support: [Supabase Support](https://supabase.com/support)

---

## 🎯 Next Steps

1. **Set up Slack app** with required permissions
2. **Configure Supabase** database and credentials
3. **Import n8n workflows** from the provided JSON files
4. **Test each workflow** individually
5. **Run end-to-end tests** with complete workflows
6. **Monitor and optimize** based on usage patterns

This guide provides everything needed to connect n8n with the Multi-Agent Content System and external services. Follow each section carefully to ensure proper integration. 