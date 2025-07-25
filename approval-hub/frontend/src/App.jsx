import React, { useState } from 'react';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import './App.css';

function App() {
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostSelect = (post) => {
    setSelectedPost(post);
  };

  const handleApprove = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/approve`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Admin User', 
          email: 'admin@brightgift.com', 
          notes: 'Approved via web interface' 
        })
      });
      if (!response.ok) { 
        throw new Error(`HTTP error! status: ${response.status}`); 
      }
      const result = await response.json();
      console.log('Post approved:', result); 
      alert(`Post "${selectedPost.content.title}" approved successfully! Pull request created: ${result.pullRequest.url}`);
      setSelectedPost(null); 
      window.location.reload();
    } catch (error) { 
      console.error('Error approving post:', error); 
      alert(`Error approving post: ${error.message}`); 
    }
  };
  
  const handleReject = async (postId, reason) => {
    try {
      const response = await fetch(`/api/posts/${postId}/reject`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason: reason, 
          rejectorInfo: { 
            name: 'Admin User', 
            email: 'admin@brightgift.com' 
          } 
        })
      });
      if (!response.ok) { 
        throw new Error(`HTTP error! status: ${response.status}`); 
      }
      const result = await response.json();
      console.log('Post rejected:', result); 
      alert(`Post "${selectedPost.content.title}" rejected successfully!`);
      setSelectedPost(null); 
      window.location.reload();
    } catch (error) { 
      console.error('Error rejecting post:', error); 
      alert(`Error rejecting post: ${error.message}`); 
    }
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Approval Hub</h1>
          <p>Content Review & Approval System</p>
        </div>
      </header>
      
      <main className="app-main">
        <div className="app-layout">
          <aside className="sidebar">
            <PostList 
              onPostSelect={handlePostSelect}
              selectedPostId={selectedPost?.id}
            />
          </aside>
          
          <section className="main-content">
            <PostDetail
              post={selectedPost}
              onApprove={handleApprove}
              onReject={handleReject}
              onClose={handleCloseDetail}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App; 