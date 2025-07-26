# 🔍 SEO Agent Instructions

## 🎯 Purpose
Conduct comprehensive SEO research to identify high-potential keywords with low competition, analyze content opportunities, and provide data-driven content strategy recommendations.

## 📋 Responsibilities
- Research high-potential keywords with low competition using multiple data sources
- Analyze search volume, competition, and commercial intent for target topics
- Identify content gaps and opportunities for maximum SEO impact
- Create detailed content strategy recommendations with target metrics
- Update keyword bank with new findings for future use
- Provide comprehensive SEO analysis for blog content planning

## 🛠️ Tools & Dependencies
- **Core SEO Research**: `enhancedSEOProcessor.js` - Multi-source keyword analysis and content strategy
- **Google Ads Integration**: `googleAdsAPI.js` - Enhanced keyword research with real search data
- **Keyword Management**: `keywordBank.js` - Store and retrieve high-potential keywords
- **Workflow State**: `workflow_state.json` - State management and agent handoff

## 🔄 Workflow Steps

### 1. Parse Input Parameters
```javascript
// Extract parameters from the command
const blogSlug = process.argv[2] || 'blog-' + new Date().toISOString().split('T')[0];
const topic = process.argv[3] || 'general';
const phase = process.argv[4] || 'SEO';
const site = process.argv[5] || 'brightgift';

console.log(`SEO Agent starting for: ${blogSlug}, topic: ${topic}, site: ${site}`);
```

### 2. Create Content Directory
```javascript
// Create directory structure for this blog post
const contentDir = `content/blog-posts/${blogSlug}`;
const fs = require('fs');
const path = require('path');

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
  console.log(`Created directory: ${contentDir}`);
}
```

### 3. Initialize Research Environment
```javascript
// Load configuration and initialize tools
const seoProcessor = new EnhancedSEOProcessor(config);
const googleAds = new GoogleAdsAPI(config);
const keywordBank = await getKeywordBank();
```

### 4. Check Keyword Bank First (Primary Data Source)
- Search keyword bank for unused high-potential keywords
- Filter by relevance to target audience and content goals
- Prioritize keywords with high opportunity scores
- Use bank data as primary source when available

### 5. Research High-Potential Keywords
- **If topic provided**: Research specific topic for keyword opportunities
- **If no topic**: Search for high-potential keywords with low competition
- Use Google Ads API for real search volume and competition data
- Analyze keyword difficulty, commercial intent, and seasonal trends
- Identify long-tail variations and question-based keywords

### 6. Multi-Source Analysis
- **Google Ads Data**: Search volume, competition, CPC, quality score
- **SERP Analysis**: Current ranking content, content gaps, opportunities
- **Keyword Bank**: Historical performance and unused opportunities
- **Content Analysis**: Identify what content exists and what's missing

### 7. Content Strategy Development
- Calculate combined opportunity scores for all keywords
- Identify content gaps and underserved topics
- Determine optimal content type (informational vs. commercial)
- Estimate target word count and content structure
- Plan affiliate integration opportunities

### 8. Update Keyword Bank
- Add new high-potential keywords to bank
- Mark used keywords to prevent duplication
- Update opportunity scores based on latest analysis
- Maintain keyword bank statistics

### 9. Generate SEO Results
```javascript
// Create comprehensive SEO analysis results
const seoResults = {
  topic: topic,
  timestamp: new Date().toISOString(),
  keywordAnalysis: keywordAnalysis,
  contentStrategy: contentStrategy,
  affiliatePlan: affiliatePlan,
  timingAnalysis: timingAnalysis,
  opportunityAnalysis: opportunityAnalysis,
  recommendations: recommendations,
  dataSources: {
    googleAds: googleAdsUsed,
    keywordBank: keywordBankUsed,
    serpApi: serpApiUsed,
    contentAnalysis: contentAnalysisUsed
  }
};

// Save SEO results to file
const seoResultsPath = path.join(contentDir, 'seo-results.json');
fs.writeFileSync(seoResultsPath, JSON.stringify(seoResults, null, 2));
console.log(`SEO results saved to: ${seoResultsPath}`);
```

