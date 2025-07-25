#!/usr/bin/env node

/**
 * Workflow Status Command
 * Shows the status of all active blog workflows
 */

require('dotenv').config();
const { Command } = require('commander');
const AgentRouter = require('../../utils/agentRouter');

const command = new Command('status')
  .description('Show status of all active workflows')
  .action(async () => {
    console.log('📊 Checking workflow status...\n');
    
    try {
      const agentRouter = new AgentRouter();
      const workflows = await agentRouter.getWorkflowStatus();
      
      if (workflows.length === 0) {
        console.log('ℹ️  No active workflows found');
        console.log('   Use "brightgift initiate <topic>" to start a new workflow');
      } else {
        console.log('\n📋 Summary:');
        console.log(`   Total active workflows: ${workflows.length}`);
        
        // Group by phase
        const phaseGroups = {};
        workflows.forEach(workflow => {
          const phase = workflow.state.current_phase;
          if (!phaseGroups[phase]) {
            phaseGroups[phase] = [];
          }
          phaseGroups[phase].push(workflow);
        });
        
        console.log('\n📈 By Phase:');
        Object.entries(phaseGroups).forEach(([phase, phaseWorkflows]) => {
          console.log(`   ${phase}: ${phaseWorkflows.length} workflow(s)`);
          phaseWorkflows.forEach(workflow => {
            console.log(`     - ${workflow.postId} (${workflow.state.topic})`);
          });
        });
      }
      
    } catch (error) {
      console.error('❌ Error checking status:', error.message);
      process.exit(1);
    }
  });

module.exports = command; 