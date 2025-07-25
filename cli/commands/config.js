const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

// Import utilities
const { loadConfig, createDefaultConfig, saveConfig, validateEnvConfig } = require('../utils/config');

const configCommand = new Command('config')
  .description('Manage system configuration')
  .option('-i, --init', 'Initialize new configuration')
  .option('-v, --validate', 'Validate current configuration')
  .option('-e, --edit', 'Edit configuration interactively')
  .action(async (options) => {
    const spinner = ora('Loading configuration...').start();
    
    try {
      if (options.init) {
        // Initialize new configuration
        spinner.text = 'Creating new configuration...';
        const config = createDefaultConfig();
        await saveConfig(config, 'bright-gift');
        spinner.succeed('Configuration initialized');
        
        console.log(chalk.green('\n✅ Bright-Gift configuration created!'));
        console.log(chalk.gray('Edit config/sites/bright-gift.json to customize settings'));
        return;
      }

      if (options.validate) {
        // Validate configuration
        spinner.text = 'Validating configuration...';
        const config = await loadConfig();
        validateEnvConfig();
        spinner.succeed('Configuration is valid');
        
        console.log(chalk.green('\n✅ All configurations are valid!'));
        return;
      }

      if (options.edit) {
        // Interactive configuration editing
        spinner.stop();
        await editConfigInteractive();
        return;
      }

      // Default: show current configuration
      const config = await loadConfig();
      spinner.succeed('Configuration loaded');
      
      console.log(chalk.cyan('\n📋 Current Configuration:'));
      console.log(chalk.gray('Site:'), config.name);
      console.log(chalk.gray('Domain:'), config.domain);
      console.log(chalk.gray('Content Directory:'), config.contentDir);
      console.log(chalk.gray('Images Directory:'), config.imagesDir);
      
      console.log(chalk.cyan('\n🔗 Affiliate Programs:'));
      Object.entries(config.affiliatePrograms).forEach(([program, settings]) => {
        const status = settings.enabled ? chalk.green('✓ Enabled') : chalk.red('✗ Disabled');
        console.log(`  ${program}: ${status}`);
      });
      
      console.log(chalk.cyan('\n📱 Social Platforms:'));
      Object.entries(config.socialPlatforms).forEach(([platform, settings]) => {
        const status = settings.enabled ? chalk.green('✓ Enabled') : chalk.red('✗ Disabled');
        console.log(`  ${platform}: ${status}`);
      });

    } catch (error) {
      spinner.fail('Configuration failed');
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

/**
 * Interactive configuration editing
 */
async function editConfigInteractive() {
  console.log(chalk.cyan('\n⚙️  Interactive Configuration Editor\n'));
  
  try {
    const config = await loadConfig();
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'section',
        message: 'Which section would you like to edit?',
        choices: [
          { name: 'Basic Site Settings', value: 'basic' },
          { name: 'Affiliate Programs', value: 'affiliate' },
          { name: 'Social Media Platforms', value: 'social' },
          { name: 'Image Generation', value: 'images' },
          { name: 'Automation Settings', value: 'automation' },
          { name: 'Exit', value: 'exit' }
        ]
      }
    ]);

    if (answers.section === 'exit') {
      console.log(chalk.green('\n👋 Configuration editing complete!'));
      return;
    }

    switch (answers.section) {
      case 'basic':
        await editBasicSettings(config);
        break;
      case 'affiliate':
        await editAffiliateSettings(config);
        break;
      case 'social':
        await editSocialSettings(config);
        break;
      case 'images':
        await editImageSettings(config);
        break;
      case 'automation':
        await editAutomationSettings(config);
        break;
    }

    // Save updated configuration
    await saveConfig(config, 'bright-gift');
    console.log(chalk.green('\n✅ Configuration updated!'));
    
    // Ask if user wants to edit more
    const continueEdit = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'Would you like to edit another section?',
        default: false
      }
    ]);

    if (continueEdit.continue) {
      await editConfigInteractive();
    }

  } catch (error) {
    console.error(chalk.red('❌ Error:'), error.message);
  }
}

