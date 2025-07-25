const express = require('express');
const FileHelpers = require('../utils/fileHelpers');

const router = express.Router();
const fileHelpers = new FileHelpers();

// GET /api/approvals - Get approval history
router.get('/', async (req, res) => {
  try {
    const approvals = await fileHelpers.getApprovalHistory();
    res.json({
      success: true,
      data: approvals,
      count: approvals.length
    });
  } catch (error) {
    console.error('Error getting approvals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get approvals',
      message: error.message
    });
  }
});

// GET /api/approvals/stats - Get approval statistics
router.get('/stats', async (req, res) => {
  try {
    const approvals = await fileHelpers.getApprovalHistory();
    const pendingPosts = await fileHelpers.getPendingPosts();
    
    // Calculate statistics
    const totalApproved = approvals.filter(a => a.status === 'approved').length;
    const totalRejected = approvals.filter(a => a.status === 'rejected').length;
    const pendingCount = pendingPosts.length;
    
    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentApprovals = approvals.filter(a => 
      new Date(a.approvedAt || a.rejectedAt) > sevenDaysAgo
    );
    
    const stats = {
      totalApproved,
      totalRejected,
      pendingCount,
      totalProcessed: totalApproved + totalRejected,
      approvalRate: totalApproved / (totalApproved + totalRejected) * 100 || 0,
      recentActivity: recentApprovals.length,
      recentApprovals: recentApprovals.slice(0, 5) // Last 5 recent approvals
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting approval stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get approval statistics',
      message: error.message
    });
  }
});

module.exports = router; 