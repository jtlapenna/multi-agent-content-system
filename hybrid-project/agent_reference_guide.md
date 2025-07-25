# 🤖 Agent Reference Guide for Multi-Agent Content System

This document provides essential reference information for agents working on the multi-agent content automation system. It contains foundational architecture insights and component assessments that are relevant across all phases of development.

---

## 📚 **Foundational Documents Summary**

### 🎯 **Key Foundational Documents Reviewed:**

#### **1. `multi_agent_content_system.md`** - System Architecture
- **New System**: Multi-agent with Cursor agents for each phase
- **State Management**: Supabase-based (not file-based)
- **Orchestration**: Slack-triggered agent chaining with n8n
- **Processing**: Multi-blog concurrent with folder-based organization

#### **2. `agent_task_routing_design.md`** - Agent Workflow
- **Agent Routing**: Each agent scans for `workflow_state.json` files
- **Multi-Blog Support**: Agents can handle multiple blogs in different phases
- **Stateless Design**: Agents pick up work based on state files

#### **3. `blog_file_structure_and_state_format.md`** - File Organization
- **Folder Structure**: Each blog in `/content/blog-posts/YYYY-MM-DD-topic-slug/`
- **State Files**: `workflow_state.json` tracks current phase and next agent
- **Self-Contained**: All blog data organized in individual folders

#### **4. `supabase_schema_and_sql.md`** - Database Design
- **Real-Time Dashboard**: Supabase tracks live status for dashboard display
- **State Tracking**: `blog_workflow_state` table with current phase, next agent, etc.
- **Multi-Blog Support**: Database supports concurrent blog processing

#### **5. `Cursor_vs_n8n_Responsibilities.csv`** - Task Distribution
- **Cursor Agents**: Handle all content work (SEO, writing, review, images, publishing)
- **n8n**: Handles notifications, dashboard updates, workflow logs, scheduling

---

## 📊 **Component Assessment & Reusability**

### ✅ **Components Ready for Reuse (11 total)**
Many utilities from the existing system align perfectly with the new agent system:

- **SEO Processing** → **SEO Agent** (keyword research, topic generation)
- **GitHub Integration** → **Publishing Agent** (version control, preview branches)
- **Content Checker** → **Review Agent** (validation, optimization)
- **Image Generation** → **Image Agent** (image creation)
- **Social Media** → **Social Agent** (social posts)
- **Notification Service** → **n8n Integration** (Slack notifications)
- **Google Ads** → **SEO Agent** (enhanced keyword research)
- **Environment Templates** → **System Setup** (configuration templates)
- **Cloudflare Integration** → **Publishing Agent** (preview deployment)
- **CLI System** → **Development/Testing** (automation interface)
- **Planning Documentation** → **Implementation Guide** (comprehensive plans)

### 🔧 **Major Refactoring Required:**
- **Content Pipeline** → **Multi-agent workflow system**
- **Workflow Config** → **Supabase state management**
- **Approval System** → **Web-based dashboard**
- **Content Generation** → **Cursor agent-based creation**

---

## 🎯 **Key Architecture Insights**

### **System Transformation:**
The current system has **much more reusable value** than initially assessed. The utilities are well-designed and can be **mapped directly to specific agents** in the new system.

### **Main Changes Required:**
1. **Architecture**: Monolithic pipeline → Multi-agent system
2. **State Management**: File-based → Supabase-based
3. **Content Generation**: GPT assistants → Cursor agents
4. **Orchestration**: Manual → Slack-triggered with n8n

### **Agent Responsibilities:**
- **SEO Agent**: Keyword research, topic generation, Google Ads integration
- **Blog Agent**: Content creation using Cursor agents (not GPT assistants)
- **Review Agent**: Content validation, optimization, SEO enhancement
- **Image Agent**: Image generation and processing
- **Publishing Agent**: GitHub operations, Cloudflare deployment
- **Social Agent**: Social media post generation and scheduling

---

## 📁 **File Structure Reference**

### **New System Structure:**
```
/content/
  blog-posts/
    YYYY-MM-DD-topic-slug/
      seo-results.json
      blog-draft.md
      blog-final.md
      social-posts.md
      images/
        hero.jpg
        og.jpg
        social.jpg
      metadata.json
      workflow_state.json
      logs/
        seo-log.json
        blog-log.json
        review-log.json
        image-log.json
        publish-log.json
```

### **State Management:**
- **File-based**: `workflow_state.json` in each blog folder
- **Database**: Supabase `blog_workflow_state` table for real-time dashboard
- **Agent Routing**: Based on `current_phase` and `next_agent` fields

---

## 🔄 **Workflow Phases**

### **Agent Workflow:**
1. **SEO Agent** → Keyword research, topic selection
2. **Blog Agent** → Content generation
3. **Review Agent** → Content optimization
4. **Image Agent** → Image generation
5. **Publishing Agent** → GitHub deployment
6. **Social Agent** → Social media posts

### **n8n Responsibilities:**
- Initial agent triggering
- Dashboard state updates
- Notifications (Slack/email)
- Workflow logging
- Scheduling

---

## 💡 **Development Guidelines**

### **For Agents:**
- Always check `workflow_state.json` for current status
- Update state files after completing tasks
- Use consistent file paths and naming conventions
- Trigger next agent via Slack commands
- Log all activities for debugging

### **For System Integration:**
- Use Supabase for real-time state management
- Implement web-based dashboard for oversight
- Ensure multi-blog concurrent processing
- Maintain folder-based organization
- Enable human-in-the-loop approval when needed

---

*This guide should be referenced by all agents working on the multi-agent content system to ensure consistent understanding and implementation.* 