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

## 📁 Output Files
- `content/blog-posts/{blogSlug}/blog-final.md` - Fully optimized and validated blog content
- `content/blog-posts/{blogSlug}/workflow_state.json` - Updated state with comprehensive review metadata
- Review notes and quality metrics

## 🎯 Success Criteria
- ✅ **Content Quality**: Comprehensive review completed with optimization score ≥80
- ✅ **SEO Optimization**: All target keywords properly integrated and optimized
- ✅ **Readability**: Content optimized for target reading level and engagement
- ✅ **Affiliate Validation**: All affiliate links verified and properly formatted
- ✅ **Duplicate Prevention**: Content checked against existing posts
- ✅ **Structure Enhancement**: Proper formatting, headers, and organization
- ✅ **Performance Ready**: Content optimized for search and user engagement
- ✅ **Updated Workflow State**: Comprehensive metadata and next agent triggered via GitHub commit

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

### 10. Parse Input Parameters and Load Data
```javascript
// Extract parameters from the command
const blogSlug = process.argv[2] || 'blog-' + new Date().toISOString().split('T')[0];
const topic = process.argv[3] || 'general';
const phase = process.argv[4] || 'REVIEW';
const site = process.argv[5] || 'brightgift';

console.log(`Review Agent starting for: ${blogSlug}, topic: ${topic}, site: ${site}`);

// Load content and data
const contentDir = `content/blog-posts/${blogSlug}`;
const fs = require('fs');
const path = require('path');

const blogDraftPath = path.join(contentDir, 'blog-draft.md');
const seoResultsPath = path.join(contentDir, 'seo-results.json');
const workflowStatePath = path.join(contentDir, 'workflow_state.json');

if (!fs.existsSync(blogDraftPath)) {
  throw new Error(`Blog draft not found at: ${blogDraftPath}`);
}

const blogDraft = fs.readFileSync(blogDraftPath, 'utf8');
const seoResults = JSON.parse(fs.readFileSync(seoResultsPath, 'utf8'));
const workflowState = JSON.parse(fs.readFileSync(workflowStatePath, 'utf8'));

console.log('Loaded blog draft, SEO results, and workflow state');
```

### 11. Perform Comprehensive Review
```javascript
// Perform all review steps
const reviewResults = performComprehensiveReview(blogDraft, seoResults);

// Generate optimized final content
const finalContent = reviewResults.optimizedContent;

// Save final blog content
const blogFinalPath = path.join(contentDir, 'blog-final.md');
fs.writeFileSync(blogFinalPath, finalContent);
console.log(`Final blog content saved to: ${blogFinalPath}`);
```

### 12. Update Workflow State
```javascript
// Update workflow state with review completion
workflowState.current_phase = "REVIEW_COMPLETE";
workflowState.next_agent = "ImageAgent";
workflowState.last_updated = new Date().toISOString();
workflowState.updated_at = new Date().toISOString();
workflowState.agents_run.push("ReviewAgent");
workflowState.agent_outputs["ReviewAgent"] = "blog-final.md";

// Add review metadata
workflowState.review_metadata = {
  optimization_score: reviewResults.optimizationScore,
  word_count: reviewResults.wordCount,
  keyword_coverage: reviewResults.keywordCoverage,
  affiliate_links: reviewResults.affiliateLinkCount,
  internal_links: reviewResults.internalLinkCount,
  duplicate_check: reviewResults.duplicateCheckResult,
  content_type: reviewResults.contentType,
  quality_notes: reviewResults.qualityNotes
};

// Update timestamps
workflowState.timestamps.review_started = workflowState.timestamps.review_started || new Date().toISOString();
workflowState.timestamps.review_completed = new Date().toISOString();

// Save updated workflow state
fs.writeFileSync(workflowStatePath, JSON.stringify(workflowState, null, 2));
console.log(`Workflow state updated: ${workflowStatePath}`);
```

### 13. Commit Changes to GitHub
```javascript
// Commit all changes to trigger next agent
const { execSync } = require('child_process');

try {
  // Add all files to git
  execSync('git add .', { cwd: process.cwd(), stdio: 'inherit' });
  console.log('Files added to git');
  
  // Commit changes
  const commitMessage = `Review Agent: Complete optimization for ${blogSlug} - ${topic}`;
  execSync(`git commit -m "${commitMessage}"`, { cwd: process.cwd(), stdio: 'inherit' });
  console.log('Changes committed to git');
  
  // Push to trigger GitHub webhook
  execSync('git push', { cwd: process.cwd(), stdio: 'inherit' });
  console.log('Changes pushed to GitHub');
  
} catch (error) {
  console.error('Git operations failed:', error.message);
  // Continue execution even if git fails
}
```

### 14. Trigger Next Agent
The GitHub commit above will automatically trigger the GitHub webhook, which will then trigger the next agent (ImageAgent) via n8n. 