### 10. Update Workflow State
```javascript
// Create or update workflow state
const workflowState = {
  post_id: blogSlug,
  title: `Blog Post: ${topic}`,
  topic: topic,
  current_phase: "SEO_COMPLETE",
  next_agent: "BlogAgent",
  last_updated: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  human_review_required: false,
  branch: `preview/${blogSlug}`,
  preview_url: null,
  final_url: null,
  status: "in_progress",
  agents_run: ["SEOAgent"],
  agent_outputs: {
    "SEOAgent": "seo-results.json"
  },
  metadata: {
    primary_keyword: seoResults.keywordAnalysis[0]?.keyword || topic,
    secondary_keywords: seoResults.keywordAnalysis.slice(1, 4).map(k => k.keyword) || [],
    content_type: seoResults.contentStrategy.recommendedTopics[0]?.strategy.type || "educational",
    estimated_word_count: 1500,
    target_audience: "gift shoppers",
    seo_score: seoResults.keywordAnalysis[0]?.combinedScore || 75,
    competition_level: "medium",
    search_volume: "high"
  },
  timestamps: {
    created: new Date().toISOString(),
    seo_started: new Date().toISOString(),
    seo_completed: new Date().toISOString(),
    blog_started: null,
    blog_completed: null,
    review_started: null,
    review_completed: null,
    image_started: null,
    image_completed: null,
    publishing_started: null,
    publishing_completed: null,
    social_started: null,
    social_completed: null
  },
  errors: [],
  notes: "SEO analysis completed successfully"
};

// Save workflow state to file
const workflowStatePath = path.join(contentDir, 'workflow_state.json');
fs.writeFileSync(workflowStatePath, JSON.stringify(workflowState, null, 2));
console.log(`Workflow state saved to: ${workflowStatePath}`);
```

### 11. Commit Changes to GitHub
```javascript
// Commit all changes to trigger next agent
const { execSync } = require('child_process');

try {
  // Add all files to git
  execSync('git add .', { cwd: process.cwd(), stdio: 'inherit' });
  console.log('Files added to git');
  
  // Commit changes
  const commitMessage = `SEO Agent: Complete analysis for ${blogSlug} - ${topic}`;
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

### 12. Update Supabase State
After completing the SEO analysis, update the Supabase database to sync with the dashboard:

```javascript
// Update Supabase state for real-time dashboard sync
const supabaseUpdate = {
  current_phase: "SEO_COMPLETE",
  next_agent: "BlogAgent",
  last_updated: new Date().toISOString(),
  agents_run: ["SEOAgent"],
  metadata: {
    seo_score: seoResults.keywordAnalysis[0]?.combinedScore || 75,
    target_keywords: seoResults.keywordAnalysis.length,
    content_strategy: seoResults.contentStrategy.recommendedTopics[0]?.strategy.type || "educational"
  }
};

// This will be handled by the n8n workflow that triggered this agent
// The workflow will automatically sync this state to Supabase
```

### 13. Trigger Next Agent
The GitHub commit above will automatically trigger the GitHub webhook, which will then trigger the next agent (BlogAgent) via n8n.

## 📁 Output Files
- `content/blog-posts/{blogSlug}/seo-results.json` - Complete keyword analysis, content strategy, and recommendations
- `content/blog-posts/{blogSlug}/workflow_state.json` - Updated state with SEO completion and next agent
- Keyword bank updated with new findings

## 🎯 Success Criteria
- ✅ Identified 5-10 high-potential keywords with low competition
- ✅ Analyzed search volume, competition, and commercial intent
- ✅ Created detailed content strategy with target metrics
- ✅ Updated keyword bank with new findings
- ✅ Provided clear content recommendations for Blog Agent
- ✅ Updated workflow state and triggered next agent via GitHub commit
- ✅ Created proper directory structure for blog post

## 🔧 Configuration
- **Google Ads API**: Required for enhanced keyword research (with fallback)
- **SERP API**: Optional for additional search analysis
- **Keyword Bank**: Primary data source for high-potential keywords
- **Site Configuration**: Target site and content focus

## 📊 Data Sources Priority
1. **Keyword Bank** - Primary source for unused high-potential keywords
2. **Google Ads API** - Real search volume and competition data
3. **SERP Analysis** - Current content landscape and gaps
4. **Fallback to Bank** - Use best available keywords when APIs unavailable

## 📝 Notes
- Always check keyword bank first before calling external APIs
- Focus on finding keywords with high search volume and low competition
- Prioritize keywords that align with target audience and content goals
- Update keyword bank with all new findings for future use
- Provide clear content strategy that Blog Agent can execute
- Log all data sources and analysis methods for transparency
- Handle API failures gracefully by falling back to keyword bank data
- Always create proper directory structure for each blog post
- Commit changes to GitHub to trigger next agent in the workflow 