const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const path = require('path');

// Import utilities
const { loadConfig } = require('../utils/config');
const { generateSEOTopics, analyzeKeywords, selectBestKeywords } = require('../../generators/seo');
const RealSEOGenerator = require('../../generators/seoReal');

const seoCommand = new Command('seo')
  .description('SEO keyword research and blog idea generation')
  .option('-d, --discover', 'Discover new SEO opportunities')
  .option('-a, --analyze <keywords>', 'Analyze specific keywords')
  .option('-g, --generate', 'Generate blog ideas from keywords')
  .option('-f, --file <file>', 'Load keywords from file')
  .action(async (options) => {
    const spinner = ora('Loading configuration...').start();
    
    try {
      // Load site configuration
      const config = await loadConfig();
      spinner.succeed('Configuration loaded');

      if (options.discover) {
        await discoverSEOOpportunities(config);
      } else if (options.analyze) {
        await analyzeSpecificKeywords(options.analyze, config);
      } else if (options.generate) {
        await generateBlogIdeas(config);
      } else if (options.file) {
        await analyzeKeywordsFromFile(options.file, config);
      } else {
        // Interactive mode
        await seoInteractive(config);
      }

    } catch (error) {
      spinner.fail('SEO command failed');
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Discover new SEO opportunities using real data
 */
async function discoverSEOOpportunities(config) {
  console.log(chalk.cyan('\n🔍 Real SEO Keyword Discovery\n'));
  
  const realSEO = new RealSEOGenerator();
  const spinner = ora('Starting real SEO analysis...').start();
  
  try {
    // Step 1: Generate SEO topics using real data
    spinner.text = 'Generating SEO topics with real data...';
    spinner.start();
    const topics = await realSEO.generateSEOTopics();
    spinner.succeed(`Generated ${topics.length} SEO topics`);
    
    // Step 2: Extract keywords from topics (limit to first 10 for testing)
    const allKeywords = topics.flatMap(topic => [
      topic.primaryKeyword,
      ...topic.secondaryKeywords
    ]).filter((keyword, index, arr) => arr.indexOf(keyword) === index).slice(0, 10); // Remove duplicates and limit
    
    console.log(chalk.green(`\n📊 Found ${allKeywords.length} unique keywords to analyze`));
    
    // Step 3: Analyze keywords with real SERP data
    spinner.text = 'Analyzing keywords with real SERP data...';
    spinner.start();
    const analyzedKeywords = await realSEO.analyzeKeywords(allKeywords);
    spinner.succeed(`Analyzed ${analyzedKeywords.length} keywords with real data`);
    
    // Step 4: Generate blog ideas from analysis
    spinner.text = 'Generating blog ideas from keyword analysis...';
    spinner.start();
    const blogIdeas = await realSEO.generateBlogIdeas(analyzedKeywords);
    spinner.succeed(`Generated ${blogIdeas.length} blog ideas`);
    
    // Step 5: Display results
    displayRealSEOResults(topics, analyzedKeywords, blogIdeas, config);
    
    // Step 6: Save results
    await saveRealSEOResults(topics, analyzedKeywords, blogIdeas, config);
    
  } catch (error) {
    spinner.fail('Real SEO discovery failed');
    throw error;
  }
}

/**
 * Analyze existing blog content
 */
async function analyzeExistingContent(config) {
  const contentDir = path.resolve(config.contentDir);
  const existingTopics = [];
  
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract frontmatter
      const matter = require('gray-matter');
      const { data } = matter(content);
      
      if (data.title) existingTopics.push(data.title);
      if (data.tags && Array.isArray(data.tags)) {
        existingTopics.push(...data.tags);
      }
      if (data.keywords && Array.isArray(data.keywords)) {
        existingTopics.push(...data.keywords);
      }
    }
  }
  
  // Remove duplicates
  return [...new Set(existingTopics)];
}

/**
 * Generate keywords for topics
 */
async function generateKeywordsForTopics(topics, config) {
  const allKeywords = [];
  
  for (const topic of topics) {
    try {
      const keywords = await generateKeywordsForTopic(topic, config);
      allKeywords.push(...keywords);
    } catch (error) {
      console.warn(chalk.yellow(`Failed to generate keywords for "${topic}": ${error.message}`));
    }
  }
  
  return allKeywords;
}

/**
 * Generate keywords for a single topic
 */
async function generateKeywordsForTopic(topic, config) {
  const prompt = `For the topic '${topic}', list 15 long-tail, buyer-intent search queries a user might Google. Focus on specific gift types, occasions, and demographics.

Requirements:
- Include buyer intent keywords (buy, purchase, shop, gift, present, order)
- Focus on specific demographics and occasions
- Include price-related terms (under $50, affordable, budget)
- Return as JSON array of strings

Example format:
["best gifts for coffee lovers under $30", "affordable birthday gifts for coworkers", "unique gifts for remote workers"]`;

  const env = require('../utils/config').getEnvConfig();
  
  if (!env.openai?.apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const OpenAI = require('openai');
  const openai = new OpenAI({
    apiKey: env.openai.apiKey
  });
  
  const response = await openai.chat.completions.create({
    model: env.openai.model || 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an SEO expert specializing in gift guide content. Generate long-tail keywords with buyer intent.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 1000,
    temperature: 0.7
  });
  
  const content = response.choices[0].message.content;
  
  try {
    // Clean up the response to extract JSON
    let jsonString = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
    
    const keywords = JSON.parse(jsonString);
    
    return keywords.map(keyword => ({
      keyword: keyword,
      topic: topic
    }));
    
  } catch (error) {
    throw new Error(`Failed to parse keywords: ${error.message}`);
  }
}

/**
 * Display SEO results
 */
function displaySEOResults(bestKeywords, config) {
  console.log(chalk.green('\n🎯 Top SEO Opportunities\n'));
  
  bestKeywords.forEach((kw, index) => {
    console.log(chalk.cyan(`${index + 1}. ${kw.keyword}`));
    console.log(chalk.gray(`   📊 Volume: ${kw.volume || 'N/A'}`));
    console.log(chalk.gray(`   🎯 Competition: ${kw.competition || 'N/A'}`));
    console.log(chalk.gray(`   💰 CPC: $${kw.cpc || 'N/A'}`));
    console.log(chalk.gray(`   📝 Suggested Title: ${kw.suggestedTitle || 'N/A'}`));
    console.log(chalk.gray(`   🎯 Score: ${kw.score || 'N/A'}`));
    console.log('');
  });
  
  console.log(chalk.yellow('💡 Tip: Use "brightgift seo --generate" to create blog posts from these keywords'));
}

/**
 * Save SEO results
 */
async function saveSEOResults(bestKeywords, config) {
  const seoDir = path.resolve('seo-results');
  if (!fs.existsSync(seoDir)) {
    fs.mkdirSync(seoDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filePath = path.join(seoDir, `seo-opportunities-${timestamp}.json`);
  
  const results = {
    generatedAt: new Date().toISOString(),
    keywords: bestKeywords,
    summary: {
      totalKeywords: bestKeywords.length,
      averageVolume: bestKeywords.reduce((sum, kw) => sum + (kw.volume || 0), 0) / bestKeywords.length,
      averageCompetition: bestKeywords.reduce((sum, kw) => sum + (kw.competition || 0), 0) / bestKeywords.length
    }
  };
  
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  console.log(chalk.green(`✅ SEO results saved to: ${filePath}`));
}

/**
 * Display real SEO results
 */
function displayRealSEOResults(topics, analyzedKeywords, blogIdeas, config) {
  console.log(chalk.cyan.bold('\n🎯 Real SEO Analysis Results\n'));
  
  // Display top topics
  console.log(chalk.green.bold('📝 Top SEO Topics:'));
  topics.slice(0, 5).forEach((topic, index) => {
    console.log(chalk.green(`${index + 1}. ${topic.title}`));
    console.log(chalk.gray(`   Primary: ${topic.primaryKeyword} | Volume: ${topic.searchVolume} | Competition: ${topic.competitionLevel}`));
    console.log(chalk.gray(`   Audience: ${topic.targetAudience}`));
    console.log('');
  });
  
  // Display top keywords
  console.log(chalk.blue.bold('🔍 Top Keywords by Opportunity:'));
  const topKeywords = analyzedKeywords
    .filter(k => !k.error && k.difficulty < 70)
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(0, 5);
    
  topKeywords.forEach((keyword, index) => {
    console.log(chalk.blue(`${index + 1}. ${keyword.keyword}`));
    console.log(chalk.gray(`   Volume: ${keyword.searchVolume} | Difficulty: ${keyword.difficulty}/100 | Competition: ${keyword.competition.competitionLevel}`));
    console.log(chalk.gray(`   Opportunities: ${keyword.opportunities.join(', ')}`));
    console.log('');
  });
  
  // Display blog ideas
  console.log(chalk.yellow.bold('💡 Generated Blog Ideas:'));
  if (blogIdeas && blogIdeas.length > 0) {
    blogIdeas.forEach((idea, index) => {
      console.log(chalk.yellow(`${index + 1}. ${idea.Title || idea.title || 'Untitled'}`));
      console.log(chalk.gray(`   Target: ${idea['Target Keyword'] || idea['Target keyword'] || idea.targetKeyword || 'N/A'}`));
      console.log(chalk.gray(`   Word Count: ${idea['Estimated Word Count'] || idea['Estimated word count'] || idea.estimatedWordCount || 'N/A'}`));
      console.log(chalk.gray(`   Affiliate: ${Array.isArray(idea['Affiliate Opportunities']) ? idea['Affiliate Opportunities'].join(', ') : Array.isArray(idea['Affiliate opportunities']) ? idea['Affiliate opportunities'].join(', ') : idea.affiliateOpportunities || 'N/A'}`));
      console.log('');
    });
  } else {
    console.log(chalk.gray('   No blog ideas generated (likely due to SerpAPI errors)'));
    console.log('');
  }
}

/**
 * Save real SEO results
 */
async function saveRealSEOResults(topics, analyzedKeywords, blogIdeas, config) {
  const seoDir = path.resolve('seo-results');
  if (!fs.existsSync(seoDir)) {
    fs.mkdirSync(seoDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filePath = path.join(seoDir, `real-seo-analysis-${timestamp}.json`);
  
  const results = {
    generatedAt: new Date().toISOString(),
    topics: topics,
    analyzedKeywords: analyzedKeywords,
    blogIdeas: blogIdeas,
    summary: {
      totalTopics: topics.length,
      totalKeywords: analyzedKeywords.length,
      totalBlogIdeas: blogIdeas.length,
      successfulAnalyses: analyzedKeywords.filter(k => !k.error).length,
      topOpportunities: analyzedKeywords
        .filter(k => !k.error && k.difficulty < 70)
        .slice(0, 10)
        .map(k => k.keyword)
    }
  };
  
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  console.log(chalk.green(`✅ Real SEO results saved to: ${filePath}`));
}

/**
 * Analyze specific keywords using real data
 */
async function analyzeSpecificKeywords(keywords, config) {
  const keywordList = keywords.split(',').map(k => k.trim());
  
  console.log(chalk.cyan(`\n🔍 Real SEO Analysis for ${keywordList.length} keywords...\n`));
  
  const realSEO = new RealSEOGenerator();
  const spinner = ora('Analyzing keywords with real SERP data...').start();
  
  try {
    const analyzedKeywords = await realSEO.analyzeKeywords(keywordList);
    spinner.succeed('Real analysis complete');
    
    // Display results in a format similar to the old system
    console.log(chalk.cyan.bold('\n🎯 Real SEO Analysis Results\n'));
    
    analyzedKeywords.forEach((kw, index) => {
      if (kw.error) {
        console.log(chalk.red(`${index + 1}. ${kw.keyword} - ERROR: ${kw.error}`));
      } else {
        console.log(chalk.green(`${index + 1}. ${kw.keyword}`));
        console.log(chalk.gray(`   📊 Volume: ${kw.searchVolume} | Difficulty: ${kw.difficulty}/100 | Competition: ${kw.competition.competitionLevel}`));
        console.log(chalk.gray(`   🎯 Opportunities: ${kw.opportunities.join(', ')}`));
        console.log('');
      }
    });
    
  } catch (error) {
    spinner.fail('Real analysis failed');
    throw error;
  }
}

/**
 * Generate blog ideas from keywords
 */
async function generateBlogIdeas(config) {
  console.log(chalk.cyan('\n📝 Blog Idea Generation\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'source',
      message: 'Where should I get keywords from?',
      choices: [
        { name: 'Latest SEO results', value: 'latest' },
        { name: 'Specific file', value: 'file' },
        { name: 'Enter manually', value: 'manual' }
      ]
    }
  ]);
  
  let keywords = [];
  
  if (answers.source === 'latest') {
    // Load latest SEO results
    const seoDir = path.resolve('seo-results');
    if (fs.existsSync(seoDir)) {
      const files = fs.readdirSync(seoDir)
        .filter(file => file.startsWith('seo-opportunities-'))
        .sort()
        .reverse();
      
      if (files.length > 0) {
        const latestFile = path.join(seoDir, files[0]);
        const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
        keywords = data.keywords.slice(0, 5); // Top 5 keywords
      }
    }
  } else if (answers.source === 'file') {
    const fileAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Enter the path to your keywords file:',
        validate: (input) => fs.existsSync(input) ? true : 'File not found'
      }
    ]);
    
    const data = JSON.parse(fs.readFileSync(fileAnswer.filePath, 'utf8'));
    keywords = data.keywords || data;
  } else {
    const manualAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'keywords',
        message: 'Enter keywords (comma-separated):',
        validate: (input) => input.trim().length > 0 ? true : 'Keywords are required'
      }
    ]);
    
    keywords = manualAnswer.keywords.split(',').map(k => ({ keyword: k.trim() }));
  }
  
  if (keywords.length === 0) {
    console.log(chalk.yellow('No keywords found. Run "brightgift seo --discover" first.'));
    return;
  }
  
  console.log(chalk.green(`\n📝 Generating blog ideas for ${keywords.length} keywords...\n`));
  
  for (const kw of keywords.slice(0, 3)) { // Limit to top 3
    console.log(chalk.cyan(`🎯 Keyword: ${kw.keyword}`));
    
    const blogIdeas = await generateBlogIdeasForKeyword(kw.keyword, config);
    
    blogIdeas.forEach((idea, index) => {
      console.log(chalk.gray(`   ${index + 1}. ${idea.title}`));
      console.log(chalk.gray(`      Type: ${idea.type}`));
      console.log(chalk.gray(`      Description: ${idea.description}`));
      console.log('');
    });
  }
}

