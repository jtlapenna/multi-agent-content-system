#!/usr/bin/env node

/**
 * Initiate Blog Workflow Command
 * Creates a new blog workflow and triggers the first agent
 */

require('dotenv').config();
const { Command } = require('commander');
const AgentRouter = require('../../utils/agentRouter');

const command = new Command('initiate')
  .description('Initiate a new blog workflow')
  .argument('<topic>', 'Blog topic')
  .option('--primary-keyword <keyword>', 'Primary SEO keyword')
  .option('--content-type <type>', 'Content type (blog-post, gift-guide, etc.)')
  .option('--word-count <count>', 'Estimated word count')
  .option('--target-audience <audience>', 'Target audience')
  .action(async (topic, options) => {
    console.log('🚀 Initiating new blog workflow...');
    console.log(`   Topic: ${topic}`);
    
    // Build metadata from options
    const metadata = {};
    if (options.primaryKeyword) metadata.primary_keyword = options.primaryKeyword;
    if (options.contentType) metadata.content_type = options.contentType;
    if (options.wordCount) metadata.estimated_word_count = parseInt(options.wordCount);
    if (options.targetAudience) metadata.target_audience = options.targetAudience;
    
    if (Object.keys(metadata).length > 0) {
      console.log('   Metadata:', metadata);
    }
    
    try {
      const agentRouter = new AgentRouter();
      
      // Create new workflow
      const { postId, state } = await agentRouter.createNewWorkflow(topic, metadata);
      
      console.log('\n✅ Workflow initiated successfully!');
      console.log(`   Post ID: ${postId}`);
      console.log(`   Current Phase: ${state.current_phase}`);
      console.log(`   Next Agent: ${state.next_agent}`);
      console.log(`   Branch: ${state.branch}`);
      
      // Commit the new workflow
      await agentRouter.commitChanges(postId, `Initiate workflow: ${topic}`);
      
      console.log('\n🎯 Next Steps:');
      console.log('   1. The SEOAgent has been triggered automatically');
      console.log('   2. Monitor progress in the dashboard');
      console.log('   3. Check the workflow state file for updates');
      
    } catch (error) {
      console.error('❌ Failed to initiate workflow:', error.message);
      process.exit(1);
    }
  });

module.exports = command; 