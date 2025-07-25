/**
 * Content Checker Utility
 * Checks existing content from main site API to avoid duplicates
 */

const https = require('https');
const chalk = require('chalk');

class ContentChecker {
  constructor() {
    // Load site configuration
    const siteConfig = require('../../config/sites/bright-gift.json');
    this.mainSiteUrl = `https://${siteConfig.domain}`;
    this.apiEndpoint = `${this.mainSiteUrl}/api/blog-posts`;
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
}

module.exports = ContentChecker; 