import React, { useState, useEffect, useContext } from 'react';
import profileImg from '../../../assets/images/profile.png';
import '../../Skill-Sharing-Post/post/posts.css';
import editIcon from '../../../assets/images/edit.png';
import deleteIcon from '../../../assets/images/delete.png';
import axios from 'axios';
import { UserContext } from '../../../common/UserContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaThumbsUp, FaCommentDots, FaShare } from 'react-icons/fa';
import './skillPostFeed.css';

export default function SkillPostFeed({ editable = false }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentPostMedia, setCurrentPostMedia] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [editComment, setEditComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  const API_BASE_URL = 'http://localhost:8080/api/v1/';

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL + 'feed');
      setPosts(response.data);
      const likeData = {};
      const countData = {};
      response.data.forEach(post => {
        likeData[post.postId] = post.likedBy?.includes(user?.id);
        countData[post.postId] = post.likesCount || 0;
      });
      setLikedPosts(likeData);
      setLikeCounts(countData);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const isVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg)$/i);
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

  // const handleNext = () => {
  //   setCurrentMediaIndex(prev => (prev < currentPostMedia.length - 1 ? prev + 1 : 0));
  // };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${postId}`, {
          data: { userId: 'current-user-id' }
        });
        setPosts(prev => prev.filter(post => post.postId !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post');
      }
    }
  };

  const handleUpdate = (postId) => {
    alert(`Update post ${postId} (connect to modal/form if needed)`);
  };

  const handleAddComment = async (postId) => {
    const id = user?.id;
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/comment?postId=${postId}`, {
        userId: id,
        comment: commentInputs[postId] || ''
      });
      console.log(response, 'comment added');
      fetchPosts();
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (e) {
      console.log(e, 'comment add error');
    }
  };

  const handleDeleteComment = async(postId, commentId) => {
    const id = user?.id;
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/comment?postId=${postId}&userId=${id}&commentId=${commentId}`);
      console.log(response, 'comment deleted');
      fetchPosts();
    } catch (e) {
      console.log(e, 'comment delete error');
    }
  };

  const handleEditComment = (postId, commentId, existingComment) => {
    setEditComment(existingComment);
    setEditCommentId(commentId);
    setEditPostId(postId);
    setShowEditModal(true);
  };

  const handleSaveEditedComment = async () => {
    const id = user?.id;
    try {
      await axios.put(`http://localhost:8080/api/v1/comment?postId=${editPostId}&userId=${id}&commentId=${editCommentId}`, {
        comment: editComment
      });
      setShowEditModal(false);
      setEditComment('');
      fetchPosts();
    } catch (e) {
      console.log(e, 'edit comment error');
    }
  };

  //handle like
  const handleLike = async (postId) => {
    const userId = user?.id;
    try {
      await axios.post(`http://localhost:8080/api/v1/like?postId=${postId}&userId=${userId}`);
      setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
      setLikeCounts(prev => ({
        ...prev,
        [postId]: prev[postId] + (likedPosts[postId] ? -1 : 1)
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  console.log(posts,"ppppppppppppppp")

  const renderPostMedia = (post) => {
    const mediaItems = [
      ...(post.videoUrl ? [post.videoUrl] : []),
      ...(post.imageUrls || []).slice(0, 3)
    ];

    if (mediaItems.length === 0) return null;

    return (
      <div className="posts__media-grid">
        <div className="posts__main-media-item" onClick={() => handleMediaClick(post, 0)}>
          {isVideo(mediaItems[0]) ? (
            <div className="posts__video-container">
              <video className="posts__media-element" playsInline muted preload="metadata">
                <source src={mediaItems[0]} type="video/mp4" />
              </video>
              <div className="posts__play-icon">▶</div>
            </div>
          ) : (
            <img src={mediaItems[0]} alt="Main media" className="posts__media-element" />
          )}
        </div>
        {mediaItems.length > 1 && (
          <div className="posts__secondary-media-container">
            {mediaItems.slice(1, 4).map((media, index) => (
              <div
                key={index}
                className="posts__secondary-media-item"
                onClick={() => handleMediaClick(post, index + 1)}
              >
                {isVideo(media) ? (
                  <div className="posts__video-container">
                    <video className="posts__media-element" playsInline muted preload="metadata">
                      <source src={media} type="video/mp4" />
                    </video>
                    <div className="posts__play-icon">▶</div>
                  </div>
                ) : (
                  <img src={media} alt={`Screenshot ${index + 1}`} className="posts__media-element" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="posts__loading">Loading posts...</div>;
  if (error) return <div className="posts__error">Error: {error}</div>;
  if (posts.length === 0) return <div className="posts__empty">No posts to display</div>;

  return (
    <div className="posts__container">
      {posts?.map(post => (
        <div key={post.postId} className="posts__card">
          {editable && (
            <div className="posts__edit-buttons">
              <button onClick={() => handleUpdate(post.postId)} className="posts__icon-btn">
                <img src={editIcon} alt="Edit" className="posts__icon-image" />
              </button>
              <button onClick={() => handleDelete(post.postId)} className="posts__icon-btn delete">
                <img src={deleteIcon} alt="Delete" className="posts__icon-image" />
              </button>
            </div>
          )}

          <div className="posts__header">
            <img 
              src={post.user?.imgUrl || profileImg} 
              alt={post.user?.username} 
              className="posts__profile-pic" 
            />
            <div className="posts__user-info">
              <h5 className="posts__user-name">{post.user?.username}</h5>
              <small className="posts__meta">{new Date(post?.postDate).toLocaleString()}</small>
            </div>
          </div>

          <div className="posts__body">
            <p className="posts__description">{post.description}</p>
            {renderPostMedia(post)}
          </div>

          <div className="posts__actions enhanced-actions">
          <button className={`posts__action-btn ${likedPosts[post.postId] ? 'liked' : ''}`} onClick={() => handleLike(post.postId)}>
              <FaThumbsUp style={{ color: likedPosts[post.postId] ? 'blue' : 'inherit' }} /> {likedPosts[post.postId] ? 'Liked' : 'Like'} 
            </button>
            <button className="posts__action-btn">
              <FaCommentDots /> Comment
            </button>
            <button className="posts__action-btn">
              <FaShare /> Share
            </button>
          </div>

          <div className="posts__comments styled-comments">
            {post.comments?.length > 0 ? (
              post.comments.map((c, i) => (
                <div key={i} className="styled-comment">
                  <div className="comment-user">
                    <strong>{c?.user.name}</strong>
                    <span className="comment-text">{c?.comment}</span>
                  </div>
                  {c?.user.id === user.id && (
                    <div className="comment-actions">
                      <button onClick={() => handleEditComment(post.postId, c.commentId, c.comment)}>Edit</button>
                      <button onClick={() => handleDeleteComment(post.postId, c.commentId)}>Delete</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="posts__comment posts__comment--empty">No comments yet.</div>
            )}
            <div className="posts__comment-input-group styled-input-group">
              <input
                type="text"
                placeholder="Write a comment..."
                className="styled-comment-input"
                value={commentInputs[post.postId] || ''}
                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.postId]: e.target.value }))}
              />
              <button
                onClick={() => handleAddComment(post.postId)}
                className="styled-comment-submit"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      ))}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            rows="4"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEditedComment}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}