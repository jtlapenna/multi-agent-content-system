# 🔐 Credential Recovery Guide

**Emergency Response to API Key Exposure**

This guide will help you replace all the credentials that were exposed in the `.env.backup` file and subsequently disabled by security systems.

---

## 🚨 **What Happened**
- `.env.backup` file was accidentally committed to Git
- GitGuardian detected the exposure and alerted all platforms
- All API keys/tokens were automatically disabled for security
- You need to regenerate new credentials for all platforms

---

## 📋 **Credentials to Replace**

### 1. **OpenAI API Key**
**Status:** ❌ Disabled  
**Impact:** All AI agents (SEO, Blog, Review, Image, Publishing, Social)

#### **How to Get New Key:**
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Give it a name like "Multi-Agent Content System"
4. Copy the new key (starts with `sk-proj-`)

#### **Where to Update:**
- **File:** `.env`
- **Variable:** `OPENAI_API_KEY`

---

### 2. **Slack Bot Token**
**Status:** ❌ Disabled  
**Impact:** n8n workflows, Cursor agent triggering

#### **How to Get New Token:**
1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Find your "Bright Gift Agents APP" (or create new one)
3. Click **"OAuth & Permissions"** in left sidebar
4. Click **"Reinstall App"** button
5. Copy the new **"Bot User OAuth Token"** (starts with `xoxb-`)

#### **Where to Update:**
- **File:** `.env`
- **Variable:** `SLACK_BOT_TOKEN`
- **n8n:** Update Slack credential in n8n Cloud

---

### 3. **GitHub Personal Access Token**
**Status:** ❌ Disabled  
**Impact:** GitHub API calls, webhook authentication

#### **How to Get New Token:**
1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a name like "Multi-Agent Content System"
4. Select scopes: `repo`, `workflow`, `admin:org`
5. Click **"Generate token"**
6. Copy the new token

#### **Where to Update:**
- **File:** `.env`
- **Variable:** `GITHUB_TOKEN`
- **n8n:** Update GitHub credential in n8n Cloud

---

### 4. **Supabase Service Role Key**
**Status:** ❌ Disabled  
**Impact:** Database operations, real-time sync

#### **How to Get New Key:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **"Settings"** → **"API"**
4. Scroll to **"Project API keys"**
5. Click **"Regenerate"** next to **"service_role"** key
6. Copy the new key

#### **Where to Update:**
- **File:** `.env`
- **Variable:** `SUPABASE_SERVICE_ROLE_KEY`
- **n8n:** Update Supabase credential in n8n Cloud

---

### 5. **Supabase URL**
**Status:** ✅ Still valid  
**Impact:** Database connection

#### **How to Get:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **"Settings"** → **"API"**
4. Copy the **"Project URL"**

#### **Where to Update:**
- **File:** `.env`
- **Variable:** `SUPABASE_URL`

---

### 6. **Google OAuth2 Keys** (if used)
**Status:** ❌ Disabled  
**Impact:** Google Ads API, Google services

#### **How to Get New Keys:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **"APIs & Services"** → **"Credentials"**
4. Find your OAuth 2.0 Client ID
5. Click **"Regenerate"** or create new one
6. Download the new JSON file

#### **Where to Update:**
- **File:** `.env`
- **Variables:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

---

### 7. **SMTP Credentials** (if used)
**Status:** ❌ Disabled  
**Impact:** Email notifications

#### **How to Get New Credentials:**
1. Go to your email provider (Gmail, SendGrid, etc.)
2. Generate new app password or API key
3. Update SMTP settings

#### **Where to Update:**
- **File:** `.env`
- **Variables:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

---

## 🔧 **Update Process**

### **Step 1: Update .env File**
```bash
# Edit your .env file
nano .env

# Replace all the old keys with new ones
OPENAI_API_KEY=sk-proj-your-new-key-here
SLACK_BOT_TOKEN=xoxb-your-new-token-here
GITHUB_TOKEN=ghp-your-new-token-here
SUPABASE_SERVICE_ROLE_KEY=your-new-supabase-key-here
SUPABASE_URL=https://your-project.supabase.co
```

### **Step 2: Update n8n Credentials**
1. Go to [n8n Cloud](https://cloud.n8n.io/)
2. Go to **"Settings"** → **"Credentials"**
3. Update each credential with new keys:
   - **Slack** credential
   - **GitHub** credential  
   - **Supabase** credential

### **Step 3: Test Each Integration**
```bash
# Test OpenAI
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models

# Test Supabase
curl -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_URL/rest/v1/"

# Test GitHub
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

---

## ✅ **Verification Checklist**

- [ ] OpenAI API key regenerated and working
- [ ] Slack bot token regenerated and working
- [ ] GitHub PAT regenerated and working
- [ ] Supabase service role key regenerated and working
- [ ] All credentials updated in `.env` file
- [ ] All credentials updated in n8n Cloud
- [ ] All integrations tested and working
- [ ] n8n workflows tested with new credentials

---

## 🚀 **After Recovery**

Once all credentials are replaced:

1. **Test n8n workflows** with new credentials
2. **Test Cursor agent triggering** via Slack
3. **Test complete workflow** end-to-end
4. **Continue with dashboard development**

---

## 📞 **Support**

If you encounter issues with any platform:
- **OpenAI:** [OpenAI Help](https://help.openai.com/)
- **Slack:** [Slack API Support](https://api.slack.com/support)
- **GitHub:** [GitHub Support](https://support.github.com/)
- **Supabase:** [Supabase Support](https://supabase.com/support)

---

**Remember:** This is a common development issue. The security systems protected you, and you'll be back up and running quickly with new credentials! 