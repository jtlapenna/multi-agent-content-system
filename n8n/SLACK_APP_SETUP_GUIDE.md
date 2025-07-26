# 🔧 Complete Slack App Setup Guide

## 🎯 Current Status
Your Slack app exists but needs to be configured and installed to generate the Bot Token.

---

## 🔧 Step 1: Install App to Workspace

### **1.1 Initial Installation**
1. **Go to [api.slack.com/apps](https://api.slack.com/apps)**
2. **Click on your app** (App ID: `A09741UDUJK`)
3. **Go to "OAuth & Permissions"** in the sidebar
4. **Click "Install to TPB Affiliate Hub"** button
5. **Authorize the app** when prompted

### **1.2 What Happens After Installation**
- ✅ App will be installed to your workspace
- ✅ Bot Token will appear in "OAuth Tokens" section
- ✅ You'll see a token starting with `xoxb-`

---

## 🔧 Step 2: Add Required Scopes

### **2.1 Bot Token Scopes Needed**
Your bot needs these permissions to send messages to channels:

1. **Click "Add an OAuth Scope"** under "Bot Token Scopes"
2. **Add these scopes one by one:**

| Scope | Purpose |
|-------|---------|
| `chat:write` | Send messages to channels |
| `chat:write.public` | Send messages to public channels |
| `channels:read` | Read channel information |
| `groups:read` | Read private channel information |

### **2.2 How to Add Scopes**
1. **Click "Add an OAuth Scope"**
2. **Search for each scope** in the dropdown
3. **Select the scope** and click "Add"
4. **Repeat for all 4 scopes**

---

## 🔧 Step 3: Reinstall After Adding Scopes

### **3.1 Why Reinstall?**
- Adding scopes requires reinstallation
- This generates a new Bot Token with the new permissions

### **3.2 Reinstall Process**
1. **After adding all scopes**, click **"Install to TPB Affiliate Hub"** again
2. **Authorize the app** again
3. **The Bot Token will now have all required permissions**

---

## 🔧 Step 4: Get Your Bot Token

### **4.1 After Reinstallation**
You should see in the "OAuth Tokens" section:
- **Bot User OAuth Token**: `xoxb-...` (this is what you need)
- **User OAuth Token**: (not needed for our workflow)

### **4.2 Copy the Bot Token**
- **Copy the entire Bot User OAuth Token**
- **It starts with `xoxb-`**
- **This is what you'll use in n8n Cloud**

---

## 🔧 Step 5: Configure n8n Cloud

### **5.1 Add Environment Variables**
In n8n Cloud Settings → Environment Variables:
```bash
N8N_WEBHOOK_URL=https://thepeakbeyond.app.n8n.cloud
SLACK_BOT_TOKEN=xoxb-your-actual-bot-token-here
GITHUB_WEBHOOK_SECRET=n8n-agent-workflow-triggers
```

### **5.2 Add Slack Credential**
1. **In n8n Cloud**: Settings → Credentials
2. **Add Credential** → Search for "Slack"
3. **Enter your Bot User OAuth Token** (the `xoxb-` one)
4. **Save as "BrightGift Slack Bot"**

### **5.3 Update All Workflows**
For each of the 4 workflows:
1. **Open the workflow**
2. **Click on the "Send to [Channel]" node**
3. **In "Authentication" field, select your Slack credential**
4. **Save the workflow**

---

## 🔧 Step 6: Test the Setup

### **6.1 Test Bot Permissions**
1. **Go to your `#brightgift-seo-agent` channel**
2. **Type**: `@YourBotName test`
3. **Bot should respond** (if it's configured to respond)

### **6.2 Test n8n Webhook**
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
- ✅ Message contains `@Cursor` command

---

## 🔧 Step 7: Troubleshooting

### **Bot Token Not Appearing**
- **Make sure app is installed** to workspace
- **Check that scopes were added** before installation
- **Try reinstalling** the app

### **Bot Can't Send Messages**
- **Verify all scopes are added**: `chat:write`, `chat:write.public`
- **Check bot is added** to all BrightGift channels
- **Verify channel IDs** are correct

### **n8n Workflow Fails**
- **Check Bot Token** is correct in n8n Cloud
- **Verify credential** is selected in workflow nodes
- **Check n8n Cloud execution logs** for errors

---

## 📋 Success Checklist

- [ ] App installed to workspace
- [ ] All required scopes added
- [ ] App reinstalled after adding scopes
- [ ] Bot Token copied (starts with `xoxb-`)
- [ ] Environment variables set in n8n Cloud
- [ ] Slack credential added to n8n Cloud
- [ ] All workflows updated with credential
- [ ] Bot can send messages to channels
- [ ] n8n webhook test successful

---

## 🎯 Next Steps After Setup

1. **Test all 4 webhooks** with curl commands
2. **Verify Cursor integration** in each channel
3. **Set up GitHub webhook** on your agent repository
4. **Test complete end-to-end workflow**

Let me know when you've completed each step and I'll help you test! 