const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const { spawn } = require('child_process');
const path = require('path');

// Import utilities
const { loadConfig } = require('../utils/config');

const previewCommand = new Command('preview')
  .description('Start preview server for content review')
  .option('-p, --port <port>', 'Port number for preview server', '3000')
  .option('-o, --open', 'Automatically open browser')
  .action(async (options) => {
    const spinner = ora('Loading configuration...').start();
    
    try {
      // Load site configuration
      const config = await loadConfig();
      spinner.succeed('Configuration loaded');

      // Check if preview is enabled
      if (!config.automation?.preview?.enabled) {
        console.log(chalk.yellow('⚠️  Preview system is disabled in configuration'));
        console.log(chalk.gray('Run "brightgift config --edit" to enable it'));
        return;
      }

      const port = options.port || config.automation.preview.port || 3000;
      
      console.log(chalk.cyan(`\n🚀 Starting preview server on port ${port}...`));
      console.log(chalk.gray('Press Ctrl+C to stop the server\n'));

      // Start Astro dev server
      const astroProcess = spawn('npm', ['run', 'dev', '--', '--port', port], {
        cwd: path.join(process.cwd(), 'reference'),
        stdio: 'inherit',
        shell: true
      });

      // Handle process exit
      astroProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(chalk.red(`\n❌ Preview server exited with code ${code}`));
        } else {
          console.log(chalk.green('\n👋 Preview server stopped'));
        }
      });

      // Handle errors
      astroProcess.on('error', (error) => {
        console.error(chalk.red('\n❌ Failed to start preview server:'), error.message);
        process.exit(1);
      });

      // Auto-open browser if requested
      if (options.open || config.automation.preview.autoOpen) {
        setTimeout(() => {
          const open = require('open');
          open(`http://localhost:${port}`);
        }, 2000);
      }

    } catch (error) {
      spinner.fail('Preview failed');
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

module.exports = previewCommand; 