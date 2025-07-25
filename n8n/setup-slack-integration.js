/**
 * Slack Integration Setup Script
 * Helps configure Slack app and webhooks for n8n integration
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.blue('💬 Slack Integration Setup Script'));
console.log(chalk.gray('='.repeat(50)));

// Slack app configuration guide
function showSlackAppSetup() {
  console.log(chalk.cyan('\n📱 Slack App Setup:'));
  
  const steps = [
    '1. Go to https://api.slack.com/apps',
    '2. Click "Create New App"',
    '3. Choose "From scratch"',
    '4. Name: "Content Automation Bot"',
    '5. Select your workspace',
    '6. Go to "OAuth & Permissions"',
    '7. Add these scopes:',
    '   - chat:write',
    '   - channels:read',
    '   - channels:history',
    '   - commands',
    '   - incoming-webhook',
    '8. Click "Install to Workspace"',
    '9. Copy the "Bot User OAuth Token"'
  ];
  
  steps.forEach((step, index) => {
    if (step.includes('scopes:') || step.startsWith('   -')) {
      console.log(chalk.yellow(`   ${step}`));
    } else {
      console.log(chalk.white(`   ${step}`));
    }
  });
}

// Slash commands setup
function showSlashCommandsSetup() {
  console.log(chalk.cyan('\n🔧 Slash Commands Setup:'));
  
  const commands = [
    {
      command: '/create-blog',
      description: 'Create a new blog post',
      usage: '/create-blog <topic>',
      webhook: 'http://localhost:5678/webhook/slack-blog-trigger-webhook'
    },
    {
      command: '/blog-status',
      description: 'Check blog post status',
      usage: '/blog-status <post-id>',
      webhook: 'http://localhost:5678/webhook/slack-status-trigger-webhook'
    }
  ];
  
  commands.forEach(cmd => {
    console.log(chalk.white(`\n   Command: ${chalk.green(cmd.command)}`));
    console.log(chalk.gray(`   Description: ${cmd.description}`));
    console.log(chalk.gray(`   Usage: ${cmd.usage}`));
    console.log(chalk.gray(`   Request URL: ${cmd.webhook}`));
  });
  
  console.log(chalk.yellow('\n   📋 Setup Steps:'));
  console.log(chalk.white('   1. Go to your Slack app settings'));
  console.log(chalk.white('   2. Click "Slash Commands"'));
  console.log(chalk.white('   3. Click "Create New Command"'));
  console.log(chalk.white('   4. Fill in the details above'));
  console.log(chalk.white('   5. Save each command'));
}

// Webhook URLs setup
function showWebhookSetup() {
  console.log(chalk.cyan('\n🔗 Webhook URLs Setup:'));
  
  const webhooks = [
    {
      name: 'General Notifications',
      channel: '#content-automation',
      purpose: 'General workflow updates and status'
    },
    {
      name: 'Error Alerts',
      channel: '#content-errors',
      purpose: 'Error notifications and alerts'
    },
    {
      name: 'Success Updates',
      channel: '#content-success',
      purpose: 'Successful completions and milestones'
    }
  ];
  
  webhooks.forEach(webhook => {
    console.log(chalk.white(`\n   ${webhook.name}:`));
    console.log(chalk.gray(`   Channel: ${webhook.channel}`));
    console.log(chalk.gray(`   Purpose: ${webhook.purpose}`));
  });
  
  console.log(chalk.yellow('\n   📋 Setup Steps:'));
  console.log(chalk.white('   1. Go to your Slack workspace settings'));
  console.log(chalk.white('   2. Click "Apps" → "Manage Apps"'));
  console.log(chalk.white('   3. Find "Incoming Webhooks"'));
  console.log(chalk.white('   4. Click "Add Configuration"'));
  console.log(chalk.white('   5. Select the appropriate channel'));
  console.log(chalk.white('   6. Copy the webhook URL'));
}

// Environment variables setup
function showEnvironmentSetup() {
  console.log(chalk.cyan('\n⚙️ Environment Variables Setup:'));
  
  const envVars = [
    {
      name: 'SLACK_BOT_TOKEN',
      description: 'Bot User OAuth Token from Slack app',
      example: 'xoxb-1234567890-abcdefghijklmnop'
    },
    {
      name: 'SLACK_SIGNING_SECRET',
      description: 'Signing Secret from Slack app',
      example: 'abcdef1234567890abcdef1234567890'
    },
    {
      name: 'SLACK_WEBHOOK_URL',
      description: 'Incoming webhook URL for notifications',
      example: 'https://hooks.slack.com/services/T123456/B123456/abcdefghijklmnop'
    },
    {
      name: 'SLACK_ERROR_WEBHOOK_URL',
      description: 'Incoming webhook URL for error alerts',
      example: 'https://hooks.slack.com/services/T123456/B123456/qrstuvwxyzabcdef'
    }
  ];
  
  envVars.forEach(env => {
    console.log(chalk.white(`\n   ${env.name}:`));
    console.log(chalk.gray(`   Description: ${env.description}`));
    console.log(chalk.gray(`   Example: ${env.example}`));
  });
  
  console.log(chalk.yellow('\n   📋 Setup Steps:'));
  console.log(chalk.white('   1. Create a .env file in your project root'));
  console.log(chalk.white('   2. Add the environment variables above'));
  console.log(chalk.white('   3. Update the values with your actual credentials'));
  console.log(chalk.white('   4. Restart your n8n and agent servers'));
}

// Test commands
function showTestCommands() {
  console.log(chalk.cyan('\n🧪 Test Commands:'));
  
  const tests = [
    {
      name: 'Test Slack Command',
      command: 'curl -X POST http://localhost:5678/webhook/slack-blog-trigger-webhook -H "Content-Type: application/json" -d \'{"command": "/create-blog", "text": "test topic", "user_id": "U123456", "channel_id": "C123456"}\''
    },
    {
      name: 'Test Status Command',
      command: 'curl -X POST http://localhost:5678/webhook/slack-status-trigger-webhook -H "Content-Type: application/json" -d \'{"command": "/blog-status", "text": "test-blog-001", "user_id": "U123456", "channel_id": "C123456"}\''
    },
    {
      name: 'Test Agent API',
      command: 'curl -X POST http://localhost:3000/api/agents/complete-workflow -H "Content-Type: application/json" -d \'{"topic": "test topic", "metadata": {"contentType": "gift_guide"}}\''
    }
  ];
  
  tests.forEach((test, index) => {
    console.log(chalk.white(`\n   ${index + 1}. ${test.name}:`));
    console.log(chalk.gray(`   ${test.command}`));
  });
}

// Workflow import instructions
function showWorkflowImport() {
  console.log(chalk.cyan('\n📁 Workflow Import Instructions:'));
  
  const workflows = [
    'slack-blog-trigger-workflow.json',
    'slack-status-trigger-workflow.json',
    'agent-trigger-workflow.json',
    'state-sync-workflow.json',
    'error-handling-workflow.json'
  ];
  
  console.log(chalk.white('   Import these workflows into n8n:'));
  workflows.forEach(workflow => {
    console.log(chalk.gray(`   - ${workflow}`));
  });
  
  console.log(chalk.yellow('\n   📋 Import Steps:'));
  console.log(chalk.white('   1. Open n8n UI: http://localhost:5678'));
  console.log(chalk.white('   2. Click "Import from file"'));
  console.log(chalk.white('   3. Select each workflow JSON file'));
  console.log(chalk.white('   4. Update webhook URLs in each workflow'));
  console.log(chalk.white('   5. Activate the workflows'));
}

// Configuration checklist
function showChecklist() {
  console.log(chalk.cyan('\n✅ Configuration Checklist:'));
  
  const checklist = [
    '☐ Slack app created and installed',
    '☐ Bot permissions configured',
    '☐ Slash commands created',
    '☐ Webhook URLs configured',
    '☐ Environment variables set',
    '☐ n8n workflows imported',
    '☐ Webhook URLs updated in workflows',
    '☐ Agent server running',
    '☐ n8n server running',
    '☐ Test commands working'
  ];
  
  checklist.forEach(item => {
    console.log(chalk.white(`   ${item}`));
  });
}

// Main function
function main() {
  console.log(chalk.blue('🚀 Setting up Slack Integration for Multi-Agent Content System'));
  
  showSlackAppSetup();
  showSlashCommandsSetup();
  showWebhookSetup();
  showEnvironmentSetup();
  showWorkflowImport();
  showTestCommands();
  showChecklist();
  
  console.log(chalk.blue('\n🎉 Slack Integration Setup Complete!'));
  console.log(chalk.gray('\nNext steps:'));
  console.log(chalk.gray('1. Follow the setup steps above'));
  console.log(chalk.gray('2. Test each component individually'));
  console.log(chalk.gray('3. Run end-to-end tests'));
  console.log(chalk.gray('4. Monitor logs for any issues'));
}

// Run setup
if (require.main === module) {
  main();
}

module.exports = {
  showSlackAppSetup,
  showSlashCommandsSetup,
  showWebhookSetup,
  showEnvironmentSetup,
  showTestCommands,
  showWorkflowImport,
  showChecklist
}; 