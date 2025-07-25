#!/usr/bin/env node

/**
 * Phase 3 Infrastructure Test
 * Test the new workflow management and agent routing system
 */

require('dotenv').config();
const AgentRouter = require('./utils/agentRouter');
const WorkflowStateTemplate = require('./utils/workflowStateTemplate');

async function testPhase3Infrastructure() {
  console.log('🧪 Testing Phase 3 Infrastructure\n');

  const tests = [
    { name: 'Workflow State Template', fn: testWorkflowStateTemplate },
    { name: 'Agent Router', fn: testAgentRouter },
    { name: 'File Structure', fn: testFileStructure },
    { name: 'CLI Commands', fn: testCLICommands }
  ];

  const results = [];

  for (const test of tests) {
    console.log(`🔍 Testing ${test.name}...`);
    
    try {
      await test.fn();
      console.log(`✅ ${test.name} - PASSED`);
      results.push({ name: test.name, status: 'PASSED' });
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED: ${error.message}`);
      results.push({ name: test.name, status: 'FAILED', error: error.message });
    }
  }

  // Display results summary
  console.log('\n📊 Test Results Summary:');
  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;

  results.forEach(result => {
    const icon = result.status === 'PASSED' ? '✅' : '❌';
    const color = result.status === 'PASSED' ? '\x1b[32m' : '\x1b[31m';
    console.log(`${color}${icon} ${result.name}\x1b[0m`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  console.log(`\n📈 Summary: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('\n🎉 All Phase 3 infrastructure tests passed!');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration.');
  }

  return { passed, failed, results };
}

async function testWorkflowStateTemplate() {
  const template = new WorkflowStateTemplate();
  
  // Test creating workflow state
  const state = template.createWorkflowState('test-post', 'Test Topic', {
    primary_keyword: 'test',
    content_type: 'blog-post'
  });
  
  if (!state.post_id || !state.topic || !state.current_phase) {
    throw new Error('Invalid workflow state structure');
  }
  
  console.log('   ✓ Workflow state template created');
}

async function testAgentRouter() {
  const router = new AgentRouter();
  
  // Test finding work (should return empty array initially)
  const blogs = await router.workflowTemplate.findBlogsForAgent('SEOAgent', 'INITIALIZED');
  
  if (!Array.isArray(blogs)) {
    throw new Error('Agent router should return array');
  }
  
  console.log('   ✓ Agent router initialized');
  console.log(`   ✓ Found ${blogs.length} blogs for SEOAgent`);
}

async function testFileStructure() {
  const fs = require('fs');
  const path = require('path');
  
  // Check required directories exist
  const requiredDirs = [
    'content/blog-posts',
    'n8n/flows',
    'utils'
  ];
  
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      throw new Error(`Required directory missing: ${dir}`);
    }
  }
  
  console.log('   ✓ File structure created');
}

async function testCLICommands() {
  // Test that CLI command modules can be loaded
  try {
    require('./cli/commands/status');
    require('./cli/commands/initiate');
    console.log('   ✓ CLI commands loaded');
  } catch (error) {
    throw new Error(`CLI command load failed: ${error.message}`);
  }
}

// Run the test
testPhase3Infrastructure()
  .then(({ passed, failed }) => {
    process.exit(failed > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  }); 