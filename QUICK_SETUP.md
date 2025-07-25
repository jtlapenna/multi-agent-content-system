# 🚀 Quick Supabase Setup

## 🎯 Current Status
- ❌ Supabase URLs not resolving
- ❌ Database tables don't exist
- ✅ Schema ready in clipboard
- ✅ Test scripts ready

## ⚡ Quick Steps

### 1. Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `multi-agent-content-system`
4. Set password & region
5. Wait 2-3 minutes

### 2. Get Credentials
1. Go to Settings → API
2. Copy:
   - Project URL
   - Service Role Key (starts with `eyJ...`)
   - Anon Key (starts with `eyJ...`)

### 3. Update .env
```bash
SUPABASE_URL=https://your-new-project.supabase.co
SUPABASE_ANON_KEY=your_new_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key
```

### 4. Import Schema
1. Go to SQL Editor
2. Create new query
3. Paste schema (already in clipboard)
4. Click "Run"

### 5. Test Setup
```bash
node test-supabase-setup.js
```

## ✅ Success Indicators
- ✅ Connection test passes
- ✅ Tables exist in Table Editor
- ✅ Infrastructure tests pass
- ✅ Ready for Phase 3

## 📋 Schema Contents (in clipboard)
- `blog_workflow_state` table
- Indexes & RLS policies
- Sample data
- Dashboard view

---
**Need help?** See `SUPABASE_SETUP_GUIDE.md` for detailed instructions 