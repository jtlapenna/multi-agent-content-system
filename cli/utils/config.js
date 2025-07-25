const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Load site configuration
 * @param {string} siteName - Optional site name, defaults to 'bright-gift'
 * @returns {Object} Site configuration
 */
async function loadConfig(siteName = 'bright-gift') {
  const configPath = path.join(process.cwd(), 'config', 'sites', `${siteName}.json`);
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    
    // Validate required fields
    validateConfig(config);
    
    return config;
  } catch (error) {
    throw new Error(`Failed to load configuration: ${error.message}`);
  }
}

/**
 * Validate configuration structure
 * @param {Object} config - Configuration object
 */
function validateConfig(config) {
  const required = [
    'name', 'domain', 'contentDir', 'imagesDir', 
    'affiliatePrograms', 'socialPlatforms', 'imageGeneration'
  ];

  for (const field of required) {
    if (!config[field]) {
      throw new Error(`Missing required configuration field: ${field}`);
    }
  }
}

/**
 * Create default Bright-Gift configuration
 * @returns {Object} Default configuration
 */
function createDefaultConfig() {
  return {
    "name": "Bright-Gift",
    "domain": "bright-gift.com",
    "contentDir": "src/content/blog",
    "imagesDir": "public/images/blog",
    "socialPostsDir": "_workflow-documents/social-posts",
    "styleGuide": "reference/_workflow-documents/planning/04.2_blog_style_guide.md",
    "seoGuide": "reference/_workflow-documents/planning/04.3_SEO_Guide.md",
    "brand": {
      "colors": ["#00A99D", "#FF6B35", "#FFD700"],
      "style": "modern-flat-illustration",
      "tone": "friendly, helpful, gift-focused"
    },
    "content": {
      "types": ["gift-guide", "educational", "data-driven"],
      "seo": {
        "primaryKeywords": ["gift ideas", "gift guide", "unique gifts"],
        "competitors": ["giftlab.com", "giftadvisor.com", "uncommongoods.com"],
        "targetAudience": "gift-givers, shoppers, gift enthusiasts"
      }
    },
    "affiliatePrograms": {
      "amazon": {
        "enabled": true,
        "tag": "brightgift-20"
      },
      "bookshop": {
        "enabled": true,
        "tag": "brightgift"
      },
      "afrofiliate": {
        "enabled": true,
        "brands": []
      }
    },
    "socialPlatforms": {
      "twitter": {
        "enabled": false,
        "apiKey": "",
        "apiSecret": ""
      },
      "instagram": {
        "enabled": false,
        "accessToken": ""
      },
      "pinterest": {
        "enabled": false,
        "accessToken": ""
      },
      "facebook": {
        "enabled": false,
        "accessToken": ""
      },
      "bluesky": {
        "enabled": false,
        "identifier": "",
        "password": ""
      }
    },
    "imageGeneration": {
      "model": "gpt-image-1",
      "style": "brightgift-style",
      "dimensions": {
        "banner": "1200x630",
        "social": "1200x1200",
        "og": "1200x630"
      },
      "prompts": {
        "banner": "Create a bright, modern banner image for a gift guide blog post. Use bright colors and clean design.",
        "social": "Create a square social media image for gift ideas. Modern, clean, and engaging design.",
        "og": "Create an Open Graph image for a gift guide. Professional and appealing design."
      }
    },
    "automation": {
      "gitWorkflow": {
        "enabled": true,
        "branchPrefix": "content/",
        "autoCommit": true,
        "autoPush": false
      },
      "preview": {
        "enabled": true,
        "port": 3000,
        "autoOpen": true
      },
      "scheduling": {
        "enabled": false,
        "optimalTimes": {
          "twitter": ["9:00", "12:00", "17:00"],
          "instagram": ["11:00", "15:00", "19:00"],
          "pinterest": ["8:00", "13:00", "20:00"]
        }
      }
    }
  };
}

/**
 * Save configuration to file
 * @param {Object} config - Configuration object
 * @param {string} siteName - Site name for filename
 */
function saveConfig(config, siteName = 'bright-gift') {
  const configDir = path.join(process.cwd(), 'config', 'sites');
  const configPath = path.join(configDir, `${siteName}.json`);
  
  // Ensure directory exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(chalk.green(`✅ Configuration saved to: ${configPath}`));
  } catch (error) {
    throw new Error(`Failed to save configuration: ${error.message}`);
  }
}

/**
 * Get environment variables
 * @returns {Object} Environment configuration
 */
function getEnvConfig() {
  return {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'
    },
    cursor: {
      apiKey: process.env.CURSOR_API_KEY
    },
    gptImage: {
      apiKey: process.env.GPT_IMAGE_API_KEY
    }
  };
}

/**
 * Validate environment configuration
 * @returns {boolean} True if valid
 */
function validateEnvConfig() {
  const env = getEnvConfig();
  const required = ['openai.apiKey'];
  
  for (const key of required) {
    const value = key.split('.').reduce((obj, k) => obj?.[k], env);
    if (!value) {
      throw new Error(`Missing required environment variable: ${key.toUpperCase()}`);
    }
  }
  
  return true;
}

module.exports = {
  loadConfig,
  validateConfig,
  createDefaultConfig,
  saveConfig,
  getEnvConfig,
  validateEnvConfig
}; 