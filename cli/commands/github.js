/**
 * GitHub Automation CLI Command
 * Handles automated git operations for content publishing
 */

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const path = require('path');
const fs = require('fs');

const GitHubAutomation = require('../../utils/githubAutomation');

const githubCommand = new Command('github')
  .description('GitHub automation for content publishing workflow')
  .option('--status', 'Show repository status')
  .option('--publish <file>', 'Publish content from file')
  .option('--approve <pr>', 'Approve and publish pull request')
  .option('--list-prs', 'List open pull requests')
  .option('--merge <pr>', 'Merge pull request')
  .option('--delete-branch <branch>', 'Delete a branch')
  .action(async (options) => {
    try {
      const github = new GitHubAutomation();
      
      // Show repository status
      if (options.status) {
        const spinner = ora('Checking repository status...').start();
        const status = await github.getRepositoryStatus();
        spinner.succeed('Repository status retrieved');
        
        console.log(chalk.cyan('\n📊 Repository Status'));
        console.log(chalk.gray('='.repeat(40)));
        console.log(chalk.white(`Name: ${status.name}`));
        console.log(chalk.white(`Full Name: ${status.fullName}`));
        console.log(chalk.white(`Default Branch: ${status.defaultBranch}`));
        console.log(chalk.white(`URL: ${status.url}`));
        console.log(chalk.white(`Permissions: ${Object.keys(status.permissions).join(', ')}`));
        return;
      }

      // Publish content from file
      if (options.publish) {
        const filePath = path.resolve(options.publish);
        
        if (!fs.existsSync(filePath)) {
          console.log(chalk.red(`❌ File not found: ${filePath}`));
          return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract frontmatter to get metadata
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
          console.log(chalk.red('❌ No frontmatter found in file'));
          return;
        }

        const frontmatter = frontmatterMatch[1];
        const titleMatch = frontmatter.match(/title:\s*["']?([^"\n]+)["']?/);
        const slugMatch = frontmatter.match(/slug:\s*["']?([^"\n]+)["']?/);
        const contentTypeMatch = frontmatter.match(/contentType:\s*["']?([^"\n]+)["']?/);

        if (!titleMatch || !slugMatch || !contentTypeMatch) {
          console.log(chalk.red('❌ Missing required frontmatter: title, slug, or contentType'));
          return;
        }

        const contentData = {
          title: titleMatch[1],
          slug: slugMatch[1],
          contentType: contentTypeMatch[1],
          content: content
        };

        await github.publishContent(contentData);
        return;
      }

      // Approve and publish pull request
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
          await github.approveAndPublish(prNumber);
        } else {
          console.log(chalk.yellow('Approval cancelled'));
        }
        return;
      }

      // List open pull requests
      if (options.listPrs) {
        const spinner = ora('Fetching pull requests...').start();
        
        try {
          const response = await github.makeRequest('/pulls?state=open&sort=updated&direction=desc');
          spinner.succeed(`Found ${response.length} open pull requests`);
          
          if (response.length === 0) {
            console.log(chalk.gray('No open pull requests found'));
            return;
          }

          console.log(chalk.cyan('\n📋 Open Pull Requests'));
          console.log(chalk.gray('='.repeat(60)));
          
          response.forEach(pr => {
            console.log(chalk.white(`#${pr.number}: ${pr.title}`));
            console.log(chalk.gray(`  Branch: ${pr.head.ref} → ${pr.base.ref}`));
            console.log(chalk.gray(`  Created: ${new Date(pr.created_at).toLocaleDateString()}`));
            console.log(chalk.gray(`  URL: ${pr.html_url}`));
            console.log('');
          });
        } catch (error) {
          spinner.fail(`Failed to fetch pull requests: ${error.message}`);
        }
        return;
      }

      // Merge pull request
      if (options.merge) {
        const prNumber = parseInt(options.merge);
        if (isNaN(prNumber)) {
          console.log(chalk.red('❌ Invalid pull request number'));
          return;
        }

        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'mergeMethod',
            message: 'Select merge method:',
            choices: [
              { name: 'Squash and merge', value: 'squash' },
              { name: 'Merge commit', value: 'merge' },
              { name: 'Rebase and merge', value: 'rebase' }
            ]
          },
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to merge PR #${prNumber}?`,
            default: false
          }
        ]);

        if (answers.confirm) {
          await github.mergePullRequest(prNumber, answers.mergeMethod);
        } else {
          console.log(chalk.yellow('Merge cancelled'));
        }
        return;
      }

      // Delete branch
      if (options.deleteBranch) {
        const branchName = options.deleteBranch;
        
        const answers = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to delete branch "${branchName}"?`,
            default: false
          }
        ]);

        if (answers.confirm) {
          await github.deleteBranch(branchName);
        } else {
          console.log(chalk.yellow('Branch deletion cancelled'));
        }
        return;
      }

      // Interactive mode
      console.log(chalk.cyan('\n🔧 GitHub Automation System'));
      console.log(chalk.gray('='.repeat(40)));

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '📊 Show repository status', value: 'status' },
            { name: '📋 List open pull requests', value: 'list-prs' },
            { name: '🚀 Publish content from file', value: 'publish' },
            { name: '✅ Approve and publish PR', value: 'approve' },
            { name: '🔀 Merge pull request', value: 'merge' },
            { name: '🗑️  Delete branch', value: 'delete-branch' }
          ]
        }
      ]);

      switch (answers.action) {
        case 'status':
          const status = await github.getRepositoryStatus();
          console.log(chalk.cyan('\n📊 Repository Status'));
          console.log(chalk.gray('='.repeat(40)));
          console.log(chalk.white(`Name: ${status.name}`));
          console.log(chalk.white(`Full Name: ${status.fullName}`));
          console.log(chalk.white(`Default Branch: ${status.defaultBranch}`));
          console.log(chalk.white(`URL: ${status.url}`));
          break;

        case 'list-prs':
          const response = await github.makeRequest('/pulls?state=open&sort=updated&direction=desc');
          console.log(chalk.cyan('\n📋 Open Pull Requests'));
          console.log(chalk.gray('='.repeat(60)));
          
          if (response.length === 0) {
            console.log(chalk.gray('No open pull requests found'));
          } else {
            response.forEach(pr => {
              console.log(chalk.white(`#${pr.number}: ${pr.title}`));
              console.log(chalk.gray(`  Branch: ${pr.head.ref} → ${pr.base.ref}`));
              console.log(chalk.gray(`  Created: ${new Date(pr.created_at).toLocaleDateString()}`));
              console.log(chalk.gray(`  URL: ${pr.html_url}`));
              console.log('');
            });
          }
          break;

        case 'publish':
          const fileAnswer = await inquirer.prompt([
            {
              type: 'input',
              name: 'filePath',
              message: 'Enter the path to the content file:',
              validate: (input) => {
                return fs.existsSync(input) ? true : 'File not found';
              }
            }
          ]);

          const content = fs.readFileSync(fileAnswer.filePath, 'utf8');
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          
          if (!frontmatterMatch) {
            console.log(chalk.red('❌ No frontmatter found in file'));
            break;
          }

          const frontmatter = frontmatterMatch[1];
          const titleMatch = frontmatter.match(/title:\s*["']?([^"\n]+)["']?/);
          const slugMatch = frontmatter.match(/slug:\s*["']?([^"\n]+)["']?/);
          const contentTypeMatch = frontmatter.match(/contentType:\s*["']?([^"\n]+)["']?/);

          if (!titleMatch || !slugMatch || !contentTypeMatch) {
            console.log(chalk.red('❌ Missing required frontmatter: title, slug, or contentType'));
            break;
          }

          const contentData = {
            title: titleMatch[1],
            slug: slugMatch[1],
            contentType: contentTypeMatch[1],
            content: content
          };

          await github.publishContent(contentData);
          break;

        case 'approve':
          const approveAnswer = await inquirer.prompt([
            {
              type: 'input',
              name: 'prNumber',
              message: 'Enter pull request number:',
              validate: (input) => {
                return !isNaN(parseInt(input)) ? true : 'Please enter a valid number';
              }
            }
          ]);

          const confirmApprove = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: `Are you sure you want to approve and publish PR #${approveAnswer.prNumber}?`,
              default: false
            }
          ]);

          if (confirmApprove.confirm) {
            await github.approveAndPublish(parseInt(approveAnswer.prNumber));
          }
          break;

        case 'merge':
          const mergeAnswer = await inquirer.prompt([
            {
              type: 'input',
              name: 'prNumber',
              message: 'Enter pull request number:',
              validate: (input) => {
                return !isNaN(parseInt(input)) ? true : 'Please enter a valid number';
              }
            },
            {
              type: 'list',
              name: 'mergeMethod',
              message: 'Select merge method:',
              choices: [
                { name: 'Squash and merge', value: 'squash' },
                { name: 'Merge commit', value: 'merge' },
                { name: 'Rebase and merge', value: 'rebase' }
              ]
            }
          ]);

          const confirmMerge = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: `Are you sure you want to merge PR #${mergeAnswer.prNumber}?`,
              default: false
            }
          ]);

          if (confirmMerge.confirm) {
            await github.mergePullRequest(parseInt(mergeAnswer.prNumber), mergeAnswer.mergeMethod);
          }
          break;

        case 'delete-branch':
          const branchAnswer = await inquirer.prompt([
            {
              type: 'input',
              name: 'branchName',
              message: 'Enter branch name to delete:'
            }
          ]);

          const confirmDelete = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: `Are you sure you want to delete branch "${branchAnswer.branchName}"?`,
              default: false
            }
          ]);

          if (confirmDelete.confirm) {
            await github.deleteBranch(branchAnswer.branchName);
          }
          break;
      }

    } catch (error) {
      console.log(chalk.red('\n❌ GitHub Automation Error'));
      console.log(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

module.exports = githubCommand; 