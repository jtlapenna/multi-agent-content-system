/**
 * GitHub API Integration
 * Real GitHub API integration for branch creation, content management, and deployment
 */

const fs = require('fs').promises;
const path = require('path');

class GitHubAPI {
  constructor(config = {}) {
    this.config = {
      owner: config.owner || 'jtlapenna',
      repo: config.repo || 'blog-automation',
      branch: config.branch || 'main',
      token: config.token || process.env.GITHUB_TOKEN,
      ...config
    };
    
    this.workflowDir = './workflow';
    this.octokit = null;
  }

  async initialize() {
    if (!this.octokit) {
      const { Octokit } = await import('@octokit/rest');
      this.octokit = new Octokit({
        auth: this.config.token
      });
    }
  }

  /**
   * Create a new branch from main
   */
  async createBranch(branchName) {
    console.log(`🌿 Creating GitHub branch: ${branchName}`);
    
    try {
      await this.initialize();
      
      // 1. Get the latest commit SHA from main branch
      const { data: ref } = await this.octokit.git.getRef({
        owner: this.config.owner,
        repo: this.config.repo,
        ref: `heads/${this.config.branch}`
      });
      
      const latestCommitSha = ref.object.sha;
      
      // 2. Create new branch
      await this.octokit.git.createRef({
        owner: this.config.owner,
        repo: this.config.repo,
        ref: `refs/heads/${branchName}`,
        sha: latestCommitSha
      });
      
      console.log(`  ✅ Branch created: ${branchName}`);
      return branchName;
      
    } catch (error) {
      console.error(`❌ Failed to create branch: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload content to a branch
   */
  async uploadContent(branchName, content, filePath) {
    console.log(`📤 Uploading content to branch: ${branchName}`);
    
    try {
      await this.initialize();
      
      // 1. Get the current tree SHA
      const { data: branch } = await this.octokit.repos.getBranch({
        owner: this.config.owner,
        repo: this.config.repo,
        branch: branchName
      });
      
      const baseTreeSha = branch.commit.commit.tree.sha;
      
      // 2. Create blob for the content
      const { data: blob } = await this.octokit.git.createBlob({
        owner: this.config.owner,
        repo: this.config.repo,
        content: JSON.stringify(content, null, 2),
        encoding: 'utf-8'
      });
      
      // 3. Create tree with the new file
      const { data: tree } = await this.octokit.git.createTree({
        owner: this.config.owner,
        repo: this.config.repo,
        base_tree: baseTreeSha,
        tree: [
          {
            path: filePath,
            mode: '100644',
            type: 'blob',
            sha: blob.sha
          }
        ]
      });
      
      // 4. Create commit
      const { data: commit } = await this.octokit.git.createCommit({
        owner: this.config.owner,
        repo: this.config.repo,
        message: `Add preview content: ${content.blog?.title || 'New content'}`,
        tree: tree.sha,
        parents: [branch.commit.sha]
      });
      
      // 5. Update branch reference
      await this.octokit.git.updateRef({
        owner: this.config.owner,
        repo: this.config.repo,
        ref: `heads/${branchName}`,
        sha: commit.sha
      });
      
      console.log(`  ✅ Content uploaded: ${filePath}`);
      return commit.sha;
      
    } catch (error) {
      console.error(`❌ Failed to upload content: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload images to a branch
   */
  async uploadImages(branchName, images, imageDir) {
    console.log(`🖼️  Uploading images to branch: ${branchName}`);
    
    try {
      await this.initialize();
      
      // 1. Get the current tree SHA
      const { data: branch } = await this.octokit.repos.getBranch({
        owner: this.config.owner,
        repo: this.config.repo,
        branch: branchName
      });
      
      const baseTreeSha = branch.commit.commit.tree.sha;
      
      // 2. Create blobs for each image
      const treeEntries = [];
      
      for (const image of images) {
        if (image.webp) {
          const imageContent = await fs.readFile(image.webp);
          const { data: blob } = await this.octokit.git.createBlob({
            owner: this.config.owner,
            repo: this.config.repo,
            content: imageContent.toString('base64'),
            encoding: 'base64'
          });
          
          treeEntries.push({
            path: `public/images/blog/${imageDir}/${path.basename(image.webp)}`,
            mode: '100644',
            type: 'blob',
            sha: blob.sha
          });
        }
        
        if (image.jpg) {
          const imageContent = await fs.readFile(image.jpg);
          const { data: blob } = await this.octokit.git.createBlob({
            owner: this.config.owner,
            repo: this.config.repo,
            content: imageContent.toString('base64'),
            encoding: 'base64'
          });
          
          treeEntries.push({
            path: `public/images/blog/${imageDir}/${path.basename(image.jpg)}`,
            mode: '100644',
            type: 'blob',
            sha: blob.sha
          });
        }
      }
      
      // 3. Create tree with images
      const { data: tree } = await this.octokit.git.createTree({
        owner: this.config.owner,
        repo: this.config.repo,
        base_tree: baseTreeSha,
        tree: treeEntries
      });
      
      // 4. Create commit
      const { data: commit } = await this.octokit.git.createCommit({
        owner: this.config.owner,
        repo: this.config.repo,
        message: `Add images for ${imageDir}`,
        tree: tree.sha,
        parents: [branch.commit.sha]
      });
      
      // 5. Update branch reference
      await this.octokit.git.updateRef({
        owner: this.config.owner,
        repo: this.config.repo,
        ref: `heads/${branchName}`,
        sha: commit.sha
      });
      
      console.log(`  ✅ Images uploaded: ${treeEntries.length} files`);
      return commit.sha;
      
    } catch (error) {
      console.error(`❌ Failed to upload images: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a pull request
   */
  async createPullRequest(branchName, title, description) {
    console.log(`🔀 Creating pull request for: ${branchName}`);
    
    try {
      await this.initialize();
      
      const { data: pr } = await this.octokit.pulls.create({
        owner: this.config.owner,
        repo: this.config.repo,
        title: title,
        body: description,
        head: branchName,
        base: this.config.branch
      });
      
      console.log(`  ✅ Pull request created: #${pr.number}`);
      return pr;
      
    } catch (error) {
      console.error(`❌ Failed to create pull request: ${error.message}`);
      throw error;
    }
  }

  /**
   * Merge a pull request
   */
  async mergePullRequest(prNumber) {
    console.log(`🔀 Merging pull request: #${prNumber}`);
    
    try {
      await this.initialize();
      
      const { data: result } = await this.octokit.pulls.merge({
        owner: this.config.owner,
        repo: this.config.repo,
        pull_number: prNumber,
        merge_method: 'squash'
      });
      
      console.log(`  ✅ Pull request merged: #${prNumber}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to merge pull request: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a branch
   */
  async deleteBranch(branchName) {
    console.log(`🗑️  Deleting branch: ${branchName}`);
    
    try {
      await this.initialize();
      
      await this.octokit.git.deleteRef({
        owner: this.config.owner,
        repo: this.config.repo,
        ref: `heads/${branchName}`
      });
      
      console.log(`  ✅ Branch deleted: ${branchName}`);
      
    } catch (error) {
      console.error(`❌ Failed to delete branch: ${error.message}`);
      // Don't throw error for branch deletion failures
    }
  }

  /**
   * Get branch information
   */
  async getBranch(branchName) {
    try {
      await this.initialize();
      
      const { data: branch } = await this.octokit.repos.getBranch({
        owner: this.config.owner,
        repo: this.config.repo,
        branch: branchName
      });
      
      return branch;
      
    } catch (error) {
      console.error(`❌ Failed to get branch: ${error.message}`);
      return null;
    }
  }

  /**
   * Check if branch exists
   */
  async branchExists(branchName) {
    const branch = await this.getBranch(branchName);
    return !!branch;
  }

  /**
   * Get repository information
   */
  async getRepository() {
    try {
      await this.initialize();
      
      const { data: repo } = await this.octokit.repos.get({
        owner: this.config.owner,
        repo: this.config.repo
      });
      
      return repo;
      
    } catch (error) {
      console.error(`❌ Failed to get repository: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get recent commits
   */
  async getRecentCommits(branchName = this.config.branch, perPage = 10) {
    try {
      await this.initialize();
      
      const { data: commits } = await this.octokit.repos.listCommits({
        owner: this.config.owner,
        repo: this.config.repo,
        sha: branchName,
        per_page: perPage
      });
      
      return commits;
      
    } catch (error) {
      console.error(`❌ Failed to get commits: ${error.message}`);
      return [];
    }
  }

  /**
   * Create a release
   */
  async createRelease(tagName, title, body) {
    console.log(`🏷️  Creating release: ${tagName}`);
    
    try {
      await this.initialize();
      
      const { data: release } = await this.octokit.repos.createRelease({
        owner: this.config.owner,
        repo: this.config.repo,
        tag_name: tagName,
        name: title,
        body: body,
        draft: false,
        prerelease: false
      });
      
      console.log(`  ✅ Release created: ${tagName}`);
      return release;
      
    } catch (error) {
      console.error(`❌ Failed to create release: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get workflow runs
   */
  async getWorkflowRuns(workflowId = null, branch = null) {
    try {
      await this.initialize();
      
      const params = {
        owner: this.config.owner,
        repo: this.config.repo
      };
      
      if (workflowId) {
        params.workflow_id = workflowId;
      }
      
      if (branch) {
        params.branch = branch;
      }
      
      const { data: runs } = await this.octokit.actions.listWorkflowRuns(params);
      
      return runs.workflow_runs;
      
    } catch (error) {
      console.error(`❌ Failed to get workflow runs: ${error.message}`);
      return [];
    }
  }

  /**
   * Trigger a workflow
   */
  async triggerWorkflow(workflowId, ref = this.config.branch, inputs = {}) {
    console.log(`🚀 Triggering workflow: ${workflowId}`);
    
    try {
      await this.initialize();
      
      const { data: result } = await this.octokit.actions.createWorkflowDispatch({
        owner: this.config.owner,
        repo: this.config.repo,
        workflow_id: workflowId,
        ref: ref,
        inputs: inputs
      });
      
      console.log(`  ✅ Workflow triggered: ${workflowId}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to trigger workflow: ${error.message}`);
      throw error;
    }
  }
}

module.exports = GitHubAPI; 