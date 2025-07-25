/**
 * Keyword Bank System
 * Manages high-potential keywords for future content generation
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class KeywordBank {
  constructor() {
    this.bankFile = path.resolve('seo-results', 'keyword-bank.json');
    this.ensureBankExists();
  }

  /**
   * Ensure keyword bank file exists
   */
  ensureBankExists() {
    const dir = path.dirname(this.bankFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(this.bankFile)) {
      const initialBank = {
        keywords: [],
        topics: [],
        lastUpdated: new Date().toISOString(),
        stats: {
          totalKeywords: 0,
          totalTopics: 0,
          averageScore: 0
        }
      };
      fs.writeFileSync(this.bankFile, JSON.stringify(initialBank, null, 2));
    }
  }

  /**
   * Load keyword bank
   */
  loadBank() {
    try {
      const data = fs.readFileSync(this.bankFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log(chalk.yellow('Warning: Could not load keyword bank, creating new one'));
      return {
        keywords: [],
        topics: [],
        lastUpdated: new Date().toISOString(),
        stats: {
          totalKeywords: 0,
          totalTopics: 0,
          averageScore: 0
        }
      };
    }
  }

  /**
   * Save keyword bank
   */
  saveBank(bank) {
    try {
      bank.lastUpdated = new Date().toISOString();
      bank.stats = this.calculateStats(bank);
      fs.writeFileSync(this.bankFile, JSON.stringify(bank, null, 2));
      return true;
    } catch (error) {
      console.log(chalk.red('Error saving keyword bank:'), error.message);
      return false;
    }
  }

  /**
   * Calculate bank statistics
   */
  calculateStats(bank) {
    const totalKeywords = bank.keywords.length;
    const totalTopics = bank.topics.length;
    const averageScore = totalKeywords > 0 
      ? bank.keywords.reduce((sum, k) => sum + (k.opportunityScore || 0), 0) / totalKeywords 
      : 0;

    return {
      totalKeywords,
      totalTopics,
      averageScore: Math.round(averageScore * 100) / 100
    };
  }

  /**
   * Add keywords to bank
   */
  addKeywords(newKeywords, source = 'keyword-research') {
    const bank = this.loadBank();
    const added = [];
    const skipped = [];

    newKeywords.forEach(keyword => {
      // Check if keyword already exists
      const exists = bank.keywords.some(k => k.keyword === keyword.keyword);
      
      if (!exists) {
        const keywordEntry = {
          ...keyword,
          addedAt: new Date().toISOString(),
          source: source,
          used: false,
          usedAt: null
        };
        bank.keywords.push(keywordEntry);
        added.push(keyword.keyword);
      } else {
        skipped.push(keyword.keyword);
      }
    });

    // Sort by opportunity score (highest first)
    bank.keywords.sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0));

    this.saveBank(bank);

    return { added, skipped, total: bank.keywords.length };
  }

  /**
   * Add topics to bank
   */
  addTopics(newTopics, source = 'keyword-research') {
    const bank = this.loadBank();
    const added = [];
    const skipped = [];

    newTopics.forEach(topic => {
      // Check if topic already exists (by title)
      const exists = bank.topics.some(t => t.title === topic.title);
      
      if (!exists) {
        const topicEntry = {
          ...topic,
          addedAt: new Date().toISOString(),
          source: source,
          used: false,
          usedAt: null
        };
        bank.topics.push(topicEntry);
        added.push(topic.title);
      } else {
        skipped.push(topic.title);
      }
    });

    this.saveBank(bank);

    return { added, skipped, total: bank.topics.length };
  }

  /**
   * Get unused keywords from bank
   */
  getUnusedKeywords(limit = 10, minScore = 0) {
    const bank = this.loadBank();
    return bank.keywords
      .filter(k => !k.used && (k.opportunityScore || 0) >= minScore)
      .slice(0, limit);
  }

  /**
   * Get unused topics from bank
   */
  getUnusedTopics(limit = 5, contentType = null) {
    const bank = this.loadBank();
    let topics = bank.topics.filter(t => !t.used);
    
    if (contentType) {
      topics = topics.filter(t => t.contentType === contentType);
    }
    
    return topics.slice(0, limit);
  }

  /**
   * Mark keyword as used
   */
  markKeywordUsed(keyword, usedAt = new Date().toISOString()) {
    const bank = this.loadBank();
    const keywordEntry = bank.keywords.find(k => k.keyword === keyword);
    
    if (keywordEntry) {
      keywordEntry.used = true;
      keywordEntry.usedAt = usedAt;
      this.saveBank(bank);
      return true;
    }
    
    return false;
  }

  /**
   * Mark topic as used
   */
  markTopicUsed(title, usedAt = new Date().toISOString()) {
    const bank = this.loadBank();
    const topicEntry = bank.topics.find(t => t.title === title);
    
    if (topicEntry) {
      topicEntry.used = true;
      topicEntry.usedAt = usedAt;
      this.saveBank(bank);
      return true;
    }
    
    return false;
  }

  /**
   * Display bank statistics
   */
  displayStats() {
    const bank = this.loadBank();
    const stats = bank.stats;
    
    console.log(chalk.cyan('\n🏦 Keyword Bank Statistics:'));
    console.log(chalk.gray('='.repeat(40)));
    console.log(chalk.gray(`Total Keywords: ${stats.totalKeywords}`));
    console.log(chalk.gray(`Total Topics: ${stats.totalTopics}`));
    console.log(chalk.gray(`Average Score: ${stats.averageScore}`));
    console.log(chalk.gray(`Last Updated: ${new Date(bank.lastUpdated).toLocaleDateString()}`));
    
    // Show unused counts
    const unusedKeywords = bank.keywords.filter(k => !k.used).length;
    const unusedTopics = bank.topics.filter(t => !t.used).length;
    
    console.log(chalk.green(`\n📊 Available for Use:`));
    console.log(chalk.gray(`Unused Keywords: ${unusedKeywords}`));
    console.log(chalk.gray(`Unused Topics: ${unusedTopics}`));
    
    // Show top unused keywords
    const topUnused = bank.keywords
      .filter(k => !k.used)
      .slice(0, 5);
    
    if (topUnused.length > 0) {
      console.log(chalk.yellow('\n🎯 Top Unused Keywords:'));
      topUnused.forEach((keyword, index) => {
        console.log(chalk.white(`${index + 1}. ${keyword.keyword} (Score: ${keyword.opportunityScore})`));
      });
    }
  }

  /**
   * Search bank for keywords
   */
  searchKeywords(query, limit = 10) {
    const bank = this.loadBank();
    const searchTerm = query.toLowerCase();
    
    return bank.keywords
      .filter(k => 
        k.keyword.toLowerCase().includes(searchTerm) ||
        k.opportunities.some(o => o.toLowerCase().includes(searchTerm))
      )
      .slice(0, limit);
  }

  /**
   * Get keywords by content type
   */
  getKeywordsByType(contentType, limit = 10) {
    const bank = this.loadBank();
    
    // Find topics of this type and get their primary keywords
    const topicsOfType = bank.topics.filter(t => t.contentType === contentType);
    const keywordsOfType = topicsOfType.map(t => t.primaryKeyword);
    
    return bank.keywords
      .filter(k => keywordsOfType.includes(k.keyword))
      .slice(0, limit);
  }

  /**
   * Export bank data
   */
  exportBank(format = 'json') {
    const bank = this.loadBank();
    
    if (format === 'csv') {
      // Convert to CSV format
      const csvKeywords = bank.keywords.map(k => 
        `${k.keyword},${k.opportunityScore},${k.searchVolume},${k.competition},${k.used}`
      ).join('\n');
      
      const csvTopics = bank.topics.map(t => 
        `${t.title},${t.contentType},${t.primaryKeyword},${t.used}`
      ).join('\n');
      
      return {
        keywords: `keyword,score,volume,competition,used\n${csvKeywords}`,
        topics: `title,type,primaryKeyword,used\n${csvTopics}`
      };
    }
    
    return bank;
  }
}

module.exports = KeywordBank; 