/**
 * Edit basic site settings
 */
async function editBasicSettings(config) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Site name:',
      default: config.name
    },
    {
      type: 'input',
      name: 'domain',
      message: 'Site domain:',
      default: config.domain
    },
    {
      type: 'input',
      name: 'contentDir',
      message: 'Content directory:',
      default: config.contentDir
    },
    {
      type: 'input',
      name: 'imagesDir',
      message: 'Images directory:',
      default: config.imagesDir
    }
  ]);

  Object.assign(config, answers);
}

/**
 * Edit affiliate program settings
 */
async function editAffiliateSettings(config) {
  for (const [program, settings] of Object.entries(config.affiliatePrograms)) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enabled',
        message: `Enable ${program} affiliate program?`,
        default: settings.enabled
      }
    ]);

    if (answers.enabled && program === 'amazon') {
      const amazonAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'tag',
          message: 'Amazon affiliate tag:',
          default: settings.tag || 'brightgift-20'
        }
      ]);
      settings.tag = amazonAnswers.tag;
    }

    if (answers.enabled && program === 'bookshop') {
      const bookshopAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'tag',
          message: 'Bookshop.org affiliate tag:',
          default: settings.tag || 'brightgift'
        }
      ]);
      settings.tag = bookshopAnswers.tag;
    }

    settings.enabled = answers.enabled;
  }
}

/**
 * Edit social media settings
 */
async function editSocialSettings(config) {
  for (const [platform, settings] of Object.entries(config.socialPlatforms)) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'enabled',
        message: `Enable ${platform} integration?`,
        default: settings.enabled
      }
    ]);

    if (answers.enabled) {
      const apiAnswers = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: `${platform} API key/access token:`,
          default: settings.apiKey || settings.accessToken || settings.identifier || ''
        }
      ]);

      if (platform === 'twitter') {
        const secretAnswer = await inquirer.prompt([
          {
            type: 'password',
            name: 'apiSecret',
            message: 'Twitter API secret:',
            default: settings.apiSecret || ''
          }
        ]);
        settings.apiSecret = secretAnswer.apiSecret;
      }

      if (platform === 'bluesky') {
        const passwordAnswer = await inquirer.prompt([
          {
            type: 'password',
            name: 'password',
            message: 'Bluesky password:',
            default: settings.password || ''
          }
        ]);
        settings.password = passwordAnswer.password;
      }

      // Set the appropriate field based on platform
      if (platform === 'twitter') {
        settings.apiKey = apiAnswers.apiKey;
      } else if (platform === 'bluesky') {
        settings.identifier = apiAnswers.apiKey;
      } else {
        settings.accessToken = apiAnswers.apiKey;
      }
    }

    settings.enabled = answers.enabled;
  }
}

/**
 * Edit image generation settings
 */
async function editImageSettings(config) {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'model',
      message: 'Image generation model:',
      choices: ['gpt-image-1', 'dall-e-3', 'midjourney'],
      default: config.imageGeneration.model
    },
    {
      type: 'input',
      name: 'style',
      message: 'Image style:',
      default: config.imageGeneration.style
    }
  ]);

  config.imageGeneration.model = answers.model;
  config.imageGeneration.style = answers.style;
}

/**
 * Edit automation settings
 */
async function editAutomationSettings(config) {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'gitEnabled',
      message: 'Enable Git workflow automation?',
      default: config.automation.gitWorkflow.enabled
    },
    {
      type: 'confirm',
      name: 'previewEnabled',
      message: 'Enable preview system?',
      default: config.automation.preview.enabled
    },
    {
      type: 'confirm',
      name: 'schedulingEnabled',
      message: 'Enable social media scheduling?',
      default: config.automation.scheduling.enabled
    }
  ]);

  config.automation.gitWorkflow.enabled = answers.gitEnabled;
  config.automation.preview.enabled = answers.previewEnabled;
  config.automation.scheduling.enabled = answers.schedulingEnabled;
}

module.exports = configCommand; 