/**
 * Generate blog ideas for a keyword
 */
async function generateBlogIdeasForKeyword(keyword, config) {
  const prompt = `Generate 3 blog post ideas for the keyword: "${keyword}"

For each idea, provide:
- Title (SEO-optimized)
- Content type (gift-guide, educational, data-driven)
- Brief description
- Target audience

Return as JSON array with this structure:
[
  {
    "title": "SEO-optimized title",
    "type": "gift-guide",
    "description": "Brief description",
    "audience": "Target audience"
  }
]`;

  const { getEnvConfig } = require('../utils/config');
  const env = getEnvConfig();
  
  if (!env.openai?.apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const OpenAI = require('openai');
  const openai = new OpenAI({
    apiKey: env.openai.apiKey
  });
  
  const response = await openai.chat.completions.create({
    model: env.openai.model || 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert content strategist specializing in gift guides and lifestyle content.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 800,
    temperature: 0.7
  });
  
  const content = response.choices[0].message.content;
  
  try {
    let jsonString = content.trim();
    
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
    
    return JSON.parse(jsonString);
    
  } catch (error) {
    throw new Error(`Failed to parse blog ideas: ${error.message}`);
  }
}

/**
 * Analyze keywords from file
 */
async function analyzeKeywordsFromFile(filePath, config) {
  console.log(chalk.cyan(`\n📁 Analyzing keywords from: ${filePath}\n`));
  
  const spinner = ora('Loading keywords...').start();
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keywords = data.keywords || data;
    
    spinner.succeed(`Loaded ${keywords.length} keywords`);
    
    const analyzedKeywords = await analyzeKeywords(keywords, config);
    displaySEOResults(analyzedKeywords, config);
    
  } catch (error) {
    spinner.fail('Analysis failed');
    throw error;
  }
}

