# 🔧 Re-Architected n8n Setup Guide

## 🎯 New Architecture Overview

### **4 Workflows Instead of 1:**

1. **Dashboard SEO Trigger** - Handles initial dashboard → SEO agent
2. **Agent-to-Agent Router** - Handles GitHub-triggered agent transitions  
3. **Publishing Approval Handler** - Handles approval → publishing agent
4. **GitHub Webhook Listener** - Listens for GitHub commits and triggers agent router

### **Repository Strategy:**
- **Agent Repository**: Contains agent instructions, utilities, `workflow_state.json`
- **Publishing Repository**: Contains actual blog content for deployment
- **GitHub Webhook**: On the **agent repository** (where state changes happen)

---

## 🔧 Your Webhook URLs

### **n8n Cloud Webhook URLs:**
- **Dashboard SEO Trigger**: `https://thepeakbeyond.app.n8n.cloud/webhook/dashboard-seo-trigger`
- **Agent Router**: `https://thepeakbeyond.app.n8n.cloud/webhook/agent-router`
- **Publishing Approval**: `https://thepeakbeyond.app.n8n.cloud/webhook/publishing-approval`
- **GitHub Webhook**: `https://thepeakbeyond.app.n8n.cloud/webhook/github-webhook`

### **GitHub Webhook URL:**
`https://thepeakbeyond.app.n8n.cloud/webhook/github-webhook`

---

## 🔧 Channel IDs (Already Configured)

Your BrightGift channel IDs are configured in all workflows:
- **SEO**: `C097J4EGEN9`
- **Blog**: `C0987CMJN1E` 
- **Review**: `C097G9YCQT0`
- **Image**: `C0973KH68EB`
- **Publishing**: `C097J4WA0LD`

---

## 🔧 Workflow Setup Steps

### **Step 1: Import All 4 Workflows**

In n8n Cloud, import these files:
1. `n8n/workflows/dashboard-seo-trigger.json`
2. `n8n/workflows/agent-to-agent-router.json`
3. `n8n/workflows/publishing-approval-handler.json`
4. `n8n/workflows/github-webhook-listener.json`

### **Step 2: Configure Credentials**

1. **Slack Bot Token**: Add to all workflows
2. **GitHub OAuth2**: Add to GitHub webhook listener

### **Step 3: Set Environment Variables**

In n8n Cloud Settings → Environment Variables:
```
N8N_WEBHOOK_URL=https://thepeakbeyond.app.n8n.cloud
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
```

### **Step 4: Set Up GitHub Webhook**

1. **Go to your agent repository** (not publishing repo)
2. **Settings → Webhooks → Add webhook**
3. **Payload URL**: `https://thepeakbeyond.app.n8n.cloud/webhook/github-webhook`
4. **Content type**: `application/json`
5. **Events**: Just the `push` event
6. **Secret**: (optional) Add a secret for security

---

## 🔄 Complete Workflow Flow

### **1. Dashboard → SEO Agent**
```
Dashboard → n8n (Dashboard SEO Trigger) → Slack → Cursor SEO Agent
```

### **2. SEO → Blog → Review → Image**
```
Cursor Agent → GitHub Commit → n8n (GitHub Listener) → n8n (Agent Router) → Slack → Next Cursor Agent
```

### **3. Image → Publishing (After Approval)**
```
Dashboard Approval → n8n (Publishing Approval) → Slack → Cursor Publishing Agent
```

### **4. Manual Agent Triggers**
```
Dashboard → n8n (Agent Router) → Slack → Any Cursor Agent
```

---

## 📋 Dashboard Integration

### **Dashboard Webhook Endpoints:**

#### **1. Start New Workflow**
```bash
POST https://thepeakbeyond.app.n8n.cloud/webhook/dashboard-seo-trigger
{
  "site_name": "brightgift",
  "blog_slug": "valentine-gift-guide",
  "topic": "valentine gifts"
}
```

#### **2. Trigger Specific Agent (Manual)**
```bash
POST https://thepeakbeyond.app.n8n.cloud/webhook/agent-router
{
  "site_name": "brightgift",
  "agent_name": "ImageAgent",
  "blog_slug": "valentine-gift-guide",
  "topic": "valentine gifts",
  "current_phase": "IMAGE"
}
```

#### **3. Publishing Approval**
```bash
POST https://thepeakbeyond.app.n8n.cloud/webhook/publishing-approval
{
  "site_name": "brightgift",
  "blog_slug": "valentine-gift-guide",
  "topic": "valentine gifts",
  "approval_status": "approved",
  "pr_number": "123"
}
```

---

## 🎯 Agent Completion Protocol

### **What Each Agent Must Do:**

1. **Complete their work**
2. **Update `workflow_state.json`** with:
   ```json
   {
     "current_phase": "NEXT_PHASE",
     "next_agent": "NextAgentName",
     "status": "in_progress",
     "blog_slug": "valentine-gift-guide",
     "topic": "valentine gifts"
   }
   ```
3. **Commit and push** to GitHub
4. **GitHub webhook** automatically triggers next agent

### **Example Agent Workflow:**
```
1. Receive Slack message
2. Review instructions from repo
3. Execute task
4. Update workflow_state.json
5. Commit to GitHub
6. GitHub webhook triggers next agent
```

---

## 🔧 Testing the Setup

### **Test 1: Dashboard SEO Trigger**
```bash
curl -X POST https://thepeakbeyond.app.n8n.cloud/webhook/dashboard-seo-trigger \
  -H "Content-Type: application/json" \
  -d '{
    "site_name": "brightgift",
    "blog_slug": "test-blog",
    "topic": "test topic"
  }'
```

### **Test 2: Manual Agent Trigger**
```bash
curl -X POST https://thepeakbeyond.app.n8n.cloud/webhook/agent-router \
  -H "Content-Type: application/json" \
  -d '{
    "site_name": "brightgift",
    "agent_name": "BlogAgent",
    "blog_slug": "test-blog",
    "topic": "test topic",
    "current_phase": "BLOG"
  }'
```

### **Test 3: Publishing Approval**
```bash
curl -X POST https://thepeakbeyond.app.n8n.cloud/webhook/publishing-approval \
  -H "Content-Type: application/json" \
  -d '{
    "site_name": "brightgift",
    "blog_slug": "test-blog",
    "topic": "test topic",
    "approval_status": "approved",
    "pr_number": "123"
  }'
```

---

## 🎯 Next Steps

1. **Import all 4 workflows** into n8n Cloud
2. **Configure credentials** (Slack bot token, GitHub OAuth2)
3. **Set environment variables**
4. **Set up GitHub webhook** on your agent repository
5. **Test each webhook endpoint**
6. **Set up Cursor Slack integration**
7. **Test complete workflow** from dashboard to agent completion

---

## 🔧 Troubleshooting

### **Webhook Not Triggering**
- Check webhook URL is correct
- Verify credentials are configured
- Check n8n Cloud logs for errors

### **Wrong Channel**
- Verify channel IDs in workflow functions
- Check site name mapping

### **GitHub Webhook Not Working**
- Ensure webhook is on agent repository (not publishing repo)
- Check GitHub webhook delivery logs
- Verify webhook secret if configured 