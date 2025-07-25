# 📁 Complete Template File Map

This document provides a comprehensive map of every file and folder in the clean template, with detailed descriptions of what each component does and how it fits into the multi-agent content automation system.

---

## 🗂️ **Root Level Files**

### **Configuration Files**
- **`package.json`** - Main project dependencies and scripts
- **`.env.example`** - Environment variable template with all required API keys
- **`.gitignore`** - Git exclusions for sensitive files and build artifacts
- **`README.md`** - Main template documentation and setup guide

---

## 📁 **Agent System (`/agents/`)**

### **Agent Instructions**
Each agent has detailed instructions for their specific role in the workflow:

- **`agents/seo/instructions.md`** - SEO Agent instructions
  - Keyword research and analysis
  - Topic selection and optimization
  - Google Ads API integration
  - SEO scoring and recommendations

- **`agents/blog/instructions.md`** - Blog Agent instructions
  - Content generation using Cursor agents
  - Blog post structure and formatting
  - Content optimization guidelines
  - Integration with SEO data

- **`agents/review/instructions.md`** - Review Agent instructions
  - Content validation and optimization
  - SEO enhancement and link building
  - Quality assurance checks
  - Final content preparation

- **`agents/image/instructions.md`** - Image Agent instructions
  - Image generation and processing
  - Hero image and social media images
  - Image optimization and formatting
  - Integration with blog content

- **`agents/publishing/instructions.md`** - Publishing Agent instructions
  - GitHub branch management
  - Cloudflare Pages deployment
  - Preview URL generation
  - Production deployment

- **`agents/social/instructions.md`** - Social Agent instructions
  - Social media post generation
  - Platform-specific formatting
  - Hashtag optimization
  - Scheduling and publishing

---

## 🖥️ **CLI System (`/cli/`)**

### **Main CLI Entry Point**
- **`cli/index.js`** - Main CLI application with command routing

### **CLI Commands (`/cli/commands/`)**
- **`cli/commands/automate.js`** - Main automation command
- **`cli/commands/generate.js`** - Content generation command
- **`cli/commands/keywordResearch.js`** - Keyword research command
- **`cli/commands/seo.js`** - SEO processing command
- **`cli/commands/social.js`** - Social media command
- **`cli/commands/github.js`** - GitHub operations command
- **`cli/commands/preview.js`** - Preview deployment command
- **`cli/commands/analytics.js`** - Analytics and reporting command
- **`cli/commands/config.js`** - Configuration management command
- **`cli/commands/keywordBank.js`** - Keyword bank management command
- **`cli/commands/blogHybrid.js`** - Blog generation command
- **`cli/commands/cursorWorkflow.js`** - Cursor workflow command

### **CLI Utilities (`/cli/utils/`)**
- **`cli/utils/config.js`** - Configuration utilities for CLI

---

## 🛠️ **Utility Files (`/utils/`)**

### **Core Utility Modules**
- **`utils/enhancedSEOProcessor.js`** - Advanced SEO processing with multi-source data
- **`utils/cloudflareAPI.js`** - Cloudflare Pages deployment and management
- **`utils/githubAPI.js`** - GitHub operations (branches, PRs, commits)
- **`utils/googleAdsAPI.js`** - Google Ads keyword research and insights
- **`utils/contentChecker.js`** - Content validation and optimization
- **`utils/notificationService.js`** - Email and Slack notifications
- **`utils/keywordBank.js`** - Keyword management and storage
- **`utils/images.js`** - Image generation and processing

---

## 🗄️ **Database & State Management**

### **Supabase Schema (`/supabase/`)**
- **`supabase/schema.sql`** - Complete database schema with:
  - `blog_workflow_state` table
  - Row Level Security (RLS) policies
  - Automatic timestamp triggers
  - Sample data for testing

### **Workflow State Templates (`/data/workflow_templates/`)**
- **`data/workflow_templates/workflow_state.json`** - Template for tracking blog post progress

---

## 🔄 **Workflow Orchestration (`/n8n/`)**

### **n8n Workflows (`/n8n/exported_flows/`)**
- **`n8n/exported_flows/n8n_trigger_seo_agent.json`** - Slack-triggered SEO agent workflow

---

## 🌐 **Web Dashboard (`/approval-hub/`)**

