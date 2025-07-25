#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

const execAsync = promisify(exec);

class CursorWorkflowManager {
  constructor() {
    this.workflowRoot = path.join(process.cwd(), 'workflow');
    this.stages = [
      '01-seo-research',
      '02-blog-ideas',
      '03-blog-prompts',
      '04-blog-content',
      '05-content-review',
      '06-image-prompts',
      '07-image-generation',
      '08-social-posts',
      '09-preview-publish'
    ];
  }

  async initialize() {
    console.log(chalk.blue.bold('🚀 Initializing Cursor Workflow System...'));
    
    try {
      // Create workflow root directory
      await fs.mkdir(this.workflowRoot, { recursive: true });
      
      // Create stage directories
      for (const stage of this.stages) {
        const stagePath = path.join(this.workflowRoot, stage);
        await fs.mkdir(stagePath, { recursive: true });
        
        // Create subdirectories for each stage
        await this.createStageSubdirectories(stagePath, stage);
      }
      
      // Create workflow configuration
      await this.createWorkflowConfig();
      
      // Create Cursor rules file
      await this.createCursorRules();
      
      console.log(chalk.green('✅ Workflow system initialized successfully!'));
      console.log(chalk.yellow('📁 Workflow directory created at:'), this.workflowRoot);
      
    } catch (error) {
      console.error(chalk.red('❌ Error initializing workflow:'), error.message);
      throw error;
    }
  }

  async createStageSubdirectories(stagePath, stage) {
    const subdirs = {
      '01-seo-research': ['pending', 'processing', 'completed', 'failed'],
      '02-blog-ideas': ['pending', 'processing', 'completed', 'failed'],
      '03-blog-prompts': ['pending', 'processing', 'completed', 'failed'],
      '04-blog-content': ['pending', 'processing', 'completed', 'failed'],
      '05-content-review': ['pending', 'processing', 'completed', 'failed'],
      '06-image-prompts': ['pending', 'processing', 'completed', 'failed'],
      '07-image-generation': ['pending', 'processing', 'completed', 'failed'],
      '08-social-posts': ['pending', 'processing', 'completed', 'failed'],
      '09-preview-publish': ['pending', 'processing', 'completed', 'failed']
    };

    for (const subdir of subdirs[stage] || []) {
      await fs.mkdir(path.join(stagePath, subdir), { recursive: true });
    }
  }

  async createWorkflowConfig() {
    const config = {
      workflow: {
        name: 'BrightGift Content Automation',
        version: '2.0.0',
        description: 'Cursor-integrated content automation workflow',
        stages: this.stages,
        settings: {
          autoProcess: true,
          maxConcurrent: 2,
          retryAttempts: 3,
          timeoutMinutes: 30
        }
      },
      cursor: {
        enabled: true,
        rulesFile: '.cursorrules',
        autoReview: true,
        qualityChecks: true
      },
      integrations: {
        openai: {
          enabled: true,
          models: ['gpt-4', 'gpt-3.5-turbo']
        },
        github: {
          enabled: true,
          autoCommit: true,
          branchPrefix: 'content/'
        },
        cloudflare: {
          enabled: true,
          previewDomain: 'brightgift-preview.pages.dev'
        },
        pinterest: {
          enabled: true,
          boardName: 'BrightGift Blog Posts'
        }
      }
    };

    const configPath = path.join(this.workflowRoot, 'workflow-config.json');
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  }

  async createCursorRules() {
    const rules = `# BrightGift Content Automation - Cursor Rules

## Workflow Overview
This project uses a folder-based workflow system for content automation with Cursor AI integration.

## Stage Processing Rules

### 01-seo-research/ (External API)
- Monitor: pending/*.json
- Action: SERP API keyword research with fallback
- Output: Move to processing/ then completed/

### 02-blog-ideas/ (Cursor AI)
- Monitor: pending/*.json
- Action: Generate blog ideas from SEO research data
- Output: Move to processing/ then completed/

### 03-blog-prompts/ (Cursor AI)
- Monitor: pending/*.json
- Action: Create detailed prompts for blog content generation
- Output: Move to processing/ then completed/

### 04-blog-content/ (Cursor AI)
- Monitor: pending/*.json
- Action: Generate full blog content using local AI
- Output: Move to processing/ then completed/

### 05-content-review/ (Cursor AI)
- Monitor: pending/*.md
- Action: Review content quality, SEO, and style
- Output: Move to processing/ then completed/

### 06-image-prompts/ (Cursor AI)
- Monitor: pending/*.json
- Action: Generate image prompts for GPT Image 1 API
- Output: Move to processing/ then completed/

### 07-image-generation/ (External API)
- Monitor: pending/*.json
- Action: Generate images using GPT Image 1 API with optimization
- Output: Move to processing/ then completed/

### 08-social-posts/ (Cursor AI)
- Monitor: pending/*.json
- Action: Generate social media posts (Facebook, Twitter, Instagram, Pinterest, Bluesky)
- Output: Move to processing/ then completed/

### 09-preview-publish/ (External APIs)
- Monitor: pending/*.json
- Action: Cloudflare deployment and GitHub PR creation
- Output: Move to processing/ then completed/

## Content Guidelines
- Follow BrightGift brand voice and style
- Ensure SEO optimization
- Include relevant internal links
- Optimize for Pinterest with vertical images
- Maintain consistent formatting

## File Naming Conventions
- Use kebab-case for all files
- Include date prefix: YYYY-MM-DD-
- Include content type suffix: -blog, -image, -social

## Quality Standards
- Minimum 1500 words for blog posts
- Include meta descriptions
- Optimize for target keywords
- Ensure mobile-friendly formatting
- Include call-to-action elements

## Cursor AI Processing Instructions
- Use local AI for all content generation tasks
- Focus on quality and brand consistency
- Optimize for SEO and user engagement
- Generate platform-specific content for social media
- Create detailed, actionable content
`;

    const rulesPath = path.join(process.cwd(), '.cursorrules');
    await fs.writeFile(rulesPath, rules);
  }

