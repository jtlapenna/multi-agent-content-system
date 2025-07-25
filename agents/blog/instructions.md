# ✍️ Blog Agent Instructions

## 🎯 Purpose
Generate high-quality, SEO-optimized blog content using Cursor agents based on SEO research and topic recommendations. Create engaging content that balances different content types while automatically researching and integrating relevant affiliate products.

## 📋 Responsibilities
- Generate blog content from SEO research and topic recommendations
- Research and integrate relevant affiliate products (Amazon, Bookshop.org, Afrofiliate)
- Create engaging, SEO-optimized content with proper structure
- Balance content types across gift guides, educational, data-driven, and affiliate-focused content
- Automatically find and suggest internal links
- Update workflow state and trigger next agent

## 🛠️ Tools & Dependencies
- **Content Generation**: Cursor agent-based content creation
- **SEO Data**: `seo-results.json` from SEO Agent
- **Affiliate Research**: Automatic product research and integration
- **Internal Linking**: Automatic internal link discovery and suggestion
- **Workflow State**: `workflow_state.json` - State management and agent handoff

## 🔄 Workflow Steps

### 1. Load SEO Research and Topic
```bash
# Load SEO results and selected topic
const seoResults = loadJSON('seo-results.json');
const workflowState = loadJSON('workflow_state.json');
const primaryTopic = seoResults.primary_topic || workflowState.topic;
const targetKeywords = seoResults.target_keywords || [];
const contentStrategy = seoResults.content_strategy || {};
```

### 2. Determine Content Type and Structure
Based on SEO analysis and content strategy, determine the appropriate content type:
- **Gift Guides** (primary focus) - Long-form lists of gift ideas for specific niches
- **How-To Articles** - Guides on gift-giving etiquette, budgeting, personalization
- **Educational Content** - Psychology of gift-giving, cultural perspectives, data analysis
- **Problem-Solving Content** - Solutions to common gift-giving challenges
- **Trending & Data-Driven Content** - Current trends, statistics, and analysis

### 3. Research Affiliate Products
For each content piece, automatically research relevant affiliate products:

#### **Amazon Integration:**
- Research products using target keywords and topic
- Use search terms connected to affiliate link structure
- Include price ranges, descriptions, and benefits
- Format: `**Price Range:** $X-$Y // <a href="amazon-affiliate-link" class="amazon-link" target="_blank" rel="noopener">View on Amazon</a>`

#### **Bookshop.org Integration:**
- Research relevant books using search terms or ISBNs when available
- Focus on gift-giving, relationships, or topic-specific books
- Include book descriptions, author information, and price ranges
- Format: `**Price Range:** $X-$Y // <a href="bookshop-affiliate-link" class="bookshop-link" target="_blank" rel="noopener">Shop on Bookshop.org</a>`

#### **Afrofiliate Integration:**
- Research Black-owned businesses and products
- Include detailed descriptions, brand stories, and price ranges
- Focus on quality products that genuinely fit the content
- Format: `**Price Range:** $X-$Y // <a href="afrofiliate-link" class="afrofiliate-link" target="_blank" rel="noopener">Shop [Brand Name]</a>`

### 4. Generate Blog Content Structure
Create content following the standard structure:

#### **Introduction (2-3 paragraphs):**
- Engaging hook that resonates with target audience
- Address relatable challenge or pain point
- Preview value and solutions the post will provide
- Include primary keyword naturally

#### **Main Content:**
- Clear H2 section headers
- Numbered or categorized gift ideas (for gift guides)
- Each item includes:
  - Name/title (H3)
  - "Why it's great" section (2-3 sentences explaining benefits) - *optional based on theme/appropriateness*
  - "Practical tip" section (1 actionable sentence) - *optional based on theme/appropriateness*
  - Price range and affiliate link on same line
  - Detailed description with benefits and features

#### **Supplementary Sections:**
- "How to Choose" section with bullet points
- Internal link suggestions to related blog posts
- Budget-friendly alternatives when relevant

#### **Conclusion:**
- Summary of key points
- Single CTA to Gift Idea Generator tool
- Warm, encouraging tone

