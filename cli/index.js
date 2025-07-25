#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const ora = require('ora');
const boxen = require('boxen');
require('dotenv').config();

// Import commands
const generateCommand = require('./commands/generate');
const configCommand = require('./commands/config');
const previewCommand = require('./commands/preview');
const socialCommand = require('./commands/social');
const analyticsCommand = require('./commands/analytics');
const seoCommand = require('./commands/seo');
const blogHybridCommand = require('./commands/blogHybrid');
const keywordResearchCommand = require('./commands/keywordResearch');
const keywordBankCommand = require('./commands/keywordBank');
const githubCommand = require('./commands/github');
const automateCommand = require('./commands/automate');
const cursorWorkflowCommand = require('./commands/cursorWorkflow');
const testInfrastructureCommand = require("./commands/test-infrastructure");

const program = new Command();

// Display banner
console.log(
  boxen(
    chalk.cyan(
      figlet.textSync('BrightGift', { horizontalLayout: 'full' })
    ) + '\n' +
    chalk.gray('Content Automation System v1.0.0')
  , {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan'
  })
);

program
  .name('brightgift')
  .description('AI-powered content automation system for Bright-Gift.com')
  .version('1.0.0');

// Add commands
program.addCommand(generateCommand);
program.addCommand(configCommand);
program.addCommand(previewCommand);
program.addCommand(socialCommand);
program.addCommand(analyticsCommand);
program.addCommand(seoCommand);
program.addCommand(blogHybridCommand);
program.addCommand(keywordResearchCommand);
program.addCommand(keywordBankCommand);
program.addCommand(githubCommand);
program.addCommand(automateCommand);
program.addCommand(cursorWorkflowCommand);
program.addCommand(testInfrastructureCommand);

// Interactive mode
program
  .command('interactive')
  .description('Start interactive mode for guided content creation')
  .action(async () => {
    console.log(chalk.cyan('\n🎯 Interactive Mode - BrightGift Content Automation\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '🚀 Cursor Workflow System', value: 'cursor-workflow' },
          { name: '🤖 Automated Content Pipeline', value: 'automate' },
          { name: 'Generate Blog Content (Hybrid GPT + Cursor)', value: 'generate' },
          { name: 'Data-Driven Keyword Research', value: 'keyword-research' },
          { name: 'Manage Keyword Bank', value: 'keyword-bank' },
          { name: 'GitHub Automation', value: 'github' },
          { name: 'SEO Research & Ideas', value: 'seo' },
          { name: 'Configure System', value: 'config' },
          { name: 'Preview Content', value: 'preview' },
          { name: 'Post to Social Media', value: 'social' },
          { name: 'View Analytics', value: 'analytics' },
          { name: 'Exit', value: 'exit' }
        ]
      }
    ]);

    switch (answers.action) {
      case 'cursor-workflow':
        await cursorWorkflowCommand.action();
        break;
      case 'automate':
        await automateCommand.action();
        break;
      case 'generate':
        await generateCommand.action();
        break;
      case 'keyword-research':
        await keywordResearchCommand.action();
        break;
      case 'keyword-bank':
        await keywordBankCommand.action();
        break;
      case 'github':
        await githubCommand.action();
        break;
      case 'seo':
        await seoCommand.action();
        break;
      case 'config':
        await configCommand.action();
        break;
      case 'preview':
        await previewCommand.action();
        break;
      case 'social':
        await socialCommand.action();
        break;
      case 'analytics':
        await analyticsCommand.action();
        break;
      case 'exit':
        console.log(chalk.green('\n👋 Goodbye!'));
        process.exit(0);
    }
  });

// Error handling
program.exitOverride();

try {
  program.parse();
} catch (err) {
  if (err.code === 'commander.help') {
    process.exit(0);
  } else {
    console.error(chalk.red('❌ Error:'), err.message);
    process.exit(1);
  }
} 