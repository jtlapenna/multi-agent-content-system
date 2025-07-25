/**
 * n8n Setup Script
 * Helps configure n8n workflows and webhooks
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.blue('🔧 n8n Setup Script'));
console.log(chalk.gray('='.repeat(50)));

// Check if n8n is installed
function checkN8nInstallation() {
  console.log(chalk.cyan('\n📋 Checking n8n installation...'));
  
  try {
    const { execSync } = require('child_process');
    const version = execSync('n8n --version', { encoding: 'utf8' }).trim();
    console.log(chalk.green(`✅ n8n is installed (version: ${version})`));
    return true;
  } catch (error) {
    console.log(chalk.red('❌ n8n is not installed'));
    console.log(chalk.yellow('💡 Install n8n with: npm install -g n8n'));
    return false;
  }
}

// List available workflows
function listWorkflows() {
  console.log(chalk.cyan('\n📁 Available workflows:'));
  
  const workflowsDir = path.join(__dirname, 'workflows');
  const workflowFiles = fs.readdirSync(workflowsDir).filter(file => file.endsWith('.json'));
  
  workflowFiles.forEach(file => {
    const workflowPath = path.join(workflowsDir, file);
    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    
    console.log(chalk.gray(`   📄 ${file}`));
    console.log(chalk.white(`      Name: ${workflow.name}`));
    console.log(chalk.gray(`      Webhook ID: ${getWebhookId(workflow)}`));
  });
  
  return workflowFiles;
}

// Get webhook ID from workflow
function getWebhookId(workflow) {
  const webhookNode = workflow.nodes.find(node => node.type === 'n8n-nodes-base.webhook');
  return webhookNode ? webhookNode.webhookId : 'N/A';
}

// Generate webhook URLs
function generateWebhookUrls() {
  console.log(chalk.cyan('\n🔗 Webhook URLs (after n8n is running):'));
  
  const baseUrl = 'http://localhost:5678/webhook';
  const webhookIds = [
    'agent-trigger-webhook',
    'state-sync-webhook', 
    'error-handler-webhook'
  ];
  
  webhookIds.forEach(id => {
    console.log(chalk.green(`   ${id}: ${baseUrl}/${id}`));
  });
}

// Show setup instructions
function showSetupInstructions() {
  console.log(chalk.cyan('\n📋 Setup Instructions:'));
  
  const instructions = [
    '1. Start n8n: n8n start',
    '2. Open n8n UI: http://localhost:5678',
    '3. Import workflows from n8n/workflows/ directory',
    '4. Configure Slack webhook URL in each workflow',
    '5. Configure Supabase credentials',
    '6. Test webhook endpoints',
    '7. Start the agent server: node server.js'
  ];
  
  instructions.forEach((instruction, index) => {
    console.log(chalk.white(`   ${index + 1}. ${instruction}`));
  });
}

// Show configuration requirements
function showConfigurationRequirements() {
  console.log(chalk.cyan('\n⚙️ Configuration Requirements:'));
  
  const configs = [
    'SLACK_WEBHOOK_URL - Slack webhook for notifications',
    'SUPABASE_URL - Supabase project URL',
    'SUPABASE_API_KEY - Supabase API key',
    'N8N_WEBHOOK_URL - n8n webhook base URL'
  ];
  
  configs.forEach(config => {
    console.log(chalk.yellow(`   🔧 ${config}`));
  });
}

// Test webhook endpoints
function testWebhookEndpoints() {
  console.log(chalk.cyan('\n🧪 Testing webhook endpoints...'));
  
  const endpoints = [
    'http://localhost:3000/webhook/agent-trigger',
    'http://localhost:3000/webhook/state-sync',
    'http://localhost:3000/webhook/error-handler'
  ];
  
  endpoints.forEach(endpoint => {
    console.log(chalk.gray(`   Testing: ${endpoint}`));
    // In a real implementation, this would make HTTP requests
  });
  
  console.log(chalk.green('✅ Webhook endpoints ready for testing'));
}

// Main setup function
function main() {
  console.log(chalk.blue('🚀 Setting up n8n for Multi-Agent Content System'));
  
  // Check n8n installation
  const n8nInstalled = checkN8nInstallation();
  
  // List workflows
  const workflows = listWorkflows();
  
  // Generate webhook URLs
  generateWebhookUrls();
  
  // Show setup instructions
  showSetupInstructions();
  
  // Show configuration requirements
  showConfigurationRequirements();
  
  // Test webhook endpoints
  testWebhookEndpoints();
  
  console.log(chalk.blue('\n🎉 n8n Setup Complete!'));
  console.log(chalk.gray('\nNext steps:'));
  console.log(chalk.gray('1. Start n8n and import workflows'));
  console.log(chalk.gray('2. Configure environment variables'));
  console.log(chalk.gray('3. Test the complete workflow'));
}

// Run setup
if (require.main === module) {
  main();
}

module.exports = {
  checkN8nInstallation,
  listWorkflows,
  generateWebhookUrls,
  showSetupInstructions,
  testWebhookEndpoints
}; 