  async startWorkflow() {
    console.log(chalk.blue.bold('🔄 Starting Cursor Workflow...'));
    
    try {
      // Check if workflow is initialized
      if (!await this.isWorkflowInitialized()) {
        console.log(chalk.yellow('⚠️  Workflow not initialized. Running initialization...'));
        await this.initialize();
      }

      // Start the workflow monitor
      await this.startWorkflowMonitor();
      
    } catch (error) {
      console.error(chalk.red('❌ Error starting workflow:'), error.message);
      throw error;
    }
  }

  async isWorkflowInitialized() {
    try {
      await fs.access(this.workflowRoot);
      return true;
    } catch {
      return false;
    }
  }

  async startWorkflowMonitor() {
    console.log(chalk.green('✅ Workflow monitor started'));
    console.log(chalk.yellow('📁 Monitoring workflow stages for new files...'));
    console.log(chalk.cyan('💡 Use Ctrl+C to stop the monitor'));
    
    // Start monitoring each stage
    for (const stage of this.stages) {
      this.monitorStage(stage);
    }
  }

  async monitorStage(stage) {
    const stagePath = path.join(this.workflowRoot, stage, 'pending');
    
    // Check for existing files
    try {
      const files = await fs.readdir(stagePath);
      for (const file of files) {
        if (file.endsWith('.json') || file.endsWith('.md')) {
          await this.processFile(stage, file);
        }
      }
    } catch (error) {
      // Directory might not exist yet
    }
  }

  async processFile(stage, filename) {
    const spinner = ora(`Processing ${filename} in ${stage}...`).start();
    
    try {
      // Move file to processing
      const pendingPath = path.join(this.workflowRoot, stage, 'pending', filename);
      const processingPath = path.join(this.workflowRoot, stage, 'processing', filename);
      
      await fs.rename(pendingPath, processingPath);
      
      // Process based on stage
      await this.executeStageProcessor(stage, processingPath);
      
      // Move to completed
      const completedPath = path.join(this.workflowRoot, stage, 'completed', filename);
      await fs.rename(processingPath, completedPath);
      
      spinner.succeed(`✅ ${filename} processed successfully in ${stage}`);
      
      // Trigger next stage if applicable
      await this.triggerNextStage(stage, filename);
      
    } catch (error) {
      spinner.fail(`❌ Error processing ${filename} in ${stage}: ${error.message}`);
      
      // Move to failed
      const failedPath = path.join(this.workflowRoot, stage, 'failed', filename);
      await fs.rename(processingPath, failedPath);
    }
  }

