import React, { useState, useEffect, useContext } from 'react';
import profileImg from '../../../assets/images/profile.png';
import './posts.css';
import editIcon from '../../../assets/images/edit.png';
import deleteIcon from '../../../assets/images/delete.png';
import axios from 'axios';
import { UserContext } from '../../../common/UserContext';
import PostUpdateModal from '../modal/PostUpdateModal';
import Swal from 'sweetalert2';

export default function Posts({ editable = false }) {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentPostMedia, setCurrentPostMedia] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const API_BASE_URL = `http://localhost:8080/api/v1/posts/${user?.id}`; 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_BASE_URL);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [API_BASE_URL]);

  const isVideo = (url) => {
    return url?.match(/\.(mp4|webm|ogg)$/i);
  };

  const handleMediaClick = (post, index) => {
    const mediaItems = [
      ...(post.videoUrl ? [post.videoUrl] : []),
      ...(post.imageUrls || [])
    ];
    setCurrentPostMedia(mediaItems);
    setCurrentMediaIndex(index);
    setShowModal(true);
  };

  const handlePrev = () => {
    setCurrentMediaIndex(prev => (prev > 0 ? prev - 1 : currentPostMedia.length - 1));
  };

  const handleNext = () => {
    setCurrentMediaIndex(prev => (prev < currentPostMedia.length - 1 ? prev + 1 : 0));
  };

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/post`, {
          params: { postId, userId: user.id }
        });
        
        setPosts(prev => prev.filter(post => post.postId !== postId));
        
        Swal.fire(
          'Deleted!',
          'Your post has been deleted.',
          'success'
        );
      } catch (err) {
        console.error('Error deleting post:', err);
        Swal.fire(
          'Error!',
          err.response?.data?.message || 'Failed to delete post.',
          'error'
        );
      }
    }
  };

  const handleUpdate = (post) => {
    setCurrentPost(post);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.postId === updatedPost.postId ? updatedPost : post
      )
    );
    setShowUpdateModal(false);
  };

  const renderPostMedia = (post) => {
    const mediaItems = [
      ...(post.videoUrl ? [post.videoUrl] : []),
      ...(post.imageUrls || [])
    ];

    if (mediaItems.length === 0) return null;

    return (
      <div className="posts__media-grid">
        {mediaItems.map((media, index) => (
          <div
            key={index}
            className={`posts__media-item ${index === 0 ? 'posts__main-media-item' : 'posts__secondary-media-item'}`}
            onClick={() => handleMediaClick(post, index)}
          >
            {isVideo(media) ? (
              <div className="posts__video-container">
                <video className="posts__media-element" playsInline muted>
                  <source src={media} type="video/mp4" />
                </video>
                <div className="posts__play-icon">▶</div>
              </div>
            ) : (
              <img src={media} alt={`Media ${index + 1}`} className="posts__media-element" />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="posts__loading">Loading posts...</div>;
  if (error) return <div className="posts__error">Error: {error}</div>;
  if (posts.length === 0) return <div className="posts__empty">No posts to display</div>;

  return (
    <div className="posts__container">
      {posts.map(post => (
        <div key={post.postId} className="posts__card">
          {editable && (
            <div className="posts__edit-buttons">
              <button onClick={() => handleUpdate(post)} className="posts__icon-btn">
                <img src={editIcon} alt="Edit" className="posts__icon-image" />
              </button>
              <button onClick={() => handleDelete(post.postId)} className="posts__icon-btn delete">
                <img src={deleteIcon} alt="Delete" className="posts__icon-image" />
              </button>
            </div>
          )}

          <div className="posts__header">
            <img 
              src={post.user?.profilePicture || profileImg} 
              alt={post.username} 
              className="posts__profile-pic" 
            />
            <div className="posts__user-info">
              <h6 className="posts__user-name">{post.user?.username || 'Unknown'}</h6>
              <small className="posts__meta">
                {new Date(post.postDate).toLocaleString()}
              </small>
            </div>
          </div>

          <div className="posts__body">
            <p className="posts__description">{post.description}</p>
            {renderPostMedia(post)}
          </div>

          <div className="posts__actions">
            <button className="posts__action-btn">
              👍 Like ({post.likes || 0})
            </button>
            <button className="posts__action-btn">
              💬 Comment ({post.comments?.length || 0})
            </button>
            <button className="posts__action-btn">
              ↗ Share
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="posts__modal">
          <div className="posts__modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="posts__modal-content">
            <button
              className="posts__modal-close"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <div className="posts__modal-media-container">
              {isVideo(currentPostMedia[currentMediaIndex]) ? (
                <video controls autoPlay className="posts__modal-media">
                  <source src={currentPostMedia[currentMediaIndex]} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={currentPostMedia[currentMediaIndex]}
                  alt="Media preview"
                  className="posts__modal-media"
                />
              )}
            </div>

            {currentPostMedia.length > 1 && (
              <div className="posts__modal-navigation">
                <button className="posts__nav-button" onClick={handlePrev}>
                  &lt;
                </button>
                <div className="posts__media-counter">
                  {currentMediaIndex + 1} / {currentPostMedia.length}
                </div>
                <button className="posts__nav-button" onClick={handleNext}>
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <PostUpdateModal
        show={showUpdateModal}
        handleClose={handleUpdateModalClose}
        post={currentPost}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
}