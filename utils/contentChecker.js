/**
 * Content Checker Utility
 * Checks existing content from main site API to avoid duplicates
 * Updated for multi-agent system integration
 */

const https = require('https');
const chalk = require('chalk');
const WorkflowStateTemplate = require('./workflowStateTemplate');

class ContentChecker {
  constructor() {
    // Load site configuration (with fallback)
    try {
      const siteConfig = require('../../config/sites/bright-gift.json');
      this.mainSiteUrl = `https://${siteConfig.domain}`;
      this.apiEndpoint = `${this.mainSiteUrl}/api/blog-posts`;
    } catch (error) {
      // Fallback configuration for testing
      this.mainSiteUrl = 'https://bright-gift.com';
      this.apiEndpoint = `${this.mainSiteUrl}/api/blog-posts`;
      console.log('⚠️ Using fallback site configuration for testing');
    }
    this.workflowTemplate = new WorkflowStateTemplate();
    this.agentName = 'ReviewAgent';
  }

  /**
   * Fetch all existing blog posts from main site
   */
  async fetchExistingContent() {
    const spinner = require('ora')('Checking existing content...').start();
    
    try {
      console.log(chalk.gray(`🔗 Trying API endpoint: ${this.apiEndpoint}`));
      
      const response = await new Promise((resolve, reject) => {
        const req = https.get(this.apiEndpoint, (res) => {
          console.log(chalk.gray(`📡 API Response: ${res.statusCode} ${res.statusMessage}`));
          
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              console.log(chalk.gray(`📊 Response structure: ${Object.keys(parsed).join(', ')}`));
              resolve(parsed);
            } catch (e) {
              reject(new Error(`Invalid JSON response: ${data.substring(0, 200)}...`));
            }
          });
        });
        
        req.on('error', (error) => {
          console.log(chalk.gray(`❌ Network error: ${error.message}`));
          reject(error);
        });
        
        req.setTimeout(10000, () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });
      });

      // Handle different response formats
      let posts = [];
      if (Array.isArray(response)) {
        // Direct array response (like bright-gift.com/api/blog-posts)
        posts = response;
      } else if (response.posts) {
        // Wrapped in posts object
        posts = response.posts;
      } else if (response.data) {
        // Wrapped in data object
        posts = response.data;
      } else if (response.blogPosts) {
        // Wrapped in blogPosts object
        posts = response.blogPosts;
      }
      
      spinner.succeed(`Found ${posts.length} existing blog posts`);
      return posts;
      
    } catch (error) {
      spinner.fail(`Failed to fetch existing content: ${error.message}`);
      console.log(chalk.yellow('⚠️  Continuing without content check...'));
      console.log(chalk.gray('💡 To fix this, ensure your main site has an API endpoint at:'));
      console.log(chalk.gray(`   ${this.apiEndpoint}`));
      console.log(chalk.gray('   Expected response format: {"posts": [{"title": "...", "slug": "...", "content": "..."}]}'));
      return [];
    }
  }

  /**
   * Analyze existing content by type
   */
  analyzeContentTypes(existingPosts) {
    const analysis = {
      total: existingPosts.length,
      byType: {
        'gift-guide': 0,
        'educational': 0,
        'data-driven': 0,
        'other': 0
      },
      titles: existingPosts.map(post => post.title),
      slugs: existingPosts.map(post => post.slug)
    };

    existingPosts.forEach(post => {
      const type = this.categorizeContent(post.title, post.content, post.contentType);
      analysis.byType[type] = (analysis.byType[type] || 0) + 1;
    });

    return analysis;
  }

  /**
   * Categorize content by title and content analysis
   */
  categorizeContent(title, content, contentType = null) {
    // If contentType is provided from API, use it directly
    if (contentType && ['gift-guide', 'educational', 'data-driven'].includes(contentType)) {
      return contentType;
    }
    
    const titleLower = title.toLowerCase();
    const contentLower = content?.toLowerCase() || '';

    // Check for specific content types FIRST (before generic gift detection)
    
    // Data-driven indicators (highest priority)
    if (titleLower.includes('statistics') ||
        titleLower.includes('data') ||
        titleLower.includes('survey') ||
        titleLower.includes('study') ||
        titleLower.includes('trends') ||
        titleLower.includes('research') ||
        contentLower.includes('%') ||
        contentLower.includes('percent')) {
      return 'data-driven';
    }

    // Educational indicators (second priority)
    if (titleLower.includes('how to') || 
        titleLower.includes('guide') ||
        titleLower.includes('tips') ||
        titleLower.includes('advice') ||
        titleLower.includes('choose') ||
        titleLower.includes('select') ||
        contentLower.includes('step') ||
        contentLower.includes('learn')) {
      return 'educational';
    }

    // Gift Guide indicators (default for gift-related content)
    if (titleLower.includes('gift') || 
        titleLower.includes('gifts') ||
        titleLower.includes('present') ||
        titleLower.includes('presents')) {
      return 'gift-guide';
    }

    return 'other';
  }

  /**
   * Check if a topic already exists
   */
  checkForDuplicates(topic, existingPosts) {
    const topicLower = topic.toLowerCase();
    
    for (const post of existingPosts) {
      const titleLower = post.title.toLowerCase();
      const similarity = this.calculateSimilarity(topicLower, titleLower);
      
      if (similarity > 0.7) { // 70% similarity threshold
        return {
          isDuplicate: true,
          existingPost: post,
          similarity: similarity
        };
      }
    }
    
    return { isDuplicate: false, similarity: 0 };
  }

  /**
   * Calculate similarity between two strings
   */
  calculateSimilarity(str1, str2) {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    
    const commonWords = words1.filter(word => 
      words2.some(word2 => word2.includes(word) || word.includes(word2))
    );
    
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  /**
   * Get content type recommendations based on existing content
   */
  getContentTypeRecommendations(analysis) {
    const recommendations = [];
    
    // Check for balance
    const total = analysis.total;
    
    if (total === 0) {
      // No existing content - recommend balanced approach
      recommendations.push(
        { type: 'gift-guide', priority: 'high', reason: 'No existing content - start with gift guides (40% target)' },
        { type: 'educational', priority: 'medium', reason: 'No existing content - add educational content (35% target)' },
        { type: 'data-driven', priority: 'high', reason: 'No existing content - add data-driven content (25% target)' }
      );
      return recommendations;
    }
    
    const giftGuidePercent = (analysis.byType['gift-guide'] / total) * 100;
    const educationalPercent = (analysis.byType['educational'] / total) * 100;
    const dataDrivenPercent = (analysis.byType['data-driven'] / total) * 100;

    // Ideal distribution: 40% gift guides, 35% educational, 25% data-driven
    if (giftGuidePercent < 35) {
      recommendations.push({
        type: 'gift-guide',
        priority: 'high',
        reason: `Only ${giftGuidePercent.toFixed(1)}% gift guides (target: 40%)`
      });
    }
    
    if (educationalPercent < 30) {
      recommendations.push({
        type: 'educational',
        priority: 'medium',
        reason: `Only ${educationalPercent.toFixed(1)}% educational (target: 35%)`
      });
    }
    
    if (dataDrivenPercent < 20) {
      recommendations.push({
        type: 'data-driven',
        priority: 'high',
        reason: `Only ${dataDrivenPercent.toFixed(1)}% data-driven (target: 25%)`
      });
    }

    return recommendations;
  }

  /**
   * Filter SEO topics to avoid duplicates and balance content types
   */
  async filterAndBalanceTopics(seoTopics, existingPosts) {
    const analysis = this.analyzeContentTypes(existingPosts);
    const recommendations = this.getContentTypeRecommendations(analysis);
    
    console.log(chalk.cyan('\n📊 Content Analysis:'));
    console.log(chalk.gray(`Total posts: ${analysis.total}`));
    
    if (analysis.total > 0) {
      console.log(chalk.gray(`Gift guides: ${analysis.byType['gift-guide']} (${((analysis.byType['gift-guide'] / analysis.total) * 100).toFixed(1)}%)`));
      console.log(chalk.gray(`Educational: ${analysis.byType['educational']} (${((analysis.byType['educational'] / analysis.total) * 100).toFixed(1)}%)`));
      console.log(chalk.gray(`Data-driven: ${analysis.byType['data-driven']} (${((analysis.byType['data-driven'] / analysis.total) * 100).toFixed(1)}%)`));
    } else {
      console.log(chalk.gray('No existing posts found - starting fresh!'));
    }

    if (recommendations.length > 0) {
      console.log(chalk.yellow('\n🎯 Content Type Recommendations:'));
      recommendations.forEach(rec => {
        console.log(chalk.yellow(`• ${rec.type.toUpperCase()}: ${rec.reason}`));
      });
    }

    // Filter out duplicates and categorize remaining topics
    const filteredTopics = [];
    
    for (const topic of seoTopics) {
      const duplicateCheck = this.checkForDuplicates(topic.title, existingPosts);
      
      if (!duplicateCheck.isDuplicate) {
        const contentType = this.categorizeContent(topic.title, '');
        filteredTopics.push({
          ...topic,
          contentType,
          isDuplicate: false
        });
      } else {
        console.log(chalk.red(`⚠️  Skipping duplicate: "${topic.title}" (${(duplicateCheck.similarity * 100).toFixed(1)}% similar to existing)`));
      }
    }

    return {
      filteredTopics,
      analysis,
      recommendations
    };
  }

  /**
   * Agent-specific method: Run content review and optimization for a specific blog post
   * @param {string} postId - Blog post identifier
   * @param {object} workflowState - Current workflow state
   */
  async runReviewAgent(postId, workflowState) {
    console.log(`🤖 ${this.agentName} starting work for ${postId}`);
    
    try {
      // Load blog content from previous agent
      const fs = require('fs').promises;
      const postDir = `content/blog-posts/${postId}`;
      const blogDraftPath = `${postDir}/blog-draft.md`;
      const seoResultsPath = `${postDir}/seo-results.json`;
      
      // Check if required files exist
      const blogDraft = await fs.readFile(blogDraftPath, 'utf8');
      const seoResults = JSON.parse(await fs.readFile(seoResultsPath, 'utf8'));
      
      // Run content review and optimization
      const reviewResults = await this.reviewAndOptimizeContent(blogDraft, seoResults);
      
      // Save optimized content
      await fs.writeFile(`${postDir}/blog-final.md`, reviewResults.optimizedContent);
      
      // Update workflow state
      const updatedState = await this.workflowTemplate.updateWorkflowState(postId, {
        current_phase: 'REVIEW_COMPLETE',
        next_agent: 'ImageAgent',
        agent_outputs: {
          ...workflowState.agent_outputs,
          [this.agentName]: 'blog-final.md'
        },
        review_notes: reviewResults.notes,
        optimization_score: reviewResults.score
      });

      console.log(`✅ ${this.agentName} completed work for ${postId}`);
      console.log(`   Optimization score: ${reviewResults.score}/100`);
      console.log(`   Next agent: ${updatedState.next_agent}`);
      
      return {
        success: true,
        postId,
        reviewResults,
        updatedState
      };
      
    } catch (error) {
      console.error(`❌ ${this.agentName} failed for ${postId}:`, error.message);
      
      // Update workflow state with error
      await this.workflowTemplate.updateWorkflowState(postId, {
        status: 'error',
        errors: [...(workflowState.errors || []), {
          agent: this.agentName,
          error: error.message,
          timestamp: new Date().toISOString()
        }]
      });
      
      return {
        success: false,
        postId,
        error: error.message
      };
    }
  }

  /**
   * Review and optimize blog content
   * @param {string} blogContent - Blog content to review
   * @param {object} seoResults - SEO research results
   */
  async reviewAndOptimizeContent(blogContent, seoResults) {
    console.log('🔍 Reviewing and optimizing blog content...');
    
    const review = {
      originalLength: blogContent.length,
      wordCount: blogContent.split(/\s+/).length,
      optimizationScore: 0,
      notes: [],
      optimizedContent: blogContent
    };

    // Check for SEO optimization
    const seoCheck = this.checkSEOOptimization(blogContent, seoResults);
    review.notes.push(...seoCheck.notes);
    review.optimizationScore += seoCheck.score;

    // Check for readability
    const readabilityCheck = this.checkReadability(blogContent);
    review.notes.push(...readabilityCheck.notes);
    review.optimizationScore += readabilityCheck.score;

    // Check for structure
    const structureCheck = this.checkStructure(blogContent);
    review.notes.push(...structureCheck.notes);
    review.optimizationScore += structureCheck.score;

    // Apply optimizations
    review.optimizedContent = this.applyOptimizations(blogContent, review.notes);
    
    return {
      score: Math.min(100, review.optimizationScore),
      notes: review.notes,
      optimizedContent: review.optimizedContent,
      originalWordCount: review.wordCount,
      optimizedWordCount: review.optimizedContent.split(/\s+/).length
    };
  }

  /**
   * Check SEO optimization
   */
  checkSEOOptimization(content, seoResults) {
    const notes = [];
    let score = 0;
    
    // Check for target keywords
    const targetKeywords = seoResults.keywordAnalysis?.map(k => k.keyword) || [];
    const foundKeywords = targetKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (foundKeywords.length > 0) {
      score += 30;
      notes.push(`✅ Found ${foundKeywords.length}/${targetKeywords.length} target keywords`);
    } else {
      notes.push(`⚠️ No target keywords found in content`);
    }

    // Check for proper headings
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    if (headings.length >= 3) {
      score += 20;
      notes.push(`✅ Found ${headings.length} headings for structure`);
    } else {
      notes.push(`⚠️ Need more headings for better structure`);
    }

    return { score, notes };
  }

  /**
   * Check readability
   */
  checkReadability(content) {
    const notes = [];
    let score = 0;
    
    // Check word count
    const wordCount = content.split(/\s+/).length;
    if (wordCount >= 1200) {
      score += 25;
      notes.push(`✅ Good word count: ${wordCount} words`);
    } else {
      notes.push(`⚠️ Consider adding more content (currently ${wordCount} words)`);
    }

    // Check for paragraphs
    const paragraphs = content.split(/\n\n/).length;
    if (paragraphs >= 5) {
      score += 15;
      notes.push(`✅ Good paragraph structure: ${paragraphs} paragraphs`);
    } else {
      notes.push(`⚠️ Consider breaking content into more paragraphs`);
    }

    return { score, notes };
  }

  /**
   * Check content structure
   */
  checkStructure(content) {
    const notes = [];
    let score = 0;
    
    // Check for introduction and conclusion
    if (content.toLowerCase().includes('introduction') || content.toLowerCase().includes('conclusion')) {
      score += 10;
      notes.push(`✅ Content has clear structure`);
    } else {
      notes.push(`⚠️ Consider adding clear introduction and conclusion`);
    }

    return { score, notes };
  }

  /**
   * Apply optimizations to content
   */
  applyOptimizations(content, notes) {
    let optimized = content;
    
    // Apply optimizations based on notes
    // This is a simplified version - in practice, you'd have more sophisticated optimization logic
    
    return optimized;
  }
}

module.exports = ContentChecker; 