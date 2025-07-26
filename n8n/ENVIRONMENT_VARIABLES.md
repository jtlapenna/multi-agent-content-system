# 🔧 Environment Variables for n8n Cloud

## 📋 Complete .env Format

Copy and paste this into your n8n Cloud Environment Variables:

```bash
N8N_WEBHOOK_URL=https://thepeakbeyond.app.n8n.cloud
SLACK_BOT_TOKEN=xoxb-9241638531431-9271369014113-1eOWdVDtZUJjxhPQtNGwlFgU
SLACK_SIGNING_SECRET=996ea834c3ba631a8b6188cc9004066d
GITHUB_WEBHOOK_SECRET=n8n-agent-workflow-triggers
```

## 🎯 How to Add These in n8n Cloud

1. **Go to n8n Cloud Dashboard**
2. **Settings** → **Environment Variables**
3. **Add each variable** one by one:
   - **Key**: `N8N_WEBHOOK_URL`
   - **Value**: `https://thepeakbeyond.app.n8n.cloud`
   - **Repeat for each variable**

## ✅ Your Bot Token is Ready!

Your Slack bot token is now configured:
- **Token**: `xoxb-9241638531431-9271369014113-1eOWdVDtZUJjxhPQtNGwlFgU`
- **Status**: ✅ Active and ready to use

## 🧪 Next Steps

1. **Add these environment variables** to n8n Cloud
2. **Add Slack credential** in n8n Cloud Settings → Credentials
3. **Test the webhook** with the curl command below

## 🧪 Test Command

```bash
curl -X POST https://thepeakbeyond.app.n8n.cloud/webhook/dashboard-seo-trigger \
  -H "Content-Type: application/json" \
  -d '{
    "site_name": "brightgift",
    "blog_slug": "test-blog-123",
    "topic": "test topic"
  }'
```

**Expected Result**: You should see a message in your `#brightgift-seo-agent` channel! 