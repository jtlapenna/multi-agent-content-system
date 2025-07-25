/**
 * Automated Content Pipeline CLI Command
 * Runs complete workflow from keyword research to publishing
 */

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');

const ContentPipeline = require('../../automation/contentPipeline');

const automateCommand = new Command('automate')
  .description('Run automated content pipeline (keyword research → content → images → publishing)')
  .option('--type <type>', 'Preferred content type (gift-guide, educational, data-driven)')
  .option('--approve <pr>', 'Approve and publish specific pull request')
  .option('--schedule', 'Schedule for automated publishing')
  .option('--test', 'Run in test mode with predefined topic (bypasses keyword research)')
  .option('--quick-test', 'Quick test of GPT assistant connection only')
  .action(async (options) => {
    try {
      const pipeline = new ContentPipeline();
      
      // Quick test mode - just test GPT assistant connection
      if (options.quickTest) {
        console.log(chalk.cyan('\n⚡ QUICK TEST - GPT Assistant Connection'));
        console.log(chalk.gray('='.repeat(60)));
        console.log(chalk.yellow('⚠️  Testing GPT assistant connection only'));
        console.log(chalk.gray('This will test if your GPT assistants are working correctly'));
        console.log('');
        
        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'start',
            message: 'Start the quick GPT assistant test?',
            default: true
          }
        ]);

        if (!answers.start) {
          console.log(chalk.yellow('Quick test cancelled'));
          return;
        }

        // Test GPT assistant connection
        console.log(chalk.yellow('\n🧪 Testing GPT Assistant Connection...'));
        
        try {
          const BlogHybridGenerator = require('../../generators/blogHybrid');
          const generator = new BlogHybridGenerator();
          
          // Test with a simple prompt
          const testTopic = {
            title: 'Test Blog Post',
            primaryKeyword: 'test keyword',
            estimatedWordCount: 100,
            contentOutline: ['Introduction', 'Conclusion'],
            opportunities: ['test opportunity']
          };
          
          console.log(chalk.gray('💡 Testing blog assistant...'));
          const blogResult = await generator.generateWithGPT({}, { primary: 'test' }, testTopic);
          console.log(chalk.green('✅ Blog assistant working correctly'));
          console.log(chalk.gray(`Generated: ${blogResult.content.split(' ').length} words`));
          
        } catch (error) {
          console.log(chalk.red('❌ GPT Assistant Test Failed:'));
          console.log(chalk.red(`Error: ${error.message}`));
          console.log(chalk.yellow('\n🔧 Troubleshooting:'));
          console.log(chalk.yellow('1. Check your OPENAI_API_KEY environment variable'));
          console.log(chalk.yellow('2. Verify your GPT Assistant ID is correct'));
          console.log(chalk.yellow('3. Check OpenAI API status and rate limits'));
          console.log(chalk.yellow('4. Ensure your assistant is properly configured'));
          return;
        }
        
        console.log(chalk.green('\n✅ Quick test completed successfully!'));
        console.log(chalk.gray('Your GPT assistants are working correctly.'));
        return;
      }
      
      // Test mode - bypass keyword research
      if (options.test) {
        console.log(chalk.cyan('\n🧪 TEST MODE - BrightGift Automated Content Pipeline'));
        console.log(chalk.gray('='.repeat(60)));
        console.log(chalk.yellow('⚠️  Running with predefined test topic: "Gifts for Coffee Lovers"'));
        console.log(chalk.gray('This bypasses keyword research for faster testing'));
        console.log('');
        
        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'start',
            message: 'Start the test pipeline?',
            default: true
          }
        ]);

        if (!answers.start) {
          console.log(chalk.yellow('Test pipeline cancelled'));
          return;
        }

        // Run test pipeline with predefined topic
        const testResults = await pipeline.runTestPipeline();
        
        // Display results
        pipeline.displayResults(testResults);
        return;
      }
      
      // Approve specific PR
      if (options.approve) {
        const prNumber = parseInt(options.approve);
        if (isNaN(prNumber)) {
          console.log(chalk.red('❌ Invalid pull request number'));
          return;
        }

        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to approve and publish PR #${prNumber}?`,
            default: false
          }
        ]);

        if (answers.confirm) {
          await pipeline.approveAndPublish(prNumber);
        } else {
          console.log(chalk.yellow('Approval cancelled'));
        }
        return;
      }

      // Run full automated pipeline
      console.log(chalk.cyan('\n🤖 BrightGift Automated Content Pipeline'));
      console.log(chalk.gray('='.repeat(60)));
      console.log(chalk.gray('This will automatically:'));
      console.log(chalk.gray('• Conduct keyword research'));
      console.log(chalk.gray('• Generate blog content'));
      console.log(chalk.gray('• Create images'));
      console.log(chalk.gray('• Optimize for SEO'));
      console.log(chalk.gray('• Publish to GitHub preview'));
      console.log(chalk.gray('• Generate social posts'));
      console.log(chalk.gray('• Send approval notification'));
      console.log('');

      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'start',
          message: 'Start the automated content pipeline?',
          default: true
        }
      ]);

      if (!answers.start) {
        console.log(chalk.yellow('Pipeline cancelled'));
        return;
      }

      // Pipeline options
      const pipelineOptions = {};
      if (options.type) {
        pipelineOptions.preferredType = options.type;
      }

      // Run the pipeline
      const results = await pipeline.runAutomatedPipeline(pipelineOptions);

      // Ask if user wants to approve immediately
      if (results.githubResult && results.githubResult.pullRequest) {
        const approveAnswer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'approveNow',
            message: `Would you like to approve and publish PR #${results.githubResult.pullRequest.number} now?`,
            default: false
          }
        ]);

        if (approveAnswer.approveNow) {
          await pipeline.approveAndPublish(results.githubResult.pullRequest.number);
        } else {
          console.log(chalk.cyan('\n📋 Manual Approval Required'));
          console.log(chalk.gray('Review the content and approve when ready:'));
          console.log(chalk.white(`GitHub PR: ${results.githubResult.pullRequest.url}`));
          console.log(chalk.gray('Run: npm start automate -- --approve <PR_NUMBER>'));
        }
      }

    } catch (error) {
      console.log(chalk.red('\n❌ Automated Pipeline Error'));
      console.log(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

module.exports = automateCommand; 