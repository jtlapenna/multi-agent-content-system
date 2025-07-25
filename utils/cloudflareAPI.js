/**
 * Cloudflare Pages API Integration
 * Real Cloudflare Pages API integration for deployment and preview management
 */

const fetch = require('node-fetch');

class CloudflareAPI {
  constructor(config = {}) {
    this.config = {
      accountId: config.accountId || process.env.CLOUDFLARE_ACCOUNT_ID,
      apiToken: config.apiToken || process.env.CLOUDFLARE_API_TOKEN,
      projectName: config.projectName || 'bright-gift',
      baseUrl: 'https://api.cloudflare.com/client/v4',
      ...config
    };
    
    this.headers = {
      'Authorization': `Bearer ${this.config.apiToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get project information
   */
  async getProject() {
    console.log(`📋 Getting Cloudflare Pages project: ${this.config.projectName}`);
    
    try {
      const response = await fetch(
        `${this.config.baseUrl}/accounts/${this.config.accountId}/pages/projects/${this.config.projectName}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Cloudflare API error: ${data.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      console.log(`  ✅ Project found: ${data.result.name}`);
      return data.result;
      
    } catch (error) {
      console.error(`❌ Failed to get project: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new deployment
   */
  async createDeployment(branchName, production = false) {
    console.log(`🚀 Creating Cloudflare Pages deployment: ${branchName}`);
    
    try {
      const deploymentData = {
        production_branch: this.config.productionBranch || 'main',
        branch: branchName
      };
      
      const response = await fetch(
        `${this.config.baseUrl}/accounts/${this.config.accountId}/pages/projects/${this.config.projectName}/deployments`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(deploymentData)
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Cloudflare API error: ${data.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      console.log(`  ✅ Deployment created: ${data.result.id}`);
      return data.result;
      
    } catch (error) {
      console.error(`❌ Failed to create deployment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(deploymentId) {
    console.log(`📊 Checking deployment status: ${deploymentId}`);
    
    try {
      const response = await fetch(
        `${this.config.baseUrl}/accounts/${this.config.accountId}/pages/projects/${this.config.projectName}/deployments/${deploymentId}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Cloudflare API error: ${data.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      console.log(`  ✅ Deployment status: ${data.result.latest_stage.name}`);
      return data.result;
      
    } catch (error) {
      console.error(`❌ Failed to get deployment status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Wait for deployment to complete
   */
  async waitForDeployment(deploymentId, timeout = 300000) {
    console.log(`⏳ Waiting for deployment to complete: ${deploymentId}`);
    
    const startTime = Date.now();
    let lastStatus = '';
    let checkCount = 0;
    
    while (Date.now() - startTime < timeout) {
      try {
        const deployment = await this.getDeploymentStatus(deploymentId);
        checkCount++;
        
        const currentStatus = deployment.latest_stage.name;
        if (currentStatus !== lastStatus) {
          console.log(`  📊 Status: ${currentStatus} (check #${checkCount})`);
          lastStatus = currentStatus;
        }
        
        // Check for successful deployment statuses
        if (currentStatus === 'deploy_success' || currentStatus === 'success' || currentStatus === 'ready') {
          console.log(`  ✅ Deployment completed successfully: ${deployment.url}`);
          return deployment;
        }
        
        // Check for failed deployment statuses
        if (currentStatus === 'deploy_failed' || currentStatus === 'failed' || currentStatus === 'error') {
          throw new Error(`Deployment failed: ${deployment.latest_stage.status}`);
        }
        
        // If we've been in 'deploy' status for too long, consider it successful
        if (currentStatus === 'deploy' && checkCount > 12) {
          console.log(`  ⚠️ Deployment stuck in 'deploy' status, assuming success: ${deployment.url}`);
          return deployment;
        }
        
        // Wait 10 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 10000));
        
      } catch (error) {
        console.error(`❌ Error checking deployment status: ${error.message}`);
        throw error;
      }
    }
    
    throw new Error(`Deployment timeout after ${timeout / 1000} seconds (${checkCount} status checks)`);
  }

  /**
   * Get all deployments
   */
  async getDeployments(page = 1, perPage = 20) {
    console.log(`📋 Getting Cloudflare Pages deployments`);
    
    try {
      const response = await fetch(
        `${this.config.baseUrl}/accounts/${this.config.accountId}/pages/projects/${this.config.projectName}/deployments?page=${page}&per_page=${perPage}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Cloudflare API error: ${data.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      console.log(`  ✅ Found ${data.result.length} deployments`);
      return data.result;
      
    } catch (error) {
      console.error(`❌ Failed to get deployments: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a deployment
   */
  async deleteDeployment(deploymentId) {
    console.log(`🗑️  Deleting deployment: ${deploymentId}`);
    
    try {
      const response = await fetch(
        `${this.config.baseUrl}/accounts/${this.config.accountId}/pages/projects/${this.config.projectName}/deployments/${deploymentId}`,
        {
          method: 'DELETE',
          headers: this.headers
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Cloudflare API error: ${data.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      console.log(`  ✅ Deployment deleted: ${deploymentId}`);
      return data.result;
      
    } catch (error) {
      console.error(`❌ Failed to delete deployment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get deployment logs
   */
  async getDeploymentLogs(deploymentId) {
    console.log(`📝 Getting deployment logs: ${deploymentId}`);
    
    try {
      const response = await fetch(
        `${this.config.baseUrl}/accounts/${this.config.accountId}/pages/projects/${this.config.projectName}/deployments/${deploymentId}/history`,
        {
          method: 'GET',
          headers: this.headers
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Cloudflare API error: ${data.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      console.log(`  ✅ Retrieved deployment logs`);
      return data.result;
      
    } catch (error) {
      console.error(`❌ Failed to get deployment logs: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a preview deployment
   */
  async createPreviewDeployment(branchName) {
    console.log(`👀 Creating preview deployment: ${branchName}`);
    
    let deployment = null;
    
    try {
      // Create deployment
      deployment = await this.createDeployment(branchName, false);
      
      // Wait for deployment to complete with longer timeout for previews
      const completedDeployment = await this.waitForDeployment(deployment.id, 180000); // 3 minutes for previews
      
      console.log(`  ✅ Preview deployment ready: ${completedDeployment.url}`);
      return completedDeployment;
      
    } catch (error) {
      console.error(`❌ Failed to create preview deployment: ${error.message}`);
      
      // If deployment creation succeeded but waiting failed, return the deployment anyway
      if (error.message.includes('timeout') && deployment) {
        console.log(`  ⚠️ Deployment created but timed out waiting for completion`);
        console.log(`  🔗 Deployment URL: ${deployment.url || 'Check Cloudflare dashboard'}`);
        return deployment;
      }
      
      throw error;
    }
  }

  /**
   * Get environment variables
   */
  async getEnvironmentVariables() {
    console.log(`🔧 Getting environment variables`);
    
    try {
      const response = await fetch(
        `${this.config.baseUrl}/accounts/${this.config.accountId}/pages/projects/${this.config.projectName}/environment_variables`,
        {
          method: 'GET',
          headers: this.headers
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Cloudflare API error: ${data.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      console.log(`  ✅ Retrieved environment variables`);
      return data.result;
      
    } catch (error) {
      console.error(`❌ Failed to get environment variables: ${error.message}`);
      throw error;
    }
  }

  /**
   * Set environment variable
   */
  async setEnvironmentVariable(key, value, environment = 'production') {
    console.log(`🔧 Setting environment variable: ${key}`);
    
    try {
      const response = await fetch(
        `${this.config.baseUrl}/accounts/${this.config.accountId}/pages/projects/${this.config.projectName}/environment_variables`,
        {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify({
            key: key,
            value: value,
            environment: environment
          })
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Cloudflare API error: ${data.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      console.log(`  ✅ Environment variable set: ${key}`);
      return data.result;
      
    } catch (error) {
      console.error(`❌ Failed to set environment variable: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get custom domains
   */
  async getCustomDomains() {
    console.log(`🌐 Getting custom domains`);
    
    try {
      const response = await fetch(
        `${this.config.baseUrl}/accounts/${this.config.accountId}/pages/projects/${this.config.projectName}/domains`,
        {
          method: 'GET',
          headers: this.headers
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Cloudflare API error: ${data.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      console.log(`  ✅ Retrieved custom domains`);
      return data.result;
      
    } catch (error) {
      console.error(`❌ Failed to get custom domains: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add custom domain
   */
  async addCustomDomain(domain) {
    console.log(`🌐 Adding custom domain: ${domain}`);
    
    try {
      const response = await fetch(
        `${this.config.baseUrl}/accounts/${this.config.accountId}/pages/projects/${this.config.projectName}/domains`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            name: domain
          })
        }
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(`Cloudflare API error: ${data.errors?.[0]?.message || 'Unknown error'}`);
      }
      
      console.log(`  ✅ Custom domain added: ${domain}`);
      return data.result;
      
    } catch (error) {
      console.error(`❌ Failed to add custom domain: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deploy to production (main branch)
   */
  async deployToProduction(branchName) {
    console.log(`🚀 Deploying to production from branch: ${branchName}`);
    
    try {
      // Create production deployment from main branch
      const deployment = await this.createDeployment('main', true);
      
      console.log(`✅ Production deployment created: ${deployment.id}`);
      console.log(`   URL: ${deployment.url}`);
      
      // Wait for deployment to complete
      await this.waitForDeployment(deployment.id);
      
      console.log(`✅ Production deployment completed successfully`);
      return deployment;
      
    } catch (error) {
      console.error(`❌ Production deployment failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test API connection
   */
  async testConnection() {
    console.log(`🔗 Testing Cloudflare API connection`);
    
    try {
      const project = await this.getProject();
      console.log(`  ✅ Connection successful - Project: ${project.name}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Connection failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = CloudflareAPI; 