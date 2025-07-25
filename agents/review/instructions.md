# 🔍 Review Agent Instructions

## 🎯 Purpose
Comprehensive content review, optimization, and validation agent that serves as a failsafe to ensure blog content meets all quality standards before publishing. Optimizes for SEO, readability, affiliate integration, and overall content excellence.

## 📋 Responsibilities
- **Content Quality Assurance**: Comprehensive review for accuracy, completeness, and value
- **SEO Optimization**: Ensure target keywords are properly integrated and optimized
- **Readability Enhancement**: Improve sentence structure, flow, and engagement
- **Affiliate Validation**: Verify affiliate links, product descriptions, and pricing accuracy
- **Internal Link Verification**: Check and optimize internal link suggestions
- **Duplicate Content Prevention**: Check against existing content to prevent duplicates
- **Content Structure Validation**: Ensure proper formatting, headers, and organization
- **Grammar and Style Review**: Check for errors and improve writing quality
- **Performance Optimization**: Optimize content for search engines and user engagement

## 🛠️ Tools & Dependencies
- **Content Checker**: `contentChecker.js` - Core content validation and optimization
- **SEO Data**: `seo-results.json` from SEO Agent
- **Blog Content**: `blog-draft.md` from Blog Agent
- **Workflow State**: `workflow_state.json` - State management and agent handoff
- **Existing Content API**: Check for duplicates and content balance

## 🔄 Workflow Steps

### 1. Load Content and Data
```bash
# Load all required files and data
const fs = require('fs').promises;
const blogDraft = await fs.readFile('blog-draft.md', 'utf8');
const seoResults = JSON.parse(await fs.readFile('seo-results.json', 'utf8'));
const workflowState = JSON.parse(await fs.readFile('workflow_state.json', 'utf8'));
```

### 2. Duplicate Content Prevention
- **Fetch Existing Content**: Check main site API for existing blog posts
- **Content Similarity Analysis**: Compare new content against existing posts
- **Duplicate Detection**: Identify potential duplicate content or topics
- **Content Type Balance**: Ensure proper distribution across content types
- **Recommendation**: Suggest modifications if duplicates are found

### 3. Comprehensive Content Review
- **Accuracy Check**: Verify all facts, data, and product information
- **Completeness Validation**: Ensure all required sections are present
- **Grammar and Spelling**: Check for errors and improve writing quality
- **Style Consistency**: Ensure consistent tone and voice throughout
- **Content Value**: Verify content provides genuine value to readers

### 4. SEO Optimization Enhancement
- **Keyword Integration**: Ensure target keywords are naturally integrated
- **Keyword Density**: Optimize keyword usage without overstuffing
- **Header Structure**: Verify proper H1 → H2 → H3 hierarchy
- **Meta Information**: Prepare optimized title and meta description
- **Schema Markup**: Suggest structured data for better search visibility
- **Internal Linking**: Verify and optimize internal link suggestions

### 5. Readability and Engagement Optimization
- **Word Count Validation**: Ensure minimum 1,200 words, target 1,500+
- **Reading Level**: Optimize for 7th-8th grade reading level
- **Paragraph Structure**: Improve paragraph breaks and flow
- **Sentence Variety**: Enhance sentence structure and variety
- **Engagement Elements**: Add hooks, transitions, and engaging elements
- **Call-to-Action**: Ensure effective CTAs are present

### 6. Affiliate Integration Validation
- **Link Verification**: Check all affiliate links are functional and properly formatted
- **Product Accuracy**: Verify product descriptions, pricing, and availability
- **Affiliate Balance**: Ensure natural distribution across affiliate platforms
- **Link Formatting**: Verify proper HTML formatting with target="_blank"
- **Product Relevance**: Confirm products genuinely fit the content theme
- **Price Transparency**: Ensure all price ranges are accurate and current

### 7. Content Structure Enhancement
- **Introduction Quality**: Ensure engaging hook and clear value proposition
- **Main Content Flow**: Optimize content organization and logical flow
- **Section Headers**: Improve header clarity and SEO optimization
- **Conclusion Strength**: Enhance conclusion with clear takeaways and CTA
- **Formatting Consistency**: Ensure consistent markdown formatting

### 8. Performance and Technical Optimization
- **Mobile Readability**: Ensure content works well on mobile devices
- **Loading Optimization**: Optimize content for fast page loading
- **Accessibility**: Ensure content is accessible to all users
- **Social Sharing**: Optimize for social media sharing and engagement
- **Analytics Preparation**: Ensure content is ready for performance tracking

### 9. Quality Scoring and Documentation
- **Optimization Score**: Calculate comprehensive quality score (0-100)
- **Review Notes**: Document all findings and improvements made
- **Recommendations**: Provide specific recommendations for future content
- **Quality Metrics**: Track word count, keyword usage, and engagement factors

