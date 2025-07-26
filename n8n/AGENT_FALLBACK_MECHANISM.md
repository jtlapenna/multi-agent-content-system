# 🔄 Agent Fallback Mechanism

## 🎯 Overview
We've optimized the workflow to use efficient agent calls without instruction review for better performance and cost efficiency. However, we have fallback mechanisms for when instruction review is needed.

---

## ⚡ Efficient Commands (Default)

### **Standard Agent Calls**
```
@Cursor [repo=your-org/brightgift-content-system] run SEOAgent for blog-123 topic: test topic phase: SEO site: brightgift
```

### **Benefits**
- ✅ **Faster execution** (10-30 seconds saved per agent)
- ✅ **Lower token costs** (no instruction review overhead)
- ✅ **Better performance** (streamlined workflow)
- ✅ **Reduced latency** (immediate agent response)

---

## 🔧 Fallback Commands (When Needed)

### **When to Use Fallback**
- **Agent behavior issues** (agent not following instructions correctly)
- **Instruction updates** (after modifying agent instructions)
- **Debugging sessions** (troubleshooting agent problems)
- **Manual testing** (verifying instruction changes)

### **Fallback Command Format**
```
@Cursor [repo=your-org/brightgift-content-system] review instructions from agents/seo/instructions.md and then execute the following task: run SEOAgent for blog-123 topic: test topic phase: SEO site: brightgift
```

---

## 🛠️ How to Use Fallbacks

### **Option 1: Manual Slack Commands**
If an agent isn't working correctly, manually send the fallback command in the agent's channel:

**SEO Agent Channel** (`#brightgift-seo-agent`):
```
@Cursor [repo=your-org/brightgift-content-system] review instructions from agents/seo/instructions.md and then execute the following task: run SEOAgent for blog-123 topic: test topic phase: SEO site: brightgift
```

**Blog Agent Channel** (`#brightgift-blog-agent`):
```
@Cursor [repo=your-org/brightgift-content-system] review instructions from agents/blog/instructions.md and then execute the following task: run BlogAgent for blog-123 topic: test topic phase: BLOG site: brightgift
```

**Publishing Agent Channel** (`#brightgift-publishing-agent`):
```
@Cursor [repo=your-org/brightgift-content-system] review instructions from agents/publishing/instructions.md and then execute the following task: run PublishingAgent for blog-123 topic: test topic phase: PUBLISHING site: brightgift
```

### **Option 2: Update n8n Workflows**
If you need to temporarily switch back to instruction review, update the Function nodes in n8n workflows:

**Replace this line:**
```javascript
item.slack_text = `@Cursor [repo=${repo}] run ${item.agent_name} for ${item.blog_slug} topic: ${item.topic} phase: ${item.current_phase} site: ${item.site_name}`;
```

**With this line:**
```javascript
const agentFolder = item.agent_name.toLowerCase().replace('agent', '');
item.slack_text = `@Cursor [repo=${repo}] review instructions from agents/${agentFolder}/instructions.md and then execute the following task: run ${item.agent_name} for ${item.blog_slug} topic: ${item.topic} phase: ${item.current_phase} site: ${item.site_name}`;
```

---

## 🎯 Agent-Specific Fallbacks

### **SEO Agent**
- **Channel**: `#brightgift-seo-agent`
- **Instructions**: `agents/seo/instructions.md`
- **Fallback**: `review instructions from agents/seo/instructions.md`

### **Blog Agent**
- **Channel**: `#brightgift-blog-agent`
- **Instructions**: `agents/blog/instructions.md`
- **Fallback**: `review instructions from agents/blog/instructions.md`

### **Review Agent**
- **Channel**: `#brightgift-review-agent`
- **Instructions**: `agents/review/instructions.md`
- **Fallback**: `review instructions from agents/review/instructions.md`

### **Image Agent**
- **Channel**: `#brightgift-image-agent`
- **Instructions**: `agents/image/instructions.md`
- **Fallback**: `review instructions from agents/image/instructions.md`

### **Publishing Agent**
- **Channel**: `#brightgift-publishing-agent`
- **Instructions**: `agents/publishing/instructions.md`
- **Fallback**: `review instructions from agents/publishing/instructions.md`

---

## 📊 Performance Comparison

| Approach | Execution Time | Token Cost | Reliability | Use Case |
|----------|---------------|------------|-------------|----------|
| **Efficient** | ~30 seconds | Lower | High | Production workflow |
| **Fallback** | ~60 seconds | Higher | Very High | Debugging/testing |

---

## 🔍 Troubleshooting

### **Agent Not Responding Correctly**
1. **Try manual fallback command** in agent channel
2. **Check agent instructions** for recent changes
3. **Verify repository access** and file paths
4. **Test with instruction review** to isolate issue

### **Workflow Errors**
1. **Check n8n execution logs** for error details
2. **Verify Slack credentials** are configured correctly
3. **Test individual webhooks** with curl commands
4. **Use fallback commands** to bypass workflow issues

---

## ✅ Best Practices

### **Production Use**
- ✅ Use **efficient commands** for normal workflow
- ✅ Monitor agent performance and accuracy
- ✅ Keep instruction files up-to-date

### **Development/Testing**
- ✅ Use **fallback commands** when debugging
- ✅ Test instruction changes with fallback first
- ✅ Verify agent behavior after instruction updates

**The fallback mechanism ensures you always have a way to get agents working correctly when needed!** 