### **Frontend Components (`/approval-hub/frontend/`)**
- **`approval-hub/frontend/src/App.jsx`** - Main React application
- **`approval-hub/frontend/src/App.css`** - Main application styles
- **`approval-hub/frontend/src/components/PostList.jsx`** - Blog post listing component
- **`approval-hub/frontend/src/components/PostList.css`** - Post list styles
- **`approval-hub/frontend/src/components/PostDetail.jsx`** - Blog post detail component
- **`approval-hub/frontend/src/components/PostDetail.css`** - Post detail styles

### **Backend API (`/approval-hub/functions/api/`)**
- **`approval-hub/functions/api/health.js`** - Health check endpoint
- **`approval-hub/functions/api/posts.js`** - Posts listing endpoint
- **`approval-hub/functions/api/posts/[id].js`** - Individual post endpoint
- **`approval-hub/functions/api/posts/[id]/approve.js`** - Post approval endpoint
- **`approval-hub/functions/api/posts/[id]/reject.js`** - Post rejection endpoint

### **Backend Server (`/approval-hub/backend/`)**
- **`approval-hub/backend/src/index.js`** - Main backend server
- **`approval-hub/backend/src/routes/approvals.js`** - Approval routes
- **`approval-hub/backend/src/routes/posts.js`** - Post management routes
- **`approval-hub/backend/src/utils/fileHelpers.js`** - File utility functions
- **`approval-hub/backend/test-server.js`** - Test server for development

### **Configuration Files**
- **`approval-hub/package.json`** - Approval hub dependencies
- **`approval-hub/wrangler.toml`** - Cloudflare Pages configuration
- **`approval-hub/README.md`** - Approval hub documentation
- **`approval-hub/DEPLOYMENT.md`** - Deployment instructions
- **`approval-hub/dev-server.js`** - Development server

---

## 📝 **Content Structure (`/content/`)**

### **Blog Posts Directory**
- **`content/blog-posts/.gitkeep`** - Ensures directory is tracked in git
- **`content/blog-posts/`** - Directory for individual blog post folders
  - Each blog post will be in: `YYYY-MM-DD-topic-slug/`
  - Contains: blog content, images, metadata, workflow state

---

## 🔧 **GitHub Integration (`/.github/`)**

### **GitHub Workflows**
- **`.github/workflows/`** - GitHub Actions workflows (if any)

---

## 📊 **File Count Summary**

### **Total Files by Category:**
- **Agent Instructions**: 6 files
- **CLI System**: 14 files (1 main + 12 commands + 1 utility)
- **Utility Modules**: 8 files
- **Database**: 1 schema file
- **Workflow State**: 1 template file
- **n8n Workflows**: 1 workflow file
- **Approval Hub**: 15 files (frontend + backend + config)
- **Content**: 1 directory structure
- **Configuration**: 4 files (package.json, .env.example, .gitignore, README.md)

### **Total Files**: ~50 files

---

## 🎯 **Key Integration Points**

### **Agent → Utility Integration**
- SEO Agent uses: `enhancedSEOProcessor.js`, `googleAdsAPI.js`, `keywordBank.js`
- Blog Agent uses: `contentChecker.js`
- Image Agent uses: `images.js`
- Publishing Agent uses: `githubAPI.js`, `cloudflareAPI.js`
- Social Agent uses: `notificationService.js`

### **CLI → Agent Integration**
- CLI commands can trigger individual agents
- CLI provides development and testing interface
- CLI handles configuration and setup

### **Dashboard → Database Integration**
- Approval hub reads from Supabase
- Real-time updates via Supabase subscriptions
- State management through database

### **n8n → Agent Integration**
- n8n triggers agents via Slack commands
- n8n manages workflow orchestration
- n8n handles notifications and state updates

---

## 🚀 **Quick Reference**

### **For Development:**
- Start with `package.json` for dependencies
- Configure `.env.example` with your API keys
- Use CLI commands for testing: `npm start`

### **For Agents:**
- Read agent instructions in `/agents/`
- Use utility files in `/utils/`
- Follow workflow state format in `/data/`

### **For Dashboard:**
- Set up approval hub in `/approval-hub/`
- Configure Supabase with `/supabase/schema.sql`
- Deploy to Cloudflare Pages

### **For Workflows:**
- Import n8n workflows from `/n8n/exported_flows/`
- Configure Slack integration
- Set up webhook endpoints

---

**Template Version**: 1.0.0  
**Total Files**: ~50  
**Last Updated**: 2025-01-XX  
**Compatible With**: Multi-Agent Content System v1.0 