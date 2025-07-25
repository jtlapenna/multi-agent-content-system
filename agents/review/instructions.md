# 🔍 Review Agent Instructions

## 🎯 Purpose
Review, optimize, and validate blog content for SEO, readability, and quality before publishing.

## 📋 Responsibilities
- Review blog content for quality and accuracy
- Optimize for SEO and readability
- Validate content structure and formatting
- Update workflow state and trigger next agent

## 🛠️ Tools & Dependencies
- **Content Checker**: `contentChecker.js` - Content validation and optimization
- **SEO Processor**: `enhancedSEOProcessor.js` - SEO optimization
- **Blog Content**: `blog-draft.md` from Blog Agent
- **Workflow State**: `workflow_state.json` - State management

## 🔄 Workflow Steps

### 1. Load Blog Content
```bash
# Load blog draft and SEO data
const blogDraft = loadFile('blog-draft.md');
const seoResults = loadJSON('seo-results.json');
```

### 2. Content Review
- Review content for accuracy and completeness
- Check for grammar and spelling errors
- Validate content structure and flow
- Ensure all requirements are met

### 3. SEO Optimization
- Optimize title and meta description
- Ensure proper keyword density
- Add internal and external links
- Optimize heading structure
- Improve content for search engines

### 4. Readability Enhancement
- Improve sentence structure and flow
- Enhance readability and engagement
- Add relevant examples and data
- Ensure proper formatting and structure

### 5. Quality Validation
- Validate content meets all requirements
- Check for consistency and accuracy
- Ensure proper call-to-action elements
- Verify content is valuable and engaging

### 6. Update Workflow State
```json
{
  "current_phase": "REVIEW_COMPLETE",
  "next_agent": "ImageAgent",
  "blog_final": "blog-final.md",
  "optimization_notes": "...",
  "last_updated": "2025-01-XXTXX:XX:XXZ"
}
```

### 7. Trigger Next Agent
- Commit `blog-final.md` and updated `workflow_state.json`
- Send Slack command to trigger Image Agent
- Log completion in agent logs

## 📁 Output Files
- `blog-final.md` - Optimized and reviewed blog content
- `workflow_state.json` - Updated state with review completion
- `logs/review-log.json` - Detailed execution log

## 🎯 Success Criteria
- ✅ Content reviewed and optimized
- ✅ SEO requirements met
- ✅ Readability enhanced
- ✅ Quality validated
- ✅ Updated workflow state
- ✅ Triggered next agent

## 🔧 Configuration
- **Content Checker**: Configured for validation
- **SEO Guidelines**: Follow optimization rules
- **Quality Standards**: Meet content quality requirements
- **Review Process**: Comprehensive review checklist

## 📝 Review Checklist
- [ ] Content accuracy and completeness
- [ ] Grammar and spelling
- [ ] SEO optimization
- [ ] Readability and flow
- [ ] Structure and formatting
- [ ] Internal and external links
- [ ] Call-to-action elements
- [ ] Keyword optimization
- [ ] Content value and engagement

## 📝 Notes
- Focus on improving content quality and SEO
- Ensure content meets all requirements
- Optimize for both search engines and readers
- Maintain content accuracy and value
- Log all review and optimization steps 