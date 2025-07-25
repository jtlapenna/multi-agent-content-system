import React, { useState, useEffect } from 'react';
import './PostDetail.css';

const PostDetail = ({ post, onApprove, onReject, onClose }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [postContent, setPostContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch post content when post is selected
  useEffect(() => {
    if (post?.id) {
      fetchPostContent(post.id);
    }
  }, [post?.id]);

  const fetchPostContent = async (postId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched post content:', data);
      setPostContent(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching post content:', err);
      setError('Failed to load post content: ' + err.message);
      setLoading(false);
    }
  };

  if (!post) {
    return (
      <div className="post-detail">
        <div className="post-detail-empty">
          <h2>Select a Post</h2>
          <p>Choose a post from the sidebar to view its details and approve or reject it.</p>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(post.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setIsProcessing(true);
    try {
      await onReject(post.id, rejectionReason);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const wordCount = postContent?.content?.body ? 
    postContent.content.body.split(/\s+/).length : 0;

  return (
    <div className="post-detail">
      <div className="post-detail-header">
        <div className="post-detail-title">
          <h2>{postContent?.content?.title || post.content.title}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="post-detail-meta">
          <span className="post-status pending">Pending Review</span>
          <span className="post-date">
            {postContent?.meta?.lastModified ? 
              formatDate(postContent.meta.lastModified) : 
              formatDate(post.createdAt)
            }
          </span>
        </div>
      </div>

      {loading && (
        <div className="post-detail-loading">
          <div className="loading-spinner">Loading post content...</div>
        </div>
      )}

      {error && (
        <div className="post-detail-error">
          <div className="error-message">{error}</div>
          <button onClick={() => fetchPostContent(post.id)} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {postContent && !loading && !error && (
        <>
          <div className="post-detail-content">
            <div className="content-section">
              <h3>Description</h3>
              <p>{postContent.content.description || 'No description available'}</p>
            </div>

            <div className="content-section">
              <h3>Content Preview</h3>
              <div className="content-preview">
                <pre>{postContent.content.body.substring(0, 500)}...</pre>
              </div>
            </div>

            <div className="content-section">
              <h3>SEO & Analytics</h3>
              <div className="seo-stats">
                <div className="stat">
                  <label>Word Count:</label>
                  <span>{wordCount}</span>
                </div>
                <div className="stat">
                  <label>Tags:</label>
                  <span>{postContent.content.tags?.join(', ') || 'None'}</span>
                </div>
                <div className="stat">
                  <label>Image:</label>
                  <span>{postContent.content.image || 'None'}</span>
                </div>
              </div>
            </div>

            <div className="content-section">
              <h3>GitHub Info</h3>
              <div className="github-info">
                <div className="stat">
                  <label>Path:</label>
                  <span>{postContent.path}</span>
                </div>
                <div className="stat">
                  <label>SHA:</label>
                  <span className="sha">{postContent.sha.substring(0, 8)}...</span>
                </div>
                <div className="stat">
                  <label>Size:</label>
                  <span>{postContent.meta.size} bytes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="post-detail-actions">
            <div className="action-buttons">
              <button 
                onClick={handleApprove} 
                className="btn-approve"
                disabled={isProcessing}
              >
                {isProcessing ? 'Approving...' : 'Approve Post'}
              </button>
              
              <button 
                onClick={() => setShowRejectionForm(true)} 
                className="btn-reject"
                disabled={isProcessing}
              >
                Reject Post
              </button>
            </div>

            {showRejectionForm && (
              <div className="rejection-form">
                <h4>Rejection Reason</h4>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this post..."
                  rows={3}
                />
                <div className="rejection-actions">
                  <button 
                    onClick={handleReject} 
                    className="btn-reject-confirm"
                    disabled={isProcessing || !rejectionReason.trim()}
                  >
                    {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowRejectionForm(false);
                      setRejectionReason('');
                    }} 
                    className="btn-cancel"
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetail; 