/**
 * Interactive SEO mode
 */
async function seoInteractive(config) {
  console.log(chalk.cyan('\n🔍 SEO Keyword Research\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Discover New SEO Opportunities', value: 'discover' },
        { name: 'Analyze Specific Keywords', value: 'analyze' },
        { name: 'Generate Blog Ideas', value: 'generate' },
        { name: 'View Latest Results', value: 'view' },
        { name: 'Exit', value: 'exit' }
      ]
    }
  ]);

  switch (answers.action) {
    case 'discover':
      await discoverSEOOpportunities(config);
      break;
    case 'analyze':
      const keywordAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'keywords',
          message: 'Enter keywords to analyze (comma-separated):',
          validate: (input) => input.trim().length > 0 ? true : 'Keywords are required'
        }
      ]);
      await analyzeSpecificKeywords(keywordAnswer.keywords, config);
      break;
    case 'generate':
      await generateBlogIdeas(config);
      break;
    case 'view':
      await viewLatestResults();
      break;
    case 'exit':
      console.log(chalk.green('\n👋 SEO research complete!'));
      return;
  }

  // Ask if user wants to continue
  const continueAction = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: 'Would you like to perform another SEO action?',
      default: false
    }
  ]);

  if (continueAction.continue) {
    await seoInteractive(config);
  }
}

/**
 * View latest SEO results
 */
async function viewLatestResults() {
  const seoDir = path.resolve('seo-results');
  
  if (!fs.existsSync(seoDir)) {
    console.log(chalk.yellow('No SEO results found. Run "brightgift seo --discover" first.'));
    return;
  }
  
  const files = fs.readdirSync(seoDir)
    .filter(file => file.startsWith('seo-opportunities-'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.log(chalk.yellow('No SEO results found. Run "brightgift seo --discover" first.'));
    return;
  }
  
  const latestFile = path.join(seoDir, files[0]);
  const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
  
  console.log(chalk.cyan(`\n📊 Latest SEO Results (${data.generatedAt.split('T')[0]})\n`));
  displaySEOResults(data.keywords.slice(0, 5), {}); // Show top 5
}

module.exports = seoCommand; 