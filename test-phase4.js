#!/usr/bin/env node

/**
 * Phase 4 Agent Integration Test
 * Test the updated utilities and agent system integration
 */

require('dotenv').config();
const WorkflowStateTemplate = require('./utils/workflowStateTemplate');
const EnhancedSEOProcessor = require('./utils/enhancedSEOProcessor');
const ContentChecker = require('./utils/contentChecker');

async function testPhase4Integration() {
  console.log('🧪 Testing Phase 4 Agent Integration\n');

  const tests = [
    { name: 'Workflow State Template', fn: testWorkflowStateTemplate },
    { name: 'SEO Agent Integration', fn: testSEOAgentIntegration },
    { name: 'Review Agent Integration', fn: testReviewAgentIntegration },
    { name: 'Agent Communication', fn: testAgentCommunication }
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
    console.log('\n🎉 All Phase 4 agent integration tests passed!');
    console.log('✅ Ready for Phase 5: n8n Workflow Setup');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration.');
  }

  return { passed, failed, results };
}

async function testWorkflowStateTemplate() {
  const template = new WorkflowStateTemplate();
  
  // Test creating a workflow state
  const postId = 'test-2025-01-XX-sample-post';
  const state = template.createWorkflowState(postId, 'Test Topic', {
    primary_keyword: 'test',
    content_type: 'blog-post'
  });
  
  if (!state.post_id || !state.topic || !state.current_phase) {
    throw new Error('Invalid workflow state structure');
  }
  
  console.log('   ✓ Workflow state template working');
}

async function testSEOAgentIntegration() {
  const seoProcessor = new EnhancedSEOProcessor();
  
  // Test that the agent method exists
  if (typeof seoProcessor.runSEOAgent !== 'function') {
    throw new Error('SEO agent method not found');
  }
  
  // Test with a mock workflow state
  const mockState = {
    topic: 'Test SEO Topic',
    current_phase: 'INITIALIZED',
    next_agent: 'SEOAgent',
    agent_outputs: {},
    errors: []
  };
  
  // Note: This would require actual API keys to run fully
  // For now, just test that the method exists and has the right structure
  console.log('   ✓ SEO agent integration ready');
}

async function testReviewAgentIntegration() {
  const contentChecker = new ContentChecker();
  
  // Test that the agent method exists
  if (typeof contentChecker.runReviewAgent !== 'function') {
    throw new Error('Review agent method not found');
  }
  
  // Test that review methods exist
  if (typeof contentChecker.reviewAndOptimizeContent !== 'function') {
    throw new Error('Review and optimize method not found');
  }
  
  console.log('   ✓ Review agent integration ready');
}

async function testAgentCommunication() {
  const template = new WorkflowStateTemplate();
  
  // Test agent handoff logic
  const mockState = {
    post_id: 'test-post',
    current_phase: 'SEO_COMPLETE',
    next_agent: 'BlogAgent',
    agent_outputs: {
      SEOAgent: 'seo-results.json'
    }
  };
  
  // Test finding work for an agent
  const blogs = await template.findBlogsForAgent('BlogAgent', 'SEO_COMPLETE');
  
  if (!Array.isArray(blogs)) {
    throw new Error('Agent routing should return array');
  }
  
  console.log('   ✓ Agent communication working');
  console.log(`   ✓ Found ${blogs.length} blogs ready for BlogAgent`);
}

// Run the test
testPhase4Integration()
  .then(({ passed, failed }) => {
    process.exit(failed > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  }); 