# 🔧 n8n Workflow Configuration Guide

## 🎯 Overview
You have 4 workflows imported. Now you need to configure each one to use your Slack credentials and set up the webhooks properly.

---

## 🔧 Step 1: Configure Dashboard SEO Trigger

### **1.1 Open the Workflow**
- **Workflow Name**: `dashboard-seo-trigger`
- **Purpose**: Initial trigger from dashboard

### **1.2 Configure Webhook Node**
1. **Click on the "Webhook" node**
2. **Copy the webhook URL**: `https://thepeakbeyond.app.n8n.cloud/webhook/dashboard-seo-trigger`
3. **Save the workflow**

### **1.3 Configure Slack Node**
1. **Click on the "Send to #brightgift-seo-agent" node**
2. **In "Authentication" field**: Select your "BrightGift Slack Bot" credential
3. **Channel**: Should be `C097J4EGEN9` (already configured)
4. **Save the workflow**

### **1.4 Activate the Workflow**
- **Click "Activate"** in the top right
- **Status should show "Active"**

---

## 🔧 Step 2: Configure Agent-to-Agent Router

### **2.1 Open the Workflow**
- **Workflow Name**: `agent-to-agent-router`
- **Purpose**: Routes between agents

### **2.2 Configure Webhook Node**
1. **Click on the "Webhook" node**
2. **Copy the webhook URL**: `https://thepeakbeyond.app.n8n.cloud/webhook/agent-router`
3. **Save the workflow**

### **2.3 Configure Slack Node**
1. **Click on the "Send to [Channel]" node**
2. **In "Authentication" field**: Select your "BrightGift Slack Bot" credential
3. **Save the workflow**

### **2.4 Activate the Workflow**
- **Click "Activate"** in the top right

---

## 🔧 Step 3: Configure Publishing Approval Handler

### **3.1 Open the Workflow**
- **Workflow Name**: `publishing-approval-handler`
- **Purpose**: Triggers after human approval

### **3.2 Configure Webhook Node**
1. **Click on the "Webhook" node**
2. **Copy the webhook URL**: `https://thepeakbeyond.app.n8n.cloud/webhook/publishing-approval`
3. **Save the workflow**

### **3.3 Configure Slack Node**
1. **Click on the "Send to #brightgift-publishing-agent" node**
2. **In "Authentication" field**: Select your "BrightGift Slack Bot" credential
3. **Channel**: Should be `C097J4WA0LD` (already configured)
4. **Save the workflow**

### **3.4 Activate the Workflow**
- **Click "Activate"** in the top right

---

## 🔧 Step 4: Configure GitHub Webhook Listener

### **4.1 Open the Workflow**
- **Workflow Name**: `github-webhook-listener`
- **Purpose**: Listens for GitHub push events

### **4.2 Configure Webhook Node**
1. **Click on the "Webhook" node**
2. **Copy the webhook URL**: `https://thepeakbeyond.app.n8n.cloud/webhook/github-webhook`
3. **Save the workflow**

### **4.3 Configure HTTP Request Node**
1. **Click on the "Trigger Next Agent" node**
2. **URL should be**: `https://thepeakbeyond.app.n8n.cloud/webhook/agent-router`
3. **Method**: `POST`
4. **Save the workflow**

### **4.4 Activate the Workflow**
- **Click "Activate"** in the top right

---

## 🔧 Step 5: Set Up GitHub Webhook

### **5.1 Go to Your GitHub Repository**
- **Repository**: Your agent repository (not the publishing one)
- **Settings** → **Webhooks**

### **5.2 Add Webhook**
1. **Click "Add webhook"**
2. **Payload URL**: `https://thepeakbeyond.app.n8n.cloud/webhook/github-webhook`
3. **Content type**: `application/json`
4. **Secret**: `n8n-agent-workflow-triggers`
5. **Events**: Select "Just the push event"
6. **Click "Add webhook"**

---

## 🔧 Step 6: Test All Workflows

### **6.1 Test Dashboard SEO Trigger**
```bash
curl -X POST https://thepeakbeyond.app.n8n.cloud/webhook/dashboard-seo-trigger \
  -H "Content-Type: application/json" \
  -d '{
    "site_name": "brightgift",
    "blog_slug": "test-blog-123",
    "topic": "test topic"
  }'
```

### **6.2 Test Agent-to-Agent Router**
```bash
curl -X POST https://thepeakbeyond.app.n8n.cloud/webhook/agent-router \
  -H "Content-Type: application/json" \
  -d '{
    "site_name": "brightgift",
    "agent_name": "BlogAgent",
    "blog_slug": "test-blog-123",
    "topic": "test topic",
    "current_phase": "BLOG"
  }'
```

### **6.3 Test Publishing Approval Handler**
```bash
curl -X POST https://thepeakbeyond.app.n8n.cloud/webhook/publishing-approval \
  -H "Content-Type: application/json" \
  -d '{
    "site_name": "brightgift",
    "blog_slug": "test-blog-123",
    "topic": "test topic",
    "approval_status": "approved",
    "pr_number": "123"
  }'
```

---

## ✅ Success Checklist

- [ ] All 4 workflows imported
- [ ] All workflows have Slack credentials configured
- [ ] All workflows are activated
- [ ] All webhook URLs copied
- [ ] GitHub webhook configured on agent repository
- [ ] All test commands work
- [ ] Messages appear in correct Slack channels

---

## 🎯 Expected Results

After testing, you should see:
1. **Dashboard trigger** → Message in `#brightgift-seo-agent`
2. **Agent router** → Message in appropriate agent channel
3. **Publishing approval** → Message in `#brightgift-publishing-agent`
4. **GitHub webhook** → Triggers agent router when `workflow_state.json` changes

Let me know when you've completed each step! 