# 🔧 Credentials Configuration & Testing Guide

## 🔑 Step 1: Configure Slack Bot Token

### **1.1 Get Your Slack Bot Token**
1. **Go to [api.slack.com/apps](https://api.slack.com/apps)**
2. **Select your app** (or create one if needed)
3. **Go to "OAuth & Permissions"**
4. **Copy the "Bot User OAuth Token"** (starts with `xoxb-`)

### **1.2 Add to n8n Cloud**
1. **In n8n Cloud, go to Settings → Credentials**
2. **Click "Add Credential"**
3. **Select "Slack"**
4. **Enter your bot token** (the `xoxb-` token)
5. **Save the credential**

### **1.3 Update All Workflows**
For each of the 4 workflows, update the Slack node to use your credential:
1. **Open each workflow**
2. **Click on the "Send to [Channel]" node**
3. **In the "Authentication" field, select your Slack credential**
4. **Save the workflow**

---

## 🔑 Step 2: Configure GitHub OAuth2

### **2.1 Create GitHub OAuth App**
1. **Go to [github.com/settings/developers](https://github.com/settings/developers)**
2. **Click "New OAuth App"**
3. **Fill in the details:**
   - **Application name**: `n8n-agent-workflow`
   - **Homepage URL**: `https://thepeakbeyond.app.n8n.cloud`
   - **Authorization callback URL**: `https://thepeakbeyond.app.n8n.cloud`
4. **Click "Register application"**
5. **Copy the Client ID and Client Secret**

### **2.2 Add to n8n Cloud**
1. **In n8n Cloud, go to Settings → Credentials**
2. **Click "Add Credential"**
3. **Select "GitHub OAuth2 API"**
4. **Enter your Client ID and Client Secret**
5. **Save the credential**

### **2.3 Update GitHub Webhook Listener**
1. **Open the "GitHub Webhook Listener" workflow**
2. **Click on the "Fetch Workflow State" node**
3. **In the "Authentication" field, select your GitHub credential**
4. **Save the workflow**

---

## 🔧 Step 3: Set Environment Variables

### **3.1 In n8n Cloud**
1. **Go to Settings → Environment Variables**
2. **Add these variables:**
   ```
   N8N_WEBHOOK_URL=https://thepeakbeyond.app.n8n.cloud
   SLACK_BOT_TOKEN=xoxb-your-actual-slack-bot-token
   GITHUB_WEBHOOK_SECRET=n8n-agent-workflow-triggers
   ```

---

## 🧪 Step 4: Test Your Webhooks

### **4.1 Test Dashboard SEO Trigger**
```bash
curl -X POST https://thepeakbeyond.app.n8n.cloud/webhook/dashboard-seo-trigger \
  -H "Content-Type: application/json" \
  -d '{
    "site_name": "brightgift",
    "blog_slug": "test-blog-123",
    "topic": "test topic"
  }'
```

**Expected Result:**
- ✅ n8n workflow executes successfully
- ✅ Slack message appears in `#brightgift-seo-agent`
- ✅ Message contains: `@Cursor [repo=your-org/brightgift-content-system] review instructions...`

### **4.2 Test Agent Router (Manual Trigger)**
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

**Expected Result:**
- ✅ n8n workflow executes successfully
- ✅ Slack message appears in `#brightgift-blog-agent`
- ✅ Message contains the Cursor command

### **4.3 Test Publishing Approval**
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

**Expected Result:**
- ✅ n8n workflow executes successfully
- ✅ Slack message appears in `#brightgift-publishing-agent`
- ✅ Message includes approval context

### **4.4 Test GitHub Webhook**
1. **Make a commit to your agent repository** that includes `workflow_state.json`
2. **Check n8n Cloud execution logs** for the GitHub webhook listener
3. **Verify the workflow processes the commit**

---

## 🔍 Step 5: Troubleshooting

### **Webhook Not Triggering**
1. **Check n8n Cloud execution logs**
2. **Verify webhook URL is correct**
3. **Check credentials are properly configured**
4. **Verify Slack bot has permissions to post in channels**

### **Slack Messages Not Appearing**
1. **Check Slack bot token is valid**
2. **Verify bot is added to all BrightGift channels**
3. **Check channel IDs are correct**
4. **Test bot permissions in Slack**

### **GitHub Webhook Not Working**
1. **Check GitHub webhook delivery logs**
2. **Verify webhook secret matches**
3. **Ensure webhook is on the correct repository**
4. **Check GitHub OAuth2 credentials**

---

## 🎯 Step 6: Verify Cursor Integration

### **6.1 Test Cursor in Each Channel**
In each BrightGift channel, test:
```
@Cursor help
```

**Expected Result:**
- ✅ Cursor responds with help information
- ✅ Cursor is properly integrated

### **6.2 Test Cursor with Repository**
In any channel, test:
```
@Cursor [repo=your-org/brightgift-content-system] help
```

**Expected Result:**
- ✅ Cursor responds with repository-specific help
- ✅ Repository access is working

---

## 🚀 Step 7: Full Workflow Test

### **7.1 Complete End-to-End Test**
1. **Trigger SEO agent** via dashboard webhook
2. **Verify Cursor responds** in SEO channel
3. **Simulate agent completion** by committing to GitHub
4. **Verify next agent is triggered** automatically
5. **Test approval workflow** for publishing agent

### **7.2 Monitor Execution**
- **Check n8n Cloud execution logs** for each step
- **Verify Slack messages** in each channel
- **Confirm Cursor responses** are appropriate
- **Test error handling** by sending invalid payloads

---

## 📋 Success Checklist

- [ ] Slack bot token configured in n8n Cloud
- [ ] GitHub OAuth2 credentials configured
- [ ] Environment variables set
- [ ] All 4 workflows imported and configured
- [ ] Dashboard SEO trigger webhook tested
- [ ] Agent router webhook tested
- [ ] Publishing approval webhook tested
- [ ] GitHub webhook tested
- [ ] Cursor integration verified in all channels
- [ ] Full end-to-end workflow tested 