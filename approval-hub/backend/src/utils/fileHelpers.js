const fs = require('fs').promises;
const path = require('path');

class FileHelpers {
  constructor() {
    this.workflowDir = path.join(process.cwd(), '..', '..', 'workflow');
    this.previewDir = path.join(this.workflowDir, '09-preview-ready');
    this.approvalsDir = path.join(this.workflowDir, 'approvals');
  }

  // Get all pending posts from the preview directory
  async getPendingPosts() {
    try {
      const files = await fs.readdir(this.previewDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const posts = [];
      for (const file of jsonFiles) {
        try {
          const content = await fs.readFile(path.join(this.previewDir, file), 'utf8');
          const post = JSON.parse(content);
          posts.push({
            id: file.replace('.json', ''),
            filename: file,
            ...post
          });
        } catch (error) {
          console.error(`Error reading file ${file}:`, error.message);
        }
      }
      
      return posts;
    } catch (error) {
      console.error('Error getting pending posts:', error.message);
      return [];
    }
  }

  // Get a specific post by ID
  async getPostById(postId) {
    try {
      const filename = `${postId}.json`;
      const filePath = path.join(this.previewDir, filename);
      
      const content = await fs.readFile(filePath, 'utf8');
      const post = JSON.parse(content);
      
      return {
        id: postId,
        filename,
        ...post
      };
    } catch (error) {
      console.error(`Error getting post ${postId}:`, error.message);
      return null;
    }
  }

  // Approve a post - move to approved status
  async approvePost(postId, approverInfo = {}) {
    try {
      const post = await this.getPostById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Create approval record
      const approvalId = `approval-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const approvalData = {
        postId,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approver: approverInfo.name || 'Unknown',
        approverEmail: approverInfo.email || 'unknown@example.com',
        originalPost: post
      };

      // Save approval record
      const approvalPath = path.join(this.approvalsDir, `${approvalId}.json`);
      await fs.writeFile(approvalPath, JSON.stringify(approvalData, null, 2));

      // Remove from preview directory
      const previewPath = path.join(this.previewDir, `${postId}.json`);
      await fs.unlink(previewPath);

      return {
        success: true,
        approvalId,
        message: 'Post approved successfully'
      };
    } catch (error) {
      console.error(`Error approving post ${postId}:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Reject a post
  async rejectPost(postId, rejectionReason, rejectorInfo = {}) {
    try {
      const post = await this.getPostById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Create rejection record
      const rejectionId = `rejection-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const rejectionData = {
        postId,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason,
        rejector: rejectorInfo.name || 'Unknown',
        rejectorEmail: rejectorInfo.email || 'unknown@example.com',
        originalPost: post
      };

      // Save rejection record
      const rejectionPath = path.join(this.workflowDir, 'rejected', `${rejectionId}.json`);
      await fs.mkdir(path.dirname(rejectionPath), { recursive: true });
      await fs.writeFile(rejectionPath, JSON.stringify(rejectionData, null, 2));

      // Remove from preview directory
      const previewPath = path.join(this.previewDir, `${postId}.json`);
      await fs.unlink(previewPath);

      return {
        success: true,
        rejectionId,
        message: 'Post rejected successfully'
      };
    } catch (error) {
      console.error(`Error rejecting post ${postId}:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get approval history
  async getApprovalHistory() {
    try {
      const files = await fs.readdir(this.approvalsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const approvals = [];
      for (const file of jsonFiles) {
        try {
          const content = await fs.readFile(path.join(this.approvalsDir, file), 'utf8');
          const approval = JSON.parse(content);
          approvals.push({
            id: file.replace('.json', ''),
            ...approval
          });
        } catch (error) {
          console.error(`Error reading approval file ${file}:`, error.message);
        }
      }
      
      return approvals.sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt));
    } catch (error) {
      console.error('Error getting approval history:', error.message);
      return [];
    }
  }
}

module.exports = FileHelpers; 