  async executeStageProcessor(stage, filePath) {
    try {
      switch (stage) {
        case '01-seo-research':
          // External API: SERP API with fallback
          const SEOResearchProcessor = require('../../processors/seoResearchProcessor');
          const seoProcessor = new SEOResearchProcessor();
          await seoProcessor.process(filePath);
          break;
          
        case '02-blog-ideas':
          // Cursor AI: Generate blog ideas from SEO research
          await this.createCursorTrigger(filePath, 'blog-ideas');
          break;
          
        case '03-blog-prompts':
          // Cursor AI: Create detailed prompts for content generation
          await this.createCursorTrigger(filePath, 'blog-prompts');
          break;
          
        case '04-blog-content':
          // Cursor AI: Generate full blog content
          await this.createCursorTrigger(filePath, 'blog-content');
          break;
          
        case '05-content-review':
          // Cursor AI: Review and optimize content
          await this.createCursorTrigger(filePath, 'content-review');
          break;
          
        case '06-image-prompts':
          // Cursor AI: Generate image prompts for GPT Image 1
          await this.createCursorTrigger(filePath, 'image-prompts');
          break;
          
        case '07-image-generation':
          // External API: GPT Image 1 with optimization
          const ImageGenerationProcessor = require('../../processors/imageGenerationProcessor');
          const imageProcessor = new ImageGenerationProcessor();
          await imageProcessor.process(filePath);
          break;
          
        case '08-social-posts':
          // Cursor AI: Generate social posts (Facebook, Twitter, Instagram, Pinterest, Bluesky)
          await this.createCursorTrigger(filePath, 'social-posts');
          break;
          
        case '09-preview-publish':
          // External APIs: Cloudflare deployment and GitHub PR
          const PreviewPublishProcessor = require('../../processors/previewPublishProcessor');
          const publishProcessor = new PreviewPublishProcessor();
          await publishProcessor.process(filePath);
          break;
          
        default:
          console.log(chalk.yellow(`⚠️  No processor found for stage: ${stage}`));
          // Simulate processing for unknown stages
          await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(chalk.red(`❌ Stage processor error: ${error.message}`));
      throw error;
    }
  }

  async createCursorTrigger(filePath, triggerType) {
    // Create a trigger file that Cursor can monitor
    const triggerData = {
      triggerType: triggerType,
      sourceFile: filePath,
      timestamp: new Date().toISOString(),
      instructions: `Process ${triggerType} for file: ${path.basename(filePath)}`
    };
    
    const triggerPath = filePath.replace('.json', '-cursor-trigger.json');
    await fs.writeFile(triggerPath, JSON.stringify(triggerData, null, 2));
    
    console.log(chalk.blue(`📝 Created Cursor trigger: ${path.basename(triggerPath)}`));
  }

  async triggerNextStage(currentStage, filename) {
    const stageIndex = this.stages.indexOf(currentStage);
    if (stageIndex < this.stages.length - 1) {
      const nextStage = this.stages[stageIndex + 1];
      const nextStagePending = path.join(this.workflowRoot, nextStage, 'pending', filename);
      
      // Create trigger file for next stage
      await fs.writeFile(nextStagePending, JSON.stringify({
        trigger: true,
        sourceStage: currentStage,
        sourceFile: filename,
        timestamp: new Date().toISOString()
      }));
    }
  }

  async status() {
    console.log(chalk.blue.bold('📊 Workflow Status Report'));
    console.log('=' .repeat(50));
    
    for (const stage of this.stages) {
      const stagePath = path.join(this.workflowRoot, stage);
      
      try {
        const pending = await fs.readdir(path.join(stagePath, 'pending'));
        const processing = await fs.readdir(path.join(stagePath, 'processing'));
        const completed = await fs.readdir(path.join(stagePath, 'completed'));
        const failed = await fs.readdir(path.join(stagePath, 'failed'));
        
        console.log(chalk.cyan(`\n${stage}:`));
        console.log(`  📋 Pending: ${pending.length}`);
        console.log(`  🔄 Processing: ${processing.length}`);
        console.log(`  ✅ Completed: ${completed.length}`);
        console.log(`  ❌ Failed: ${failed.length}`);
        
      } catch (error) {
        console.log(chalk.red(`\n${stage}: Error reading status`));
      }
    }
  }

  async cleanup() {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to clean up all workflow files? This cannot be undone.',
        default: false
      }
    ]);

    if (confirm) {
      const spinner = ora('Cleaning up workflow files...').start();
      
      try {
        await fs.rm(this.workflowRoot, { recursive: true, force: true });
        spinner.succeed('✅ Workflow cleanup completed');
      } catch (error) {
        spinner.fail(`❌ Cleanup failed: ${error.message}`);
      }
    }
  }
}

// CLI Command Handler
const { Command } = require('commander');

const cursorWorkflowCommand = new Command('cursor-workflow')
  .description('Manage Cursor-integrated content automation workflow')
  .option('--action <action>', 'Action to perform (init, start, status, cleanup)', 'start')
  .action(async (options) => {
    const workflow = new CursorWorkflowManager();
    
    try {
      // If no specific action provided, show interactive menu
      if (!options.action || options.action === 'start') {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do with the Cursor Workflow?',
            choices: [
              { name: '🚀 Initialize Workflow System', value: 'init' },
              { name: '🔄 Start Workflow Monitor', value: 'start' },
              { name: '📊 View Workflow Status', value: 'status' },
              { name: '🧹 Cleanup Workflow Files', value: 'cleanup' },
              { name: '❌ Cancel', value: 'cancel' }
            ]
          }
        ]);

        if (answers.action === 'cancel') {
          console.log(chalk.yellow('Operation cancelled'));
          return;
        }

        options.action = answers.action;
      }

      switch (options.action) {
        case 'init':
          await workflow.initialize();
          break;
        case 'start':
          await workflow.startWorkflow();
          break;
        case 'status':
          await workflow.status();
          break;
        case 'cleanup':
          await workflow.cleanup();
          break;
        default:
          console.log(chalk.red('❌ Invalid action. Use: init, start, status, or cleanup'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Workflow error:'), error.message);
      process.exit(1);
    }
  });

module.exports = {
  CursorWorkflowManager,
  cursorWorkflowCommand
}; 