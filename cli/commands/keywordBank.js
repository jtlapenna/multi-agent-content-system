/**
 * Keyword Bank CLI Command
 * Manage saved keywords and topics for future use
 */

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

const KeywordBank = require('../../utils/keywordBank');

const keywordBankCommand = new Command('keyword-bank')
  .description('Manage keyword bank - view, search, and use saved keywords/topics')
  .option('-s, --stats', 'Show bank statistics')
  .option('-l, --list', 'List unused keywords/topics')
  .option('-u, --use', 'Use keywords/topics from bank')
  .option('-e, --export <format>', 'Export bank data (json/csv)')
  .action(async (options) => {
    const keywordBank = new KeywordBank();
    
    try {
      if (options.stats) {
        // Show statistics
        keywordBank.displayStats();
        return;
      }
      
      if (options.list) {
        // List unused items
        const unusedKeywords = keywordBank.getUnusedKeywords(10);
        const unusedTopics = keywordBank.getUnusedTopics(5);
        
        console.log(chalk.cyan('\n📋 Unused Keywords:'));
        unusedKeywords.forEach((keyword, index) => {
          console.log(chalk.white(`${index + 1}. ${keyword.keyword}`));
          console.log(chalk.gray(`   Score: ${keyword.opportunityScore} | Volume: ${keyword.searchVolume} | Competition: ${keyword.competition}`));
        });
        
        console.log(chalk.cyan('\n📝 Unused Topics:'));
        unusedTopics.forEach((topic, index) => {
          console.log(chalk.white(`${index + 1}. ${topic.title}`));
          console.log(chalk.gray(`   Type: ${topic.contentType} | Keyword: ${topic.primaryKeyword}`));
        });
        return;
      }
      
      if (options.use) {
        // Interactive use mode
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              { name: 'Use keywords from bank', value: 'keywords' },
              { name: 'Use topics from bank', value: 'topics' },
              { name: 'Search bank', value: 'search' },
              { name: 'View statistics', value: 'stats' }
            ]
          }
        ]);
        
        if (answers.action === 'keywords') {
          const unusedKeywords = keywordBank.getUnusedKeywords(10);
          
          if (unusedKeywords.length === 0) {
            console.log(chalk.yellow('No unused keywords available. Run keyword research first.'));
            return;
          }
          
          const keywordChoices = unusedKeywords.map((keyword, index) => ({
            name: `${index + 1}. ${keyword.keyword} (Score: ${keyword.opportunityScore})`,
            value: index
          }));
          
          const keywordAnswer = await inquirer.prompt([
            {
              type: 'list',
              name: 'selectedKeyword',
              message: 'Select a keyword to use:',
              choices: keywordChoices
            }
          ]);
          
          const selectedKeyword = unusedKeywords[keywordAnswer.selectedKeyword];
          console.log(chalk.green(`\n✅ Selected: ${selectedKeyword.keyword}`));
          console.log(chalk.gray('You can now use this keyword for content generation.'));
          
          // Mark as used
          keywordBank.markKeywordUsed(selectedKeyword.keyword);
          console.log(chalk.gray('Keyword marked as used in bank.'));
          
        } else if (answers.action === 'topics') {
          const unusedTopics = keywordBank.getUnusedTopics(10);
          
          if (unusedTopics.length === 0) {
            console.log(chalk.yellow('No unused topics available. Run keyword research first.'));
            return;
          }
          
          const topicChoices = unusedTopics.map((topic, index) => ({
            name: `${index + 1}. ${topic.title} (${topic.contentType})`,
            value: index
          }));
          
          const topicAnswer = await inquirer.prompt([
            {
              type: 'list',
              name: 'selectedTopic',
              message: 'Select a topic to use:',
              choices: topicChoices
            }
          ]);
          
          const selectedTopic = unusedTopics[topicAnswer.selectedTopic];
          console.log(chalk.green(`\n✅ Selected: ${selectedTopic.title}`));
          console.log(chalk.gray('You can now use this topic for content generation.'));
          
          // Mark as used
          keywordBank.markTopicUsed(selectedTopic.title);
          console.log(chalk.gray('Topic marked as used in bank.'));
          
        } else if (answers.action === 'search') {
          const searchAnswer = await inquirer.prompt([
            {
              type: 'input',
              name: 'query',
              message: 'Search keywords (e.g., "gifts", "tech", "eco"):',
              validate: (input) => input.trim().length > 0 ? true : 'Search query is required'
            }
          ]);
          
          const results = keywordBank.searchKeywords(searchAnswer.query, 10);
          
          if (results.length === 0) {
            console.log(chalk.yellow('No keywords found matching your search.'));
            return;
          }
          
          console.log(chalk.cyan(`\n🔍 Search Results for "${searchAnswer.query}":`));
          results.forEach((keyword, index) => {
            console.log(chalk.white(`${index + 1}. ${keyword.keyword}`));
            console.log(chalk.gray(`   Score: ${keyword.opportunityScore} | Used: ${keyword.used ? 'Yes' : 'No'}`));
          });
          
        } else if (answers.action === 'stats') {
          keywordBank.displayStats();
        }
        
        return;
      }
      
      if (options.export) {
        // Export bank data
        const format = options.export.toLowerCase();
        if (!['json', 'csv'].includes(format)) {
          console.log(chalk.red('Invalid format. Use "json" or "csv".'));
          return;
        }
        
        const data = keywordBank.exportBank(format);
        const timestamp = new Date().toISOString().split('T')[0];
        
        if (format === 'csv') {
          console.log(chalk.green('\n📊 Keywords CSV:'));
          console.log(data.keywords);
          console.log(chalk.green('\n📝 Topics CSV:'));
          console.log(data.topics);
        } else {
          console.log(chalk.green('\n📊 Bank Data (JSON):'));
          console.log(JSON.stringify(data, null, 2));
        }
        
        return;
      }
      
      // Default: show statistics
      keywordBank.displayStats();
      
    } catch (error) {
      console.error(chalk.red('Keyword bank operation failed:'), error.message);
      process.exit(1);
    }
  });

module.exports = keywordBankCommand; 