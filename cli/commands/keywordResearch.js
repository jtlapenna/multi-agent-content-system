/**
 * Keyword Research CLI Command
 * Data-driven approach: Start with keyword research, then generate topics
 */

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const path = require('path');
const fs = require('fs');

const KeywordResearchGenerator = require('../../generators/keywordResearch');

const keywordResearchCommand = new Command('keyword-research')
  .description('Conduct data-driven keyword research for highest SEO opportunities')
  .option('-o, --output <file>', 'Output file for results')
  .option('--no-save', 'Skip saving results to file')
  .action(async (options) => {
    const spinner = ora('Initializing keyword research...').start();
    
    try {
      spinner.text = 'Loading keyword research generator...';
      const generator = new KeywordResearchGenerator();
      
      spinner.text = 'Conducting keyword research...';
      // Conduct comprehensive keyword research with timeout
      const results = await Promise.race([
        generator.conductKeywordResearch(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Keyword research timeout - took longer than 2 minutes')), 120000)
        )
      ]);
      
      spinner.succeed('Keyword research completed successfully!');
      
      // Display results
      console.log(chalk.green('\n🎯 Keyword Research Results'));
      console.log(chalk.gray('='.repeat(60)));
      
      // Show top keyword opportunities
      console.log(chalk.cyan('\n📊 Top Keyword Opportunities:'));
      results.keywordAnalyses.slice(0, 10).forEach((keyword, index) => {
        const score = keyword.opportunityScore;
        const volume = keyword.searchVolume;
        const competition = keyword.competition;
        const opportunities = keyword.opportunities.length;
        
        console.log(chalk.white(`${index + 1}. ${keyword.keyword}`));
        console.log(chalk.gray(`   Score: ${score} | Volume: ${volume} | Competition: ${competition} | Opportunities: ${opportunities}`));
        
        if (keyword.opportunities.length > 0) {
          console.log(chalk.yellow(`   Opportunities: ${keyword.opportunities.join(', ')}`));
        }
        console.log('');
      });
      
      // Show generated topics
      console.log(chalk.cyan('\n📝 Generated Topics from Best Keywords:'));
      results.topics.slice(0, 5).forEach((topic, index) => {
        console.log(chalk.white(`${index + 1}. ${topic.title}`));
        console.log(chalk.gray(`   Type: ${topic.contentType} | Volume: ${topic.searchVolume} | Competition: ${topic.competitionLevel}`));
        console.log(chalk.gray(`   Primary: ${topic.primaryKeyword}`));
        if (topic.opportunities && topic.opportunities.length > 0) {
          console.log(chalk.yellow(`   Opportunities: ${topic.opportunities.join(', ')}`));
        }
        console.log('');
      });
      
      // Show content analysis
      if (results.analysis) {
        console.log(chalk.cyan('\n📈 Content Analysis:'));
        console.log(chalk.gray(`Total existing posts: ${results.analysis.total}`));
        console.log(chalk.gray(`Gift guides: ${results.analysis.byType['gift-guide']} (${((results.analysis.byType['gift-guide'] / results.analysis.total) * 100).toFixed(1)}%)`));
        console.log(chalk.gray(`Educational: ${results.analysis.byType['educational']} (${((results.analysis.byType['educational'] / results.analysis.total) * 100).toFixed(1)}%)`));
        console.log(chalk.gray(`Data-driven: ${results.analysis.byType['data-driven']} (${((results.analysis.byType['data-driven'] / results.analysis.total) * 100).toFixed(1)}%)`));
      }
      
      // Show recommendations
      if (results.recommendations && results.recommendations.length > 0) {
        console.log(chalk.yellow('\n🎯 Content Type Recommendations:'));
        results.recommendations.forEach(rec => {
          console.log(chalk.yellow(`• ${rec.type.toUpperCase()}: ${rec.reason}`));
        });
      }
      
      // Save results
      if (options.save !== false) {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = options.output || `keyword-research-${timestamp}.json`;
        const outputPath = path.resolve('seo-results', filename);
        
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Save comprehensive results
        const saveData = {
          timestamp: new Date().toISOString(),
          keywordAnalyses: results.keywordAnalyses,
          topics: results.topics,
          analysis: results.analysis,
          recommendations: results.recommendations,
          summary: {
            totalKeywordsAnalyzed: results.keywordAnalyses.length,
            topOpportunityScore: results.keywordAnalyses[0]?.opportunityScore || 0,
            averageOpportunityScore: results.keywordAnalyses.reduce((sum, k) => sum + k.opportunityScore, 0) / results.keywordAnalyses.length,
            topicsGenerated: results.topics.length,
            contentTypes: results.topics.reduce((acc, topic) => {
              acc[topic.contentType] = (acc[topic.contentType] || 0) + 1;
              return acc;
            }, {})
          }
        };
        
        fs.writeFileSync(outputPath, JSON.stringify(saveData, null, 2));
        console.log(chalk.green(`\n✅ Results saved to: ${outputPath}`));
      }
      
      // Interactive next steps
      console.log(chalk.cyan('\n🚀 Next Steps:'));
      console.log(chalk.gray('1. Review the top keyword opportunities above'));
      console.log(chalk.gray('2. Choose topics to generate content for'));
      console.log(chalk.gray('3. Run: npm start generate -- --seo-results <filename>'));
      
      // Ask if user wants to generate content now
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'generateNow',
          message: 'Would you like to generate content for one of these topics now?',
          default: false
        }
      ]);
      
      if (answers.generateNow) {
        // Show topic selection
        const topicChoices = results.topics.slice(0, 5).map((topic, index) => ({
          name: `${index + 1}. ${topic.title} (${topic.contentType})`,
          value: index
        }));
        
        const topicAnswer = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedTopic',
            message: 'Which topic would you like to generate?',
            choices: topicChoices
          }
        ]);
        
        const selectedTopic = results.topics[topicAnswer.selectedTopic];
        console.log(chalk.cyan(`\n🎯 Generating content for: ${selectedTopic.title}`));
        
        // Generate content using the hybrid blog generator
        console.log(chalk.cyan(`\n🎯 Generating content for: ${selectedTopic.title}`));
        
        const BlogHybridGenerator = require('../../generators/blogHybrid');
        const generator = new BlogHybridGenerator();
        
        const blogData = {
          topic: selectedTopic.title,
          contentType: selectedTopic.contentType,
          keywords: selectedTopic.primaryKeyword,
          seoData: saveData,
          blogIdea: selectedTopic
        };
        
        const result = await generator.generateBlogPost(blogData);
        
        console.log(chalk.green('\n✅ Content Generated Successfully!'));
        console.log(chalk.gray(`File: ${result.filePath}`));
        console.log(chalk.gray(`Word Count: ${result.wordCount}`));
        
        // Ask if user wants to publish to GitHub
        const publishAnswer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'publish',
            message: 'Would you like to publish this content to GitHub?',
            default: false
          }
        ]);
        
        if (publishAnswer.publish) {
          const GitHubAutomation = require('../../utils/githubAutomation');
          const github = new GitHubAutomation();
          
          const contentData = {
            title: selectedTopic.title,
            slug: result.slug,
            contentType: selectedTopic.contentType,
            content: result.content
          };
          
          await github.publishContent(contentData);
        }
      }
      
    } catch (error) {
      spinner.fail('Keyword research failed');
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

module.exports = keywordResearchCommand; 