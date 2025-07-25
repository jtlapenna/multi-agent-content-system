# 🗄️ Supabase Database Setup Guide

## 🚨 Current Issue
The Supabase URLs in the credentials are not resolving (ENOTFOUND errors). This means either:
- The projects have been deleted
- The URLs are incorrect
- There's a DNS issue

## 🔧 Solution: Set Up New Supabase Project

### Step 1: Create New Supabase Project

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in with your account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project name: `multi-agent-content-system`
   - Set database password (save this!)
   - Choose region (closest to you)
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see "Project is ready" when complete

### Step 2: Get Project Credentials

1. **Go to Project Settings**
   - In your new project dashboard
   - Click "Settings" → "API"

2. **Copy Credentials**
   - **Project URL**: Copy the "Project URL"
   - **Service Role Key**: Copy the "service_role" key (starts with `eyJ...`)
   - **Anon Key**: Copy the "anon" key (starts with `eyJ...`)

### Step 3: Update Environment Variables

1. **Edit `.env` file**
   ```bash
   # Replace these lines in your .env file:
   SUPABASE_URL=your_new_project_url
   SUPABASE_ANON_KEY=your_new_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key
   ```

2. **Example format:**
   ```bash
   SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 4: Import Database Schema

1. **Go to SQL Editor**
   - In your Supabase dashboard
   - Click "SQL Editor" in the left sidebar

2. **Create New Query**
   - Click "New query"
   - Name it "Multi-Agent System Schema"

3. **Paste Schema**
   - The schema is already copied to your clipboard
   - Paste it into the SQL editor
   - Click "Run" to execute

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see `blog_workflow_state` table
   - Check that it has the correct columns

### Step 5: Test Connection

1. **Run the test script:**
   ```bash
   node test-supabase-connection.js
   ```

2. **Expected output:**
   ```
   ✅ Supabase client created
   ❌ Query failed: relation "blog_workflow_state" does not exist
   📋 This is expected - the table doesn't exist yet
   ```

3. **After importing schema:**
   ```
   ✅ Supabase client created
   ✅ Query successful: [ { count: 1 } ]
   ```

### Step 6: Run Full Infrastructure Test

```bash
node test-phase2.js
```

**Expected result:** All tests should pass ✅

## 📋 Schema Content (Already in Clipboard)

The complete schema is copied to your clipboard and ready to paste. It includes:

- `blog_workflow_state` table
- Indexes for performance
- Row Level Security policies
- Automatic timestamp updates
- Sample data for testing
- Dashboard view

## 🔍 Troubleshooting

### If URLs Still Don't Resolve:
1. Check your internet connection
2. Try accessing Supabase dashboard in browser
3. Verify project is active (not paused)

### If Schema Import Fails:
1. Check SQL syntax in Supabase editor
2. Ensure you have proper permissions
3. Try running statements one by one

### If Tests Still Fail:
1. Verify environment variables are updated
2. Check that tables were created successfully
3. Ensure service role key has proper permissions

## 🎯 Success Criteria

✅ Supabase project created and accessible  
✅ Environment variables updated with new credentials  
✅ Database schema imported successfully  
✅ All infrastructure tests pass  
✅ Ready for Phase 3: Core Infrastructure Setup  

## 📞 Need Help?

If you encounter issues:
1. Check Supabase documentation: https://supabase.com/docs
2. Verify project status in Supabase dashboard
3. Test with a simple query in SQL Editor first

---

**Next Phase:** Once Supabase is working, we'll proceed with Phase 3: Core Infrastructure Setup 