# 🧼 Clean Multi-Agent Content Automation Template

This is a clean, reusable template for the Multi-Agent Content Automation system. It provides a complete foundation for implementing automated blog content generation with Cursor agents, Supabase, n8n, and Cloudflare Pages.

## 🎯 What's Included

### 🤖 Agent System
- **6 Agent Instructions**: Complete instructions for SEO, Blog, Review, Image, Publishing, and Social agents
- **Workflow State Management**: Template for tracking agent progress
- **Agent Routing**: System for agent handoffs and state management

### 🗄️ Database & State Management
- **Supabase Schema**: Complete database schema with RLS and triggers
- **Workflow State**: JSON template for tracking blog post progress
- **Real-time Updates**: Dashboard-ready database structure

### 🔧 Infrastructure
- **Environment Configuration**: Complete `.env.template` with all required variables
- **n8n Workflows**: Slack-triggered agent workflow
- **GitHub Integration**: Ready for version control and deployment

### 📁 File Structure
```
template/
├── agents/
│   ├── seo/instructions.md
│   ├── blog/instructions.md
│   ├── review/instructions.md
│   ├── image/instructions.md
│   ├── publishing/instructions.md
│   └── social/instructions.md
├── cli/
│   ├── index.js
│   ├── commands/
│   └── utils/
├── content/
│   └── blog-posts/
├── data/
│   └── workflow_templates/
│       └── workflow_state.json
├── n8n/
│   └── exported_flows/
│       └── n8n_trigger_seo_agent.json
├── supabase/
│   └── schema.sql
├── utils/
│   ├── enhancedSEOProcessor.js
│   ├── cloudflareAPI.js
│   ├── githubAPI.js
│   ├── googleAdsAPI.js
│   ├── contentChecker.js
│   ├── notificationService.js
│   ├── keywordBank.js
│   └── images.js
├── approval-hub/
│   ├── functions/
│   │   └── api/
│   ├── frontend/
│   │   └── src/
│   │       └── components/
│   ├── package.json
│   └── README.md
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
nano .env
```

### 2. Database Setup
```bash
# Import schema to Supabase
# Copy and paste the contents of supabase/schema.sql into your Supabase SQL editor
```

### 3. Agent Configuration
```bash
# Each agent has detailed instructions in agents/<agent-name>/instructions.md
# Review and customize as needed for your specific use case
# All utility files are included in utils/ directory
```

### 4. n8n Setup
```bash
# Import the n8n workflow from n8n/exported_flows/
# Configure Slack integration and webhook endpoints
```

### 5. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Test the CLI system
npm start
```

### 6. Setup Approval Hub
```bash
# Navigate to approval hub
cd approval-hub

# Install frontend dependencies
cd frontend && npm install

# Start development server
npm run dev

# Deploy to Cloudflare Pages
npm run deploy
```

## 🔧 Configuration Requirements

### Required Services
- **OpenAI API**: For content generation
- **Google Ads API**: For enhanced keyword research
- **GitHub**: For version control and deployment
- **Cloudflare Pages**: For preview deployment and approval hub
- **Supabase**: For state management and dashboard
- **Slack**: For agent triggering and notifications
- **n8n**: For workflow orchestration

### Optional Services
- **SERP API**: For additional search data
- **Social Media APIs**: For automated social posting
- **SMTP**: For email notifications

## 📋 Agent Workflow

1. **SEO Agent** → Keyword research and topic selection
2. **Blog Agent** → Content generation using Cursor agents
3. **Review Agent** → Content optimization and validation
4. **Image Agent** → Image generation and processing
5. **Publishing Agent** → GitHub deployment and preview
6. **Social Agent** → Social media post generation

## 🎯 Key Features

- **Multi-Agent System**: Specialized agents for each workflow phase
- **Real-time State Management**: Supabase-based state tracking
- **Slack Integration**: Agent triggering and notifications
- **Preview Deployment**: Cloudflare Pages integration
- **Version Control**: GitHub-based content management
- **Web-based Approval Hub**: React dashboard for content review
- **Dashboard Ready**: Real-time status updates

## 📝 Customization

### Agent Instructions
Each agent's instructions can be customized for:
- Specific content types
- Brand guidelines
- Target audience
- SEO requirements

### Workflow State
The workflow state template can be extended with:
- Additional metadata fields
- Custom agent outputs
- Extended timestamps
- Error tracking

### Database Schema
The Supabase schema can be enhanced with:
- Additional tables for analytics
- User management
- Content scheduling
- Performance tracking

## 🔒 Security Notes

- All API keys should be stored in environment variables
- Supabase RLS is enabled by default
- GitHub tokens should have minimal required permissions
- Cloudflare API tokens should be scoped appropriately

## 📚 Documentation

- **Complete File Map**: `TEMPLATE_FILE_MAP.md` - Comprehensive map of every file and folder
- **Agent Reference Guide**: `../agent_reference_guide.md`
- **System Architecture**: `../multi_agent_content_system.md`
- **Implementation Plan**: `../comprehensive_implementation_plan.md`

## 🆘 Support

For implementation help, refer to:
- Agent instructions in each agent folder
- Database schema documentation
- n8n workflow configuration
- Environment variable setup guide

---

**Template Version**: 1.0.0  
**Last Updated**: 2025-01-XX  
**Compatible With**: Multi-Agent Content System v1.0 