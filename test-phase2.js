#!/usr/bin/env node

/**
 * Phase 2 Infrastructure Test
 * Standalone test script for the new multi-agent system infrastructure
 */

require('dotenv').config();

const chalk = require('chalk');

async function testPhase2Infrastructure() {
  console.log(chalk.cyan('\n🧪 Testing Phase 2 Infrastructure\n'));

  const tests = [
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'Dependencies', fn: testDependencies }
  ];

  const results = [];

  for (const test of tests) {
    console.log(chalk.yellow(`\n🔍 Testing ${test.name}...`));
    
    try {
      await test.fn();
      console.log(chalk.green(`✅ ${test.name} - PASSED`));
      results.push({ name: test.name, status: 'PASSED' });
    } catch (error) {
      console.log(chalk.red(`❌ ${test.name} - FAILED: ${error.message}`));
      results.push({ name: test.name, status: 'FAILED', error: error.message });
    }
  }

  // Display results summary
  console.log(chalk.cyan('\n📊 Test Results Summary:'));
  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;

  results.forEach(result => {
    const icon = result.status === 'PASSED' ? '✅' : '❌';
    const color = result.status === 'PASSED' ? chalk.green : chalk.red;
    console.log(color(`${icon} ${result.name}`));
    if (result.error) {
      console.log(chalk.gray(`   Error: ${result.error}`));
    }
  });

  console.log(chalk.cyan(`\n📈 Summary: ${passed} passed, ${failed} failed`));

  if (failed === 0) {
    console.log(chalk.green('\n🎉 All infrastructure tests passed! Phase 2 is ready.'));
  } else {
    console.log(chalk.yellow('\n⚠️ Some tests failed. Please check the configuration.'));
  }

  return { passed, failed, results };
}

async function testEnvironmentVariables() {
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
    'GITHUB_TOKEN'
  ];
  
  const optionalVars = [
    'N8N_WEBHOOK_URL',
    'SLACK_WEBHOOK_URL',
    'SMTP_USER',
    'SMTP_PASS',
    'GOOGLE_ADS_DEVELOPER_TOKEN'
  ];
  
  const missing = [];
  const found = [];
  
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      found.push(varName);
    } else {
      missing.push(varName);
    }
  }
  
  for (const varName of optionalVars) {
    if (process.env[varName]) {
      found.push(varName);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log(chalk.gray(`   ✓ Required environment variables: ${found.length}`));
  console.log(chalk.gray(`   ✓ Optional environment variables: ${optionalVars.filter(v => process.env[v]).length}`));
}

async function testDependencies() {
  try {
    // Test if our utility modules can be loaded
    const supabaseClient = require('./utils/supabaseClient');
    const workflowStateManager = require('./utils/workflowStateManager');
    const notificationService = require('./utils/notificationService');
    
    console.log(chalk.gray('   ✓ All utility modules loaded successfully'));
    
    // Test basic initialization
    const notification = new notificationService();
    console.log(chalk.gray('   ✓ Notification service instantiated'));
    
  } catch (error) {
    throw new Error(`Dependency test failed: ${error.message}`);
  }
}

// Run the test
testPhase2Infrastructure()
  .then(({ passed, failed }) => {
    process.exit(failed > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error(chalk.red('❌ Test runner failed:'), error.message);
    process.exit(1);
  });
