# 🔧 n8n Setup Instructions for BrightGift

## 🎯 Current Status
✅ Slack workspace created  
✅ BrightGift channels set up  
⏳ n8n configuration needed  

---

## 🔧 Step 1: Get Your Slack Channel IDs

### **1.1 Get Channel IDs**
For each of your BrightGift channels, get the channel ID:

1. **Right-click each channel** in Slack
2. **Select "Copy link"**
3. **Extract the channel ID** from the URL (format: C1234567890)

### **1.2 Your BrightGift Channels**
You should have these channels:
- `#brightgift-hub` → Channel ID: `C___________`
- `#brightgift-seo-agent` → Channel ID: `C___________`
- `#brightgift-blog-agent` → Channel ID: `C___________`
- `#brightgift-review-agent` → Channel ID: `C___________`
- `#brightgift-image-agent` → Channel ID: `C___________`
- `#brightgift-publishing-agent` → Channel ID: `C___________`

---

## 🔧 Step 2: Access n8n

### **2.1 Open n8n**
1. **Open your browser** and go to: `http://localhost:5678`
2. **Create an account** or sign in
3. **Go to Workflows** section

### **2.2 Import the Multi-Site Workflow**
1. **Click "Import from file"**
2. **Select the file**: `n8n/workflows/multi-site-agent-router.json`
3. **Save the workflow**

---

## 🔧 Step 3: Update Channel IDs in Workflow

### **3.1 Edit the Workflow**
1. **Open the imported workflow**
2. **Click on the "Route to Site Agent Channel" node**
3. **Edit the Function code**

### **3.2 Update Channel Mapping**
Replace the placeholder channel IDs with your actual ones:

```javascript
const siteAgentChannels = {
  'brightgift': {
    'SEOAgent': 'C1234567890', // Replace with your #brightgift-seo-agent ID
    'BlogAgent': 'C1234567891', // Replace with your #brightgift-blog-agent ID
    'ReviewAgent': 'C1234567892', // Replace with your #brightgift-review-agent ID
    'ImageAgent': 'C1234567893', // Replace with your #brightgift-image-agent ID
    'PublishingAgent': 'C1234567894' // Replace with your #brightgift-publishing-agent ID
  }
};
```

### **3.3 Update Repository Mapping**
Also update the repository mapping:

```javascript
const repoMapping = {
  'brightgift': 'your-org/brightgift-content-system', // Replace with your actual repo
};
```

---

## 🔧 Step 4: Configure Slack Bot Token

### **4.1 Get Slack Bot Token**
1. **Go to [api.slack.com/apps](https://api.slack.com/apps)**
2. **Select your app** (or create one if needed)
3. **Go to "OAuth & Permissions"**
4. **Copy the "Bot User OAuth Token"** (starts with `xoxb-`)

### **4.2 Add Token to n8n**
1. **In n8n, go to Settings → Credentials**
2. **Click "Add Credential"**
3. **Select "Slack"**
4. **Enter your bot token**
5. **Save the credential**

---

## 🔧 Step 5: Test the Workflow

### **5.1 Test Webhook**
Send a test webhook to your n8n endpoint:

```bash
curl -X POST http://localhost:5678/webhook/multi-site-agent-router \
  -H "Content-Type: application/json" \
  -d '{
    "site_name": "brightgift",
    "agent_name": "SEOAgent",
    "blog_slug": "test-blog-slug",
    "topic": "test topic",
    "current_phase": "SEO"
  }'
```

### **5.2 Check Slack**
1. **Go to your `#brightgift-seo-agent` channel**
2. **Look for the Cursor command** that was sent
3. **Verify the command format** is correct

---

## 🔧 Step 6: Set Up Cursor Integration

### **6.1 Install Cursor Slack App**
1. **Go to [cursor.com/integrations](https://cursor.com/integrations)**
2. **Click "Connect" next to Slack**
3. **Install the Cursor app** in your Slack workspace
4. **Authorize Cursor** to access your channels

### **6.2 Configure Channel Settings**
For each BrightGift channel, set the default repository:

```
@Cursor settings
```

Set:
- **Default Repository**: `your-org/brightgift-content-system`
- **Default Model**: `o3`
- **Base Branch**: `main`

---

## 🔧 Step 7: Test Complete Workflow

### **7.1 Test SEO Agent**
Send this command in `#brightgift-seo-agent`:

```
@Cursor [repo=your-org/brightgift-content-system] review instructions from agents/seo/instructions.md and then execute the following task: run SEOAgent for test-blog-slug topic: test topic phase: SEO site: brightgift
```

### **7.2 Monitor Results**
1. **Check if Cursor responds** in the channel
2. **Verify instruction review** works
3. **Check for any errors** in the response

---

## 🔧 Step 8: Production Deployment

### **8.1 Environment Variables**
Set these environment variables in your production environment:

```bash
SLACK_BOT_TOKEN=xoxb-your-actual-slack-bot-token
SLACK_CHANNEL_BRIGHTGIFT_HUB=C1234567890
SLACK_CHANNEL_BRIGHTGIFT_SEO=C1234567891
SLACK_CHANNEL_BRIGHTGIFT_BLOG=C1234567892
SLACK_CHANNEL_BRIGHTGIFT_REVIEW=C1234567893
SLACK_CHANNEL_BRIGHTGIFT_IMAGE=C1234567894
SLACK_CHANNEL_BRIGHTGIFT_PUBLISHING=C1234567895
```

### **8.2 Deploy n8n**
1. **Deploy n8n to your production server**
2. **Update webhook URLs** to production URLs
3. **Test the complete workflow**

---

## 🎯 Next Steps After n8n Setup

1. **✅ Test the workflow** with sample data
2. **⏳ Set up your GitHub repository** with agent instructions
3. **⏳ Configure Cursor background agents** in each channel
4. **⏳ Test end-to-end workflow** from dashboard to agent completion
5. **⏳ Deploy to production**

---

## 🔧 Troubleshooting

### **Workflow Not Triggering**
1. Check webhook URL is correct
2. Verify channel IDs are correct
3. Check Slack bot token permissions

### **Cursor Not Responding**
1. Verify Cursor Slack integration is installed
2. Check channel permissions
3. Test @Cursor help in the channel

### **Wrong Repository**
1. Check @Cursor settings in each channel
2. Verify repository mapping in n8n workflow
3. Test repository access permissions 