const { Command } = require('commander');
const AgentRunner = require('../../utils/agentRunner');
const WorkflowStateTemplate = require('../../utils/workflowStateTemplate');
const fs = require('fs').promises;

const command = new Command('workflow')
  .description('Manually trigger agents in sequence for testing')
  .option('--init <topic>', 'Initialize new workflow')
  .option('--run-seo <post-id>', 'Run SEO agent for post ID')
  .option('--run-review <post-id>', 'Run Review agent for post ID')
  .option('--run-sequence <post-id>', 'Run SEO then Review agents in sequence')
  .option('--show-outputs <post-id>', 'Show all outputs for a post ID')
  .action(async (options) => {
    const agentRunner = new AgentRunner();
    const workflowTemplate = new WorkflowStateTemplate();
    
    try {
      if (options.init) {
        // Initialize new workflow
        console.log(`🚀 Initializing workflow for: ${options.init}`);
        const result = await agentRunner.initializeWorkflow(options.init);
        
        console.log('\n✅ Workflow initialized:');
        console.log(`   Post ID: ${result.postId}`);
        console.log(`   Topic: ${result.state.topic}`);
        console.log(`   Current Phase: ${result.state.current_phase}`);
        console.log(`   Next Agent: ${result.state.next_agent}`);
        console.log(`   Directory: content/blog-posts/${result.postId}`);
        
      } else if (options.runSeo) {
        // Run SEO agent
        console.log(`🔍 Running SEO Agent for: ${options.runSeo}`);
        const result = await agentRunner.runAgent('SEOAgent', options.runSeo);
        
        if (result.success) {
          console.log('\n✅ SEO Agent completed:');
          console.log(`   Output: ${result.agent_outputs?.SEOAgent || 'seo-results.json'}`);
          
          // Show SEO results summary
          const seoPath = `content/blog-posts/${options.runSeo}/seo-results.json`;
          if (await fs.access(seoPath).then(() => true).catch(() => false)) {
            const seoData = JSON.parse(await fs.readFile(seoPath, 'utf8'));
            console.log(`   Keywords analyzed: ${seoData.keywordAnalysis?.length || 0}`);
            console.log(`   Content strategy: ${seoData.contentStrategy ? 'Generated' : 'Not generated'}`);
            console.log(`   Affiliate plan: ${seoData.affiliatePlan ? 'Generated' : 'Not generated'}`);
          }
        } else {
          console.log('❌ SEO Agent failed:', result.error);
        }
        
      } else if (options.runReview) {
        // Run Review agent
        console.log(`🔍 Running Review Agent for: ${options.runReview}`);
        const result = await agentRunner.runAgent('ReviewAgent', options.runReview);
        
        if (result.success) {
          console.log('\n✅ Review Agent completed:');
          console.log(`   Output: ${result.agent_outputs?.ReviewAgent || 'blog-final.md'}`);
          console.log(`   Optimization score: ${result.reviewResults?.score || 'N/A'}/100`);
          
          if (result.reviewResults?.notes) {
            console.log('   Review notes:');
            result.reviewResults.notes.forEach(note => {
              console.log(`     ${note}`);
            });
          }
        } else {
          console.log('❌ Review Agent failed:', result.error);
        }
        
      } else if (options.runSequence) {
        // Run agents in sequence
        const postId = options.runSequence;
        console.log(`🔄 Running agent sequence for: ${postId}`);
        
        // Step 1: Run SEO Agent
        console.log('\n🔍 Step 1: Running SEO Agent...');
        const seoResult = await agentRunner.runAgent('SEOAgent', postId);
        
        if (!seoResult.success) {
          console.log('❌ SEO Agent failed, stopping sequence');
          return;
        }
        
        // Step 2: Create mock blog content for Review Agent
        console.log('\n📝 Step 2: Creating mock blog content...');
        const mockContent = `# Sample Blog Post

## Introduction
This is a sample blog post for testing the review agent.

## Main Content
This section contains the main content of the blog post.

## Conclusion
This concludes our sample blog post.`;

        const blogPath = `content/blog-posts/${postId}/blog-draft.md`;
        await fs.writeFile(blogPath, mockContent);
        
        // Update workflow state
        await workflowTemplate.updateWorkflowState(postId, {
          current_phase: 'BLOG_COMPLETE',
          next_agent: 'ReviewAgent',
          agent_outputs: {
            ...seoResult.agent_outputs,
            BlogAgent: 'blog-draft.md'
          }
        });
        
        // Step 3: Run Review Agent
        console.log('\n🔍 Step 3: Running Review Agent...');
        const reviewResult = await agentRunner.runAgent('ReviewAgent', postId);
        
        if (reviewResult.success) {
          console.log('\n✅ Agent sequence completed successfully!');
          console.log(`   Final phase: ${reviewResult.updatedState?.current_phase}`);
          console.log(`   Next agent: ${reviewResult.updatedState?.next_agent}`);
        } else {
          console.log('❌ Review Agent failed:', reviewResult.error);
        }
        
      } else if (options.showOutputs) {
        // Show all outputs for a post
        const postId = options.showOutputs;
        const postDir = `content/blog-posts/${postId}`;
        
        console.log(`📁 Showing outputs for: ${postId}`);
        
        try {
          const files = await fs.readdir(postDir);
          
          console.log('\n📄 Generated Files:');
          for (const file of files) {
            const filePath = `${postDir}/${file}`;
            const stats = await fs.stat(filePath);
            
            if (stats.isFile()) {
              const content = await fs.readFile(filePath, 'utf8');
              console.log(`   📄 ${file} (${content.length} chars)`);
              
              if (file === 'workflow_state.json') {
                const state = JSON.parse(content);
                console.log(`      Phase: ${state.current_phase}`);
                console.log(`      Next Agent: ${state.next_agent}`);
                console.log(`      Status: ${state.status}`);
              } else if (file === 'seo-results.json') {
                const seo = JSON.parse(content);
                console.log(`      Keywords: ${seo.keywordAnalysis?.length || 0}`);
                console.log(`      Topic: ${seo.topic}`);
              } else if (file.endsWith('.md')) {
                const wordCount = content.split(/\s+/).length;
                console.log(`      Word count: ${wordCount}`);
              }
            } else {
              console.log(`   📁 ${file}/ (directory)`);
            }
          }
          
          // Show workflow state
          const statePath = `${postDir}/workflow_state.json`;
          if (await fs.access(statePath).then(() => true).catch(() => false)) {
            const state = JSON.parse(await fs.readFile(statePath, 'utf8'));
            console.log('\n📊 Workflow State:');
            console.log(`   Topic: ${state.topic}`);
            console.log(`   Current Phase: ${state.current_phase}`);
            console.log(`   Next Agent: ${state.next_agent}`);
            console.log(`   Status: ${state.status}`);
            console.log(`   Agents Run: ${state.agents_run?.join(', ') || 'None'}`);
            console.log(`   Agent Outputs: ${Object.keys(state.agent_outputs || {}).join(', ')}`);
          }
          
        } catch (error) {
          console.log(`❌ Error reading post directory: ${error.message}`);
        }
        
      } else {
        // Show help
        console.log('\n🔄 Manual Workflow Commands:');
        console.log('   --init <topic>                    Initialize new workflow');
        console.log('   --run-seo <post-id>               Run SEO agent');
        console.log('   --run-review <post-id>            Run Review agent');
        console.log('   --run-sequence <post-id>          Run SEO then Review in sequence');
        console.log('   --show-outputs <post-id>          Show all outputs for a post');
        console.log('\nExamples:');
        console.log('   brightgift workflow --init "Best Gifts for Kids"');
        console.log('   brightgift workflow --run-seo test-2025-07-25-gift-ideas-parents');
        console.log('   brightgift workflow --run-sequence test-2025-07-25-gift-ideas-parents');
        console.log('   brightgift workflow --show-outputs test-2025-07-25-gift-ideas-parents');
      }
      
    } catch (error) {
      console.error('❌ Workflow operation failed:', error.message);
      process.exit(1);
    }
  });

module.exports = command; 