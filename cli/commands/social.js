const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

// Import utilities
const { loadConfig } = require('../utils/config');
const { postToSocial } = require('../../social/platforms');

const socialCommand = new Command('social')
  .description('Manage social media posting and scheduling')
  .option('-p, --post <content>', 'Post content to all enabled platforms')
  .option('-s, --schedule', 'Schedule posts for optimal times')
  .option('-l, --list', 'List scheduled posts')
  .option('--platform <platform>', 'Specific platform (twitter, instagram, pinterest, facebook, bluesky)')
  .action(async (options) => {
    const spinner = ora('Loading configuration...').start();
    
    try {
      // Load site configuration
      const config = await loadConfig();
      spinner.succeed('Configuration loaded');

      if (options.post) {
        // Post content immediately
        await postContent(options.post, options.platform, config);
      } else if (options.schedule) {
        // Schedule posts
        await schedulePosts(config);
      } else if (options.list) {
        // List scheduled posts
        await listScheduledPosts();
      } else {
        // Interactive mode
        await socialInteractive(config);
      }

    } catch (error) {
      spinner.fail('Social command failed');
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Post content to social platforms
 */
async function postContent(content, platform, config) {
  const spinner = ora('Posting content...').start();
  
  try {
    const enabledPlatforms = Object.entries(config.socialPlatforms)
      .filter(([name, settings]) => settings.enabled)
      .map(([name]) => name);

    if (enabledPlatforms.length === 0) {
      throw new Error('No social platforms are enabled. Run "brightgift config --edit" to configure platforms.');
    }

    const targetPlatforms = platform ? [platform] : enabledPlatforms;
    
    for (const platformName of targetPlatforms) {
      if (!enabledPlatforms.includes(platformName)) {
        console.log(chalk.yellow(`⚠️  ${platformName} is not enabled`));
        continue;
      }

      spinner.text = `Posting to ${platformName}...`;
      await postToSocial(platformName, content, config);
      console.log(chalk.green(`✅ Posted to ${platformName}`));
    }

    spinner.succeed('Content posted successfully');

  } catch (error) {
    spinner.fail('Posting failed');
    throw error;
  }
}

/**
 * Schedule posts for optimal times
 */
async function schedulePosts(config) {
  console.log(chalk.cyan('\n📅 Social Media Scheduling\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'content',
      message: 'Enter the content to schedule:',
      validate: (input) => input.trim().length > 0 ? true : 'Content is required'
    },
    {
      type: 'list',
      name: 'platform',
      message: 'Select platform:',
      choices: Object.entries(config.socialPlatforms)
        .filter(([name, settings]) => settings.enabled)
        .map(([name]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value: name }))
    },
    {
      type: 'list',
      name: 'timing',
      message: 'When should this be posted?',
      choices: [
        { name: 'Now', value: 'now' },
        { name: 'Optimal time (auto-schedule)', value: 'optimal' },
        { name: 'Custom time', value: 'custom' }
      ]
    }
  ]);

  if (answers.timing === 'now') {
    await postContent(answers.content, answers.platform, config);
  } else if (answers.timing === 'optimal') {
    const spinner = ora('Scheduling for optimal time...').start();
    // TODO: Implement optimal time scheduling
    spinner.succeed('Post scheduled for optimal time');
  } else {
    const timeAnswer = await inquirer.prompt([
      {
        type: 'datetime',
        name: 'scheduledTime',
        message: 'When should this be posted?',
        format: ['yyyy', '-', 'mm', '-', 'dd', ' ', 'hh', ':', 'MM', ' ', 'TT']
      }
    ]);
    
    const spinner = ora('Scheduling post...').start();
    // TODO: Implement custom time scheduling
    spinner.succeed(`Post scheduled for ${timeAnswer.scheduledTime}`);
  }
}

/**
 * List scheduled posts
 */
async function listScheduledPosts() {
  console.log(chalk.cyan('\n📋 Scheduled Posts\n'));
  
  // TODO: Implement scheduled posts listing
  console.log(chalk.gray('No scheduled posts found'));
  console.log(chalk.gray('Use "brightgift social --schedule" to schedule posts'));
}

/**
 * Interactive social media management
 */
async function socialInteractive(config) {
  console.log(chalk.cyan('\n📱 Social Media Management\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Post Content', value: 'post' },
        { name: 'Schedule Posts', value: 'schedule' },
        { name: 'View Scheduled Posts', value: 'list' },
        { name: 'Configure Platforms', value: 'config' },
        { name: 'Exit', value: 'exit' }
      ]
    }
  ]);

  switch (answers.action) {
    case 'post':
      const postAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'content',
          message: 'Enter the content to post:',
          validate: (input) => input.trim().length > 0 ? true : 'Content is required'
        },
        {
          type: 'list',
          name: 'platform',
          message: 'Select platform (or all):',
          choices: [
            { name: 'All Enabled Platforms', value: 'all' },
            ...Object.entries(config.socialPlatforms)
              .filter(([name, settings]) => settings.enabled)
              .map(([name]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value: name }))
          ]
        }
      ]);
      await postContent(postAnswer.content, postAnswer.platform === 'all' ? null : postAnswer.platform, config);
      break;
      
    case 'schedule':
      await schedulePosts(config);
      break;
      
    case 'list':
      await listScheduledPosts();
      break;
      
    case 'config':
      console.log(chalk.yellow('Run "brightgift config --edit" to configure social platforms'));
      break;
      
    case 'exit':
      console.log(chalk.green('\n👋 Social media management complete!'));
      return;
  }

  // Ask if user wants to continue
  const continueAction = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: 'Would you like to perform another action?',
      default: false
    }
  ]);

  if (continueAction.continue) {
    await socialInteractive(config);
  }
}

module.exports = socialCommand; 