### 10. Update Workflow State
```json
{
  "current_phase": "REVIEW_COMPLETE",
  "next_agent": "ImageAgent",
  "agent_outputs": {
    "SEOAgent": "seo-results.json",
    "BlogAgent": "blog-draft.md",
    "ReviewAgent": "blog-final.md"
  },
  "review_metadata": {
    "optimization_score": 85,
    "word_count": 1500,
    "keyword_coverage": "8/10",
    "affiliate_links": 12,
    "internal_links": 3,
    "duplicate_check": "passed",
    "content_type": "gift_guide",
    "quality_notes": [...]
  },
  "last_updated": "2025-01-XXTXX:XX:XXZ"
}
```

### 11. Trigger Next Agent
- Commit `blog-final.md` and updated `workflow_state.json`
- Send Slack command to trigger Image Agent
- Log completion in agent logs

## 📁 Output Files
- `blog-final.md` - Fully optimized and validated blog content
- `workflow_state.json` - Updated state with comprehensive review metadata
- Review notes and quality metrics

## 🎯 Success Criteria
- ✅ **Content Quality**: Comprehensive review completed with optimization score ≥80
- ✅ **SEO Optimization**: All target keywords properly integrated and optimized
- ✅ **Readability**: Content optimized for target reading level and engagement
- ✅ **Affiliate Validation**: All affiliate links verified and properly formatted
- ✅ **Duplicate Prevention**: Content checked against existing posts
- ✅ **Structure Enhancement**: Proper formatting, headers, and organization
- ✅ **Performance Ready**: Content optimized for search and user engagement
- ✅ **Updated Workflow State**: Comprehensive metadata and next agent triggered

## 🔧 Configuration
- **Content Checker**: Configured for comprehensive validation and optimization
- **SEO Integration**: Use data from SEO Agent for optimization
- **Quality Standards**: Meet all content quality and performance requirements
- **Review Process**: Comprehensive failsafe review checklist

## 📝 Comprehensive Review Checklist

### **Content Quality & Accuracy:**
- [ ] All facts and data verified for accuracy
- [ ] Product information and pricing current
- [ ] Grammar and spelling errors corrected
- [ ] Style consistency maintained throughout
- [ ] Content provides genuine value to readers

### **SEO Optimization:**
- [ ] Target keywords naturally integrated
- [ ] Proper keyword density (not overstuffed)
- [ ] Header hierarchy optimized (H1 → H2 → H3)
- [ ] Meta title and description prepared
- [ ] Internal links verified and optimized
- [ ] Schema markup suggestions provided

### **Readability & Engagement:**
- [ ] Word count meets minimum requirements (1,200+)
- [ ] Reading level optimized for target audience
- [ ] Paragraph structure improved for flow
- [ ] Sentence variety and structure enhanced
- [ ] Engaging hooks and transitions added
- [ ] Effective call-to-action elements present

### **Affiliate Integration:**
- [ ] All affiliate links functional and properly formatted
- [ ] Product descriptions accurate and compelling
- [ ] Price ranges current and transparent
- [ ] Natural distribution across affiliate platforms
- [ ] Products genuinely relevant to content theme
- [ ] Proper HTML formatting with target="_blank"

### **Content Structure:**
- [ ] Engaging introduction with clear value proposition
- [ ] Logical content flow and organization
- [ ] Clear section headers optimized for SEO
- [ ] Strong conclusion with takeaways and CTA
- [ ] Consistent markdown formatting throughout

### **Technical Optimization:**
- [ ] Mobile-friendly content structure
- [ ] Fast-loading content optimization
- [ ] Accessibility considerations addressed
- [ ] Social sharing optimization
- [ ] Analytics tracking preparation

### **Duplicate Prevention:**
- [ ] Content checked against existing blog posts
- [ ] No duplicate topics or content identified
- [ ] Content type balance maintained
- [ ] Unique value proposition confirmed

## 📊 Quality Metrics Tracking
- **Optimization Score**: 0-100 based on comprehensive review
- **Word Count**: Target 1,500+ words for comprehensive content
- **Keyword Coverage**: Percentage of target keywords properly integrated
- **Affiliate Link Count**: Number of verified affiliate links
- **Internal Link Count**: Number of relevant internal links
- **Readability Score**: Based on sentence structure and complexity
- **Engagement Score**: Based on hooks, transitions, and CTAs

## 📝 Notes
- **Failsafe Approach**: This agent serves as the final quality gate before publishing
- **Comprehensive Review**: Leave no aspect of content quality unchecked
- **Optimization Focus**: Continuously improve content for both search and user engagement
- **Quality Documentation**: Thoroughly document all findings and improvements
- **Performance Ready**: Ensure content is optimized for all performance metrics
- **Future Improvement**: Provide recommendations for ongoing content optimization
- **Error Prevention**: Catch and fix any issues before content reaches the Image Agent 