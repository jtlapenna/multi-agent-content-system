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

### 1. Initialize Research Environment
```bash
# Load configuration and initialize tools
const seoProcessor = new EnhancedSEOProcessor(config);
const googleAds = new GoogleAdsAPI(config);
const keywordBank = await getKeywordBank();
```

### 2. Check Keyword Bank First (Primary Data Source)
- Search keyword bank for unused high-potential keywords
- Filter by relevance to target audience and content goals
- Prioritize keywords with high opportunity scores
- Use bank data as primary source when available

### 3. Research High-Potential Keywords
- **If topic provided**: Research specific topic for keyword opportunities
- **If no topic**: Search for high-potential keywords with low competition
- Use Google Ads API for real search volume and competition data
- Analyze keyword difficulty, commercial intent, and seasonal trends
- Identify long-tail variations and question-based keywords

### 4. Multi-Source Analysis
- **Google Ads Data**: Search volume, competition, CPC, quality score
- **SERP Analysis**: Current ranking content, content gaps, opportunities
- **Keyword Bank**: Historical performance and unused opportunities
- **Content Analysis**: Identify what content exists and what's missing

### 5. Content Strategy Development
- Calculate combined opportunity scores for all keywords
- Identify content gaps and underserved topics
- Determine optimal content type (informational vs. commercial)
- Estimate target word count and content structure
- Plan affiliate integration opportunities

### 6. Update Keyword Bank
- Add new high-potential keywords to bank
- Mark used keywords to prevent duplication
- Update opportunity scores based on latest analysis
- Maintain keyword bank statistics

### 7. Update Workflow State
```json
{
  "current_phase": "SEO_COMPLETE",
  "next_agent": "BlogAgent",
  "agent_outputs": {
    "SEOAgent": "seo-results.json"
  },
  "seo_analysis": {
    "primary_topic": "gift ideas for parents",
    "target_keywords": [...],
    "content_strategy": {...},
    "estimated_word_count": 2500,
    "commercial_intent": "mixed"
  },
  "last_updated": "2025-01-XXTXX:XX:XXZ"
}
```

### 8. Trigger Next Agent
- Commit `seo-results.json` and updated `workflow_state.json`
- Send Slack command to trigger Blog Agent
- Log completion in agent logs

## 📁 Output Files
- `seo-results.json` - Complete keyword analysis, content strategy, and recommendations
- `workflow_state.json` - Updated state with SEO completion and next agent
- Keyword bank updated with new findings

## 🎯 Success Criteria
- ✅ Identified 5-10 high-potential keywords with low competition
- ✅ Analyzed search volume, competition, and commercial intent
- ✅ Created detailed content strategy with target metrics
- ✅ Updated keyword bank with new findings
- ✅ Provided clear content recommendations for Blog Agent
- ✅ Updated workflow state and triggered next agent

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