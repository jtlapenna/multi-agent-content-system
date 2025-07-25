# 🔍 SEO Agent Instructions

## 🎯 Purpose
Conduct comprehensive keyword research and topic generation for blog content using enhanced SEO tools and Google Ads integration.

## 📋 Responsibilities
- Generate seed keywords for research
- Conduct keyword analysis with Google Ads data
- Select optimal blog topics based on search volume and competition
- Create SEO-optimized topic recommendations
- Update workflow state and trigger next agent

## 🛠️ Tools & Dependencies
- **Keyword Research**: `enhancedSEOProcessor.js` - Core SEO functionality
- **Google Ads Integration**: `googleAdsAPI.js` - Enhanced keyword research with real data
- **Content Checker**: `contentChecker.js` - Content validation and optimization
- **Workflow State**: `workflow_state.json` - State management

## 🔄 Workflow Steps

### 1. Initialize SEO Research
```bash
# Load configuration and initialize tools
const seoProcessor = new EnhancedSEOProcessor(config);
const googleAds = new GoogleAdsAPI(config);
```

### 2. Generate Seed Keywords
- Use current year and seasonal trends
- Focus on gift-related content research
- Include long-tail and question keywords
- Generate 15+ high-potential seed keywords

### 3. Conduct Keyword Analysis
- Analyze each keyword with Google Ads data
- Get search volume, competition, and CPC data
- Calculate keyword difficulty and commercial intent
- Identify related keywords and opportunities

### 4. Select Optimal Topics
- Score keywords based on multiple factors
- Select top 3-5 topics for blog generation
- Create detailed topic outlines
- Estimate word count and content type

### 5. Update Workflow State
```json
{
  "current_phase": "SEO_COMPLETE",
  "next_agent": "BlogAgent",
  "seo_results": "seo-results.json",
  "selected_topics": [...],
  "last_updated": "2025-01-XXTXX:XX:XXZ"
}
```

### 6. Trigger Next Agent
- Commit `seo-results.json` and updated `workflow_state.json`
- Send Slack command to trigger Blog Agent
- Log completion in agent logs

## 📁 Output Files
- `seo-results.json` - Complete keyword analysis and topic recommendations
- `workflow_state.json` - Updated state with SEO completion
- `logs/seo-log.json` - Detailed execution log

## 🎯 Success Criteria
- ✅ Generated 15+ seed keywords
- ✅ Analyzed keywords with Google Ads data
- ✅ Selected 3-5 optimal topics
- ✅ Created detailed topic outlines
- ✅ Updated workflow state
- ✅ Triggered next agent

## 🔧 Configuration
- **OpenAI API Key**: Required for keyword generation
- **Google Ads API**: Required for enhanced keyword research
- **SERP API Key**: Optional for additional search data
- **Site Configuration**: Target site and content focus

## 📝 Notes
- Always use current year in keyword generation
- Focus on gift-related content for target audience
- Include both high-volume and long-tail keywords
- Consider seasonal trends and upcoming holidays
- Log all API calls and data sources for transparency 