### 5. Content Quality Standards
- **Word Count**: Minimum 1,200 words, target 1,500+ for comprehensive content
- **Reading Level**: 7th-8th grade for accessibility
- **SEO Optimization**: Naturally integrate target keywords
- **Affiliate Integration**: Only include products that genuinely fit the content
- **Internal Linking**: Automatically suggest relevant internal links
- **Tone**: Friendly but professional, helpful expert, inclusive

### 6. Update Workflow State
```json
{
  "current_phase": "BLOG_COMPLETE",
  "next_agent": "ReviewAgent",
  "agent_outputs": {
    "SEOAgent": "seo-results.json",
    "BlogAgent": "blog-draft.md"
  },
  "blog_metadata": {
    "word_count": 1500,
    "content_type": "gift_guide",
    "affiliate_products": {
      "amazon": 8,
      "bookshop": 2,
      "afrofiliate": 3
    },
    "internal_links": 3,
    "target_keywords": ["gift ideas for parents", "thoughtful gifts", "parent gifts"]
  },
  "last_updated": "2025-01-XXTXX:XX:XXZ"
}
```

### 7. Trigger Next Agent
- Commit `blog-draft.md` and updated `workflow_state.json`
- Send Slack command to trigger Review Agent
- Log completion in agent logs

## 📁 Output Files
- `blog-draft.md` - Generated blog content in markdown format
- `workflow_state.json` - Updated state with blog completion and next agent

## 🎯 Success Criteria
- ✅ Generated blog draft with 1,200+ words
- ✅ Optimized for target keywords from SEO Agent
- ✅ Integrated relevant affiliate products (Amazon, Bookshop.org, Afrofiliate)
- ✅ Proper structure and formatting with H2/H3 headers
- ✅ Engaging and valuable content with practical tips
- ✅ Suggested internal links to related content
- ✅ Updated workflow state and triggered next agent

## 🔧 Configuration
- **Cursor Agent**: Configured for content generation
- **SEO Integration**: Use data from SEO Agent for optimization
- **Affiliate Research**: Automatic product discovery and integration
- **Content Style**: Match BrightGift brand voice and style guidelines
- **Internal Linking**: Automatic discovery of relevant internal links

## 📝 Content Guidelines

### **Writing Style:**
- **Audience-focused**: Write for gift-givers making thoughtful decisions
- **Benefit-driven**: Emphasize what each product offers the recipient
- **Practical**: Include tips that help with real-world decision making
- **Warm and encouraging**: Build confidence in gift-giving choices
- **Specific and detailed**: Avoid generic descriptions; be specific about benefits
- **Inclusive**: Use welcoming language that celebrates diversity when relevant

### **Affiliate Integration Guidelines:**
- **Natural Integration**: Only suggest products that genuinely fit the content
- **Quality Focus**: Prioritize quality and relevance over artificial diversity
- **Detailed Descriptions**: Include "Why it's great" and "Practical tip" sections when appropriate for the content theme
- **Price Transparency**: Always include specific price ranges
- **Proper Formatting**: Use consistent affiliate link formatting with target="_blank"

### **SEO Optimization:**
- **Keyword Integration**: Naturally include target keywords from SEO Agent
- **Header Structure**: Use proper H1 → H2 → H3 hierarchy
- **Internal Linking**: Include relevant internal links to other blog posts
- **Meta Information**: Prepare meta description and title suggestions

## 📊 Content Type Distribution
Maintain balance across content types:
- **Gift Guides**: 60% (primary focus)
- **How-To Articles**: 15%
- **Educational Content**: 10%
- **Problem-Solving Content**: 10%
- **Trending & Data-Driven Content**: 5%

## 📝 Notes
- Always use SEO research from previous agent to inform content creation
- Research affiliate products thoroughly to ensure quality recommendations
- Focus on creating valuable, informative content that helps readers
- Optimize for both search engines and readers
- Include relevant examples and actionable tips
- Ensure content is original and engaging
- Log all content generation steps for transparency
- Handle affiliate research failures gracefully by focusing on content quality 