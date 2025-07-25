const express = require('express');
const FileHelpers = require('../utils/fileHelpers');

const router = express.Router();
const fileHelpers = new FileHelpers();

// GET /api/posts - Get all pending posts
router.get('/', async (req, res) => {
  try {
    const posts = await fileHelpers.getPendingPosts();
    res.json({
      success: true,
      data: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get posts',
      message: error.message
    });
  }
});

// GET /api/posts/:id - Get a specific post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await fileHelpers.getPostById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get post',
      message: error.message
    });
  }
});

// POST /api/posts/:id/approve - Approve a post
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approver } = req.body;
    
    const result = await fileHelpers.approvePost(id, approver);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      data: result,
      message: 'Post approved successfully'
    });
  } catch (error) {
    console.error('Error approving post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve post',
      message: error.message
    });
  }
});

// POST /api/posts/:id/reject - Reject a post
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason, rejector } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }
    
    const result = await fileHelpers.rejectPost(id, rejectionReason, rejector);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      data: result,
      message: 'Post rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject post',
      message: error.message
    });
  }
});

module.exports = router; 