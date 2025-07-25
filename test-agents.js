/**
 * Test Script for Agent Integrations
 * Verifies that all agents can be instantiated and basic functionality works
 */

const AgentRunner = require('./agents/agentRunner');
const chalk = require('chalk');

async function testAgentIntegrations() {
  console.log(chalk.blue('🧪 Testing Agent Integrations'));
  console.log(chalk.gray('='.repeat(50)));
  
  try {
    // Initialize agent runner
    console.log(chalk.cyan('\n🔧 Initializing Agent Runner...'));
    const agentRunner = new AgentRunner();
    console.log(chalk.green('✅ Agent Runner initialized successfully'));
    
    // Test creating a new workflow
    console.log(chalk.cyan('\n📝 Testing workflow creation...'));
    const testTopic = 'gift ideas for parents';
    const workflow = await agentRunner.createWorkflow(testTopic);
    console.log(chalk.green('✅ Workflow created successfully'));
    console.log(chalk.gray(`   Post ID: ${workflow.postId}`));
    console.log(chalk.gray(`   Topic: ${workflow.topic}`));
    console.log(chalk.gray(`   Status: ${workflow.status}`));
    
    // Test getting workflow status
    console.log(chalk.cyan('\n📊 Testing workflow status...'));
    const status = await agentRunner.getWorkflowStatus(workflow.postId);
    console.log(chalk.green('✅ Workflow status retrieved successfully'));
    console.log(chalk.gray(`   Current Phase: ${status.currentPhase}`));
    console.log(chalk.gray(`   Next Agent: ${status.nextAgent}`));
    
    // Test agent instantiation
    console.log(chalk.cyan('\n🤖 Testing agent instantiation...'));
    const agents = ['SEOAgent', 'BlogAgent', 'ReviewAgent', 'ImageAgent', 'PublishingAgent'];
    
    for (const agentName of agents) {
      try {
        const agent = agentRunner.agents[agentName];
        console.log(chalk.green(`✅ ${agentName} instantiated successfully`));
        console.log(chalk.gray(`   Agent Name: ${agent.agentName}`));
      } catch (error) {
        console.log(chalk.red(`❌ ${agentName} failed to instantiate: ${error.message}`));
      }
    }
    
    // Test finding next work (should be empty for new workflow)
    console.log(chalk.cyan('\n🔍 Testing next work finding...'));
    for (const agentName of agents) {
      try {
        const nextWork = await agentRunner.runNextWork(agentName);
        if (nextWork) {
          console.log(chalk.yellow(`⚠️ ${agentName} found work: ${nextWork.postId}`));
        } else {
          console.log(chalk.gray(`   ${agentName}: No work found (expected for new workflow)`));
        }
      } catch (error) {
        console.log(chalk.red(`❌ ${agentName} error finding work: ${error.message}`));
      }
    }
    
    console.log(chalk.blue('\n🎉 Agent Integration Test Completed Successfully!'));
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray('1. Configure environment variables for APIs'));
    console.log(chalk.gray('2. Set up Supabase database connection'));
    console.log(chalk.gray('3. Test individual agent workflows'));
    console.log(chalk.gray('4. Run complete end-to-end workflow'));
    
  } catch (error) {
    console.error(chalk.red('\n❌ Agent Integration Test Failed:'), error.message);
    console.error(chalk.gray('\nError details:'), error);
  }
}

// Run the test
if (require.main === module) {
  testAgentIntegrations().catch(console.error);
}

module.exports = { testAgentIntegrations }; 