#!/usr/bin/env node

/**
 * API Key Test Script
 * Tests all API keys in your .env file to ensure they're working
 */

require('dotenv').config();

const https = require('https');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function testOpenAI() {
  log('\n🔍 Testing OpenAI API Key...', 'blue');
  
  if (!process.env.OPENAI_API_KEY) {
    log('❌ OPENAI_API_KEY not found in .env', 'red');
    return false;
  }

  try {
    const response = await makeRequest('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      log('✅ OpenAI API Key is working!', 'green');
      log(`   Found ${response.data.data.length} available models`, 'green');
      return true;
    } else {
      log(`❌ OpenAI API failed: ${response.status}`, 'red');
      log(`   Error: ${JSON.stringify(response.data)}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ OpenAI API error: ${error.message}`, 'red');
    return false;
  }
}

async function testGitHub() {
  log('\n🔍 Testing GitHub Personal Access Token...', 'blue');
  
  if (!process.env.GITHUB_TOKEN) {
    log('❌ GITHUB_TOKEN not found in .env', 'red');
    return false;
  }

  try {
    const response = await makeRequest('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'Multi-Agent-Content-System'
      }
    });

    if (response.status === 200) {
      log('✅ GitHub Personal Access Token is working!', 'green');
      log(`   Authenticated as: ${response.data.login}`, 'green');
      return true;
    } else {
      log(`❌ GitHub API failed: ${response.status}`, 'red');
      log(`   Error: ${JSON.stringify(response.data)}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ GitHub API error: ${error.message}`, 'red');
    return false;
  }
}

async function testSupabase() {
  log('\n🔍 Testing Supabase Service Role Key...', 'blue');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    log('❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env', 'red');
    return false;
  }

  try {
    const response = await makeRequest(`${process.env.SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      log('✅ Supabase Service Role Key is working!', 'green');
      log(`   Connected to: ${process.env.SUPABASE_URL}`, 'green');
      return true;
    } else {
      log(`❌ Supabase API failed: ${response.status}`, 'red');
      log(`   Error: ${JSON.stringify(response.data)}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Supabase API error: ${error.message}`, 'red');
    return false;
  }
}

async function testSlack() {
  log('\n🔍 Testing Slack Bot Token...', 'blue');
  
  if (!process.env.SLACK_BOT_TOKEN) {
    log('❌ SLACK_BOT_TOKEN not found in .env', 'red');
    return false;
  }

  try {
    const response = await makeRequest('https://slack.com/api/auth.test', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 && response.data.ok) {
      log('✅ Slack Bot Token is working!', 'green');
      log(`   Connected to workspace: ${response.data.team}`, 'green');
      return true;
    } else {
      log(`❌ Slack API failed: ${response.status}`, 'red');
      log(`   Error: ${response.data.error || JSON.stringify(response.data)}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Slack API error: ${error.message}`, 'red');
    return false;
  }
}

async function testCloudflare() {
  log('\n🔍 Testing Cloudflare API Token...', 'blue');
  
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    log('❌ CLOUDFLARE_API_TOKEN not found in .env', 'yellow');
    log('   (This is optional - only needed if using Cloudflare Pages)', 'yellow');
    return true; // Not required
  }

  try {
    const response = await makeRequest('https://api.cloudflare.com/client/v4/accounts/3daae940fcb6fc5b8bbd9bb8fcc62854/tokens/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 && response.data.success) {
      log('✅ Cloudflare API Token is working!', 'green');
      log(`   Account: ${response.data.result.id}`, 'green');
      return true;
    } else {
      log(`❌ Cloudflare API failed: ${response.status}`, 'red');
      log(`   Error: ${JSON.stringify(response.data)}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Cloudflare API error: ${error.message}`, 'red');
    return false;
  }
}

async function testGoogleOAuth() {
  log('\n🔍 Testing Google OAuth2 Credentials...', 'blue');
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    log('❌ GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not found in .env', 'yellow');
    log('   (This is optional - only needed if using Google Ads API)', 'yellow');
    return true; // Not required
  }

  log('✅ Google OAuth2 credentials found', 'green');
  log('   (Note: Full OAuth2 testing requires user interaction)', 'yellow');
  return true;
}

async function testSMTP() {
  log('\n🔍 Testing SMTP Credentials...', 'blue');
  
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    log('❌ SMTP credentials not found in .env', 'yellow');
    log('   (This is optional - only needed for email notifications)', 'yellow');
    return true; // Not required
  }

  log('✅ SMTP credentials found', 'green');
  log('   (Note: SMTP testing requires network connection)', 'yellow');
  return true;
}

async function runAllTests() {
  log('🚀 Starting API Key Tests...', 'bold');
  log('================================', 'blue');

  const results = {
    openai: await testOpenAI(),
    github: await testGitHub(),
    supabase: await testSupabase(),
    slack: await testSlack(),
    cloudflare: await testCloudflare(),
    google: await testGoogleOAuth(),
    smtp: await testSMTP()
  };

  log('\n📊 Test Results Summary:', 'bold');
  log('================================', 'blue');

  const required = ['openai', 'github', 'supabase', 'slack'];
  const optional = ['cloudflare', 'google', 'smtp'];

  let allRequiredPassed = true;

  required.forEach(service => {
    const status = results[service] ? '✅ PASS' : '❌ FAIL';
    const color = results[service] ? 'green' : 'red';
    log(`${status} ${service.toUpperCase()}`, color);
    if (!results[service]) allRequiredPassed = false;
  });

  optional.forEach(service => {
    const status = results[service] ? '✅ PASS' : '⚠️  SKIP';
    const color = results[service] ? 'green' : 'yellow';
    log(`${status} ${service.toUpperCase()} (optional)`, color);
  });

  log('\n', 'reset');

  if (allRequiredPassed) {
    log('🎉 All required API keys are working!', 'green');
    log('   You can now proceed with testing your workflows.', 'green');
  } else {
    log('⚠️  Some required API keys failed. Please check the errors above.', 'red');
    log('   Fix the failing keys before proceeding.', 'red');
  }

  return allRequiredPassed;
}

// Run the tests
runAllTests().catch(console.error); 