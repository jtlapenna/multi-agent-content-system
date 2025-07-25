import React, { useState, useEffect } from 'react';
import './PostList.css';

const PostList = ({ onPostSelect, selectedPostId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use relative URL for Cloudflare Pages Functions
      const response = await fetch('/api/posts');
      if (!response.ok) { 
        throw new Error(`HTTP error! status: ${response.status}`); 
      }
      const data = await response.json();
      console.log('Fetched posts:', data);
      
      // Transform GitHub API response to match our component expectations
      const transformedPosts = data.map(post => ({
        id: post.name.replace('.md', ''),
        title: post.name.replace('.md', ''),
        status: 'pending',
        createdAt: new Date().toISOString(), // GitHub doesn't provide creation date in this endpoint
        content: {
          title: post.name.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Post: ${post.name}`,
          wordCount: 0, // Will be updated when post details are fetched
          seoScore: 0
        },
        github: {
          path: post.path,
          sha: post.sha,
          url: post.url
        }
      }));
      
      setPosts(transformedPosts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts: ' + err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="post-list">
        <div className="post-list-header">
          <h2>Pending Posts</h2>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-list">
        <div className="post-list-header">
          <h2>Pending Posts</h2>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h2>Pending Posts ({posts.length})</h2>
        <button onClick={fetchPosts} className="refresh-btn">
          Refresh
        </button>
      </div>
      
      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No pending posts to review</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`post-card ${selectedPostId === post.id ? 'selected' : ''}`}
              onClick={() => onPostSelect(post)}
            >
              <div className="post-header">
                <h3>{post.content.title}</h3>
                <span className="post-status pending">Pending</span>
              </div>
              
              <p className="post-description">
                {post.content.description}
              </p>
              
              <div className="post-meta">
                <span className="word-count">
                  {post.content.wordCount} words
                </span>
                <span className="seo-score">
                  SEO: {post.content.seoScore}%
                </span>
                <span className="created-date">
                  {formatDate(post.createdAt)}
                </span>
              </div>
              
              <div className="post-actions">
                <button className="btn-approve">Approve</button>
                <button className="btn-reject">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList; 