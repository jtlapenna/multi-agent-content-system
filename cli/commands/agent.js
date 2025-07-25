const { Command } = require('commander');
const AgentRunner = require('../../utils/agentRunner');

const command = new Command('agent')
  .description('Run agents and manage workflows')
  .option('--status', 'Show system status')
  .option('--init <topic>', 'Initialize new workflow')
  .option('--run <agent>', 'Run specific agent')
  .option('--post-id <id>', 'Blog post ID for agent operations')
  .option('--complete <id>', 'Run complete workflow for post ID')
  .action(async (options) => {
    const agentRunner = new AgentRunner();
    
    try {
      if (options.status) {
        // Show system status
        const status = await agentRunner.getSystemStatus();
        
        console.log('\n📊 Agent System Status:');
        console.log(`   Total Agents: ${status.summary.totalAgents}`);
        console.log(`   Active Workflows: ${status.summary.activeWorkflows}`);
        
        if (status.workflows.length > 0) {
          console.log('\n🔄 Active Workflows:');
          status.workflows.forEach(workflow => {
            console.log(`   ${workflow.postId}: ${workflow.topic}`);
            console.log(`     Phase: ${workflow.currentPhase} → ${workflow.nextAgent}`);
          });
        }
        
        console.log('\n🤖 Available Agents:');
        Object.entries(status.agents).forEach(([name, info]) => {
          console.log(`   ${name}: ${info.available ? '✅ Ready' : '❌ Not Ready'}`);
        });
        
      } else if (options.init) {
        // Initialize new workflow
        const topic = options.init;
        const result = await agentRunner.initializeWorkflow(topic);
        
        console.log('\n✅ New workflow initialized:');
        console.log(`   Post ID: ${result.postId}`);
        console.log(`   Topic: ${result.state.topic}`);
        console.log(`   Current Phase: ${result.state.current_phase}`);
        console.log(`   Next Agent: ${result.state.next_agent}`);
        
      } else if (options.run && options.postId) {
        // Run specific agent
        const agentName = options.run;
        const postId = options.postId;
        
        console.log(`\n🚀 Running ${agentName} for ${postId}...`);
        const result = await agentRunner.runAgent(agentName, postId);
        
        console.log('\n✅ Agent completed:');
        console.log(`   Agent: ${agentName}`);
        console.log(`   Post ID: ${result.postId}`);
        console.log(`   Success: ${result.success}`);
        
      } else if (options.complete) {
        // Run complete workflow
        const postId = options.complete;
        
        console.log(`\n🔄 Running complete workflow for ${postId}...`);
        const result = await agentRunner.runCompleteWorkflow(postId);
        
        console.log('\n✅ Workflow completed:');
        console.log(`   Post ID: ${result.postId}`);
        console.log(`   Completed: ${result.completed}/${result.total} agents`);
        
        result.results.forEach(step => {
          const icon = step.success ? '✅' : '❌';
          console.log(`   ${icon} ${step.agent}`);
        });
        
      } else {
        // Show help
        console.log('\n🤖 Agent System Commands:');
        console.log('   --status                    Show system status');
        console.log('   --init <topic>              Initialize new workflow');
        console.log('   --run <agent> --post-id <id> Run specific agent');
        console.log('   --complete <id>              Run complete workflow');
        console.log('\nExamples:');
        console.log('   brightgift agent --status');
        console.log('   brightgift agent --init "Best Gift Ideas for Parents"');
        console.log('   brightgift agent --run SEOAgent --post-id 2025-01-XX-sample');
        console.log('   brightgift agent --complete 2025-01-XX-sample');
      }
      
    } catch (error) {
      console.error('❌ Agent operation failed:', error.message);
      process.exit(1);
    }
  });

module.exports = command; 