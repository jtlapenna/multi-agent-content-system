#!/usr/bin/env node

/**
 * Hybrid Blog Generation CLI Command
 * Demonstrates GPT-4 + Cursor Agent workflow
 */

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const HybridBlogGenerator = require('../../generators/blogHybrid');
const path = require('path');
const fs = require('fs').promises;

const program = new Command();

program
  .name('blog-hybrid')
  .description('Generate blog posts using hybrid GPT-4 + Cursor Agent approach')
  .option('-d, --discover', 'Generate blog from latest SEO discovery')
  .option('-f, --file <path>', 'Generate blog from specific SEO results file')
  .option('-i, --interactive', 'Interactive blog generation mode')
  .action(async (options) => {
    try {
      const generator = new HybridBlogGenerator();
      
      if (options.interactive) {
        await interactiveMode(generator);
      } else if (options.discover) {
        await generateFromLatestDiscovery(generator);
      } else if (options.file) {
        await generateFromFile(generator, options.file);
      } else {
        await interactiveMode(generator);
      }
      
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

/**
 * Interactive blog generation mode
 */
async function interactiveMode(generator) {
  console.log(chalk.cyan.bold('\n🚀 Hybrid Blog Generation - Interactive Mode'));
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'source',
      message: 'Where should I get the blog idea from?',
      choices: [
        { name: 'Latest SEO discovery results', value: 'latest' },
        { name: 'Specific SEO results file', value: 'file' },
        { name: 'Enter blog idea manually', value: 'manual' }
      ]
    }
  ]);
  
  if (answers.source === 'latest') {
    await generateFromLatestDiscovery(generator);
  } else if (answers.source === 'file') {
    const fileAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Enter the path to your SEO results file:',
        validate: (input) => {
          try {
            return fs.access(input).then(() => true).catch(() => 'File not found');
          } catch {
            return 'Invalid file path';
          }
        }
      }
    ]);
    await generateFromFile(generator, fileAnswer.filePath);
  } else {
    await generateManualBlog(generator);
  }
}

/**
 * Generate blog from latest SEO discovery
 */
async function generateFromLatestDiscovery(generator) {
  console.log(chalk.cyan('\n📊 Loading latest SEO discovery results...'));
  
  const seoDir = path.resolve('seo-results');
  const files = await fs.readdir(seoDir);
  const latestFile = files
    .filter(file => file.startsWith('real-seo-analysis-'))
    .sort()
    .reverse()[0];
  
  if (!latestFile) {
    throw new Error('No SEO discovery results found. Run "npm start seo -- --discover" first.');
  }
  
  const filePath = path.join(seoDir, latestFile);
  await generateFromFile(generator, filePath);
}

/**
 * Generate blog from specific SEO results file
 */
async function generateFromFile(generator, filePath) {
  console.log(chalk.cyan(`\n📄 Loading SEO results from: ${filePath}`));
  
  const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
  
  if (!data.blogIdeas || data.blogIdeas.length === 0) {
    throw new Error('No blog ideas found in the SEO results file.');
  }
  
  // Let user choose which blog idea to generate
  const choices = data.blogIdeas.map((idea, index) => ({
    name: `${index + 1}. ${idea.Title}`,
    value: index
  }));
  
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'blogIndex',
      message: 'Which blog idea would you like to generate?',
      choices
    }
  ]);
  
  const selectedBlog = data.blogIdeas[answer.blogIndex];
  const keywords = data.analyzedKeywords?.[0] || {};
  
  console.log(chalk.green(`\n🎯 Selected: ${selectedBlog.Title}`));
  
  // Generate the blog post
  await generator.generateCompleteBlog(data, keywords, selectedBlog);
}

/**
 * Generate blog with manual input
 */
async function generateManualBlog(generator) {
  console.log(chalk.cyan('\n✍️  Manual Blog Generation'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Blog post title:',
      validate: (input) => input.trim().length > 0 ? true : 'Title is required'
    },
    {
      type: 'input',
      name: 'targetKeyword',
      message: 'Target keyword:',
      validate: (input) => input.trim().length > 0 ? true : 'Target keyword is required'
    },
    {
      type: 'number',
      name: 'wordCount',
      message: 'Estimated word count:',
      default: 1500
    },
    {
      type: 'input',
      name: 'outline',
      message: 'Content outline (comma-separated):',
      default: 'Introduction, Main content, Conclusion'
    }
  ]);
  
  const blogIdea = {
    Title: answers.title,
    'Target Keyword': answers.targetKeyword,
    'Estimated Word Count': answers.wordCount,
    'Content Outline': answers.outline.split(',').map(item => item.trim()),
    'Affiliate Opportunities': ['Amazon affiliate links', 'Product recommendations']
  };
  
  const seoData = {
    analyzedKeywords: [{
      keyword: answers.targetKeyword,
      searchVolume: 'MEDIUM',
      competition: 'MEDIUM',
      difficulty: 70
    }]
  };
  
  console.log(chalk.green(`\n🎯 Generating: ${answers.title}`));
  
  // Generate the blog post
  await generator.generateCompleteBlog(seoData, seoData.analyzedKeywords[0], blogIdea);
}

module.exports = program; 