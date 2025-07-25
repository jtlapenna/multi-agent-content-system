# ✍️ Blog Agent Instructions

## 🎯 Purpose
Generate high-quality blog content using Cursor agents based on SEO research and topic recommendations.

## 📋 Responsibilities
- Generate blog drafts from SEO research
- Create engaging, SEO-optimized content
- Ensure proper structure and formatting
- Update workflow state and trigger next agent

## 🛠️ Tools & Dependencies
- **Content Generation**: Cursor agent-based content creation
- **SEO Data**: `seo-results.json` from SEO Agent
- **Content Checker**: `contentChecker.js` - Content validation
- **Workflow State**: `workflow_state.json` - State management

## 🔄 Workflow Steps

### 1. Load SEO Research
```bash
# Load SEO results and selected topic
const seoResults = loadJSON('seo-results.json');
const selectedTopic = seoResults.selected_topics[0];
```

### 2. Generate Blog Content
- Use Cursor agent to generate blog draft
- Follow SEO guidelines and keyword optimization
- Create engaging introduction and conclusion
- Include proper headings and structure
- Target minimum 1200 words

### 3. Content Optimization
- Optimize for target keywords
- Ensure proper internal linking
- Add meta description and title
- Include call-to-action elements
- Format for readability

### 4. Quality Check
- Validate content meets SEO requirements
- Check for proper keyword density
- Ensure content is engaging and valuable
- Verify word count and structure

### 5. Update Workflow State
```json
{
  "current_phase": "BLOG_COMPLETE",
  "next_agent": "ReviewAgent",
  "blog_draft": "blog-draft.md",
  "word_count": 1500,
  "last_updated": "2025-01-XXTXX:XX:XXZ"
}
```

### 6. Trigger Next Agent
- Commit `blog-draft.md` and updated `workflow_state.json`
- Send Slack command to trigger Review Agent
- Log completion in agent logs

## 📁 Output Files
- `blog-draft.md` - Generated blog content with frontmatter
- `workflow_state.json` - Updated state with blog completion
- `logs/blog-log.json` - Detailed execution log

## 🎯 Success Criteria
- ✅ Generated blog draft with 1200+ words
- ✅ Optimized for target keywords
- ✅ Proper structure and formatting
- ✅ Engaging and valuable content
- ✅ Updated workflow state
- ✅ Triggered next agent

## 🔧 Configuration
- **Cursor Agent**: Configured for content generation
- **SEO Guidelines**: Follow keyword optimization rules
- **Content Style**: Match target site's tone and style
- **Word Count**: Minimum 1200 words, target 1500+

## 📝 Content Guidelines
- Start with engaging hook
- Use proper heading hierarchy (H1, H2, H3)
- Include relevant keywords naturally
- Add internal and external links
- End with strong call-to-action
- Use bullet points and lists for readability
- Include relevant examples and data

## 📝 Notes
- Focus on creating valuable, informative content
- Optimize for both search engines and readers
- Include relevant examples and actionable tips
- Ensure content is original and engaging
- Log all content generation steps for transparency 