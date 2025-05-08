import React, { useState, useEffect, useContext } from 'react';
import profileImg from '../../../assets/images/profile.png';
import '../../Learning-Plan-Post/post/learningPlanPosts.css'; 
import axios from 'axios';
import { UserContext } from '../../../common/UserContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FaThumbsUp, FaCommentDots, FaShare } from 'react-icons/fa';
import './learningPlanPostFeed.css';

export default function LearningPlanPostFeed() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [planUser, setPlanUser] = useState({});
  const { user } = useContext(UserContext);
  const [commentInputs, setCommentInputs] = useState({});
  const [editComment, setEditComment] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPlanId, setEditPlanId] = useState(null);
  const [likedPlans, setLikedPlans] = useState({});

  useEffect(() => {
    getAllLearningPlans();
    fetchUserLikes();
  }, []);

  const getAllLearningPlans = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/learning/plan/feed");
      
      const transformedData = await Promise.all(
        response.data.map(async (plan) => {
          try {
            const userResponse = await axios.get(`http://localhost:8080/api/v1/user/${plan.userId}`);
            setPlanUser(userResponse.data);
            
            return {
              id: plan.id,
              userId: plan.userId,
              user: {
                id: plan.userId,
                name: `${planUser.firstName} ${planUser.lastName}`,
                profile: profileImg
              },
              title: plan.title,
              status: plan.status,
              startDate: formatDate(plan.startDate),
              endDate: formatDate(plan.endDate),
              topics: plan.topics || [],
              resources: plan.resources || [],
              timestamp: formatTimestamp(plan.createdAt),
              comments: plan.comments
            };
          } catch (userErr) {
            console.error('Error fetching user data:', userErr);
            return {
              id: plan.id,
              userId: plan.userId,
              user: {
                id: plan.userId,
                name: `User ${plan.userId}`,
                profile: profileImg
              },
              title: plan.title,
              status: plan.status,
              startDate: formatDate(plan.startDate),
              endDate: formatDate(plan.endDate),
              topics: plan.topics || [],
              resources: plan.resources || [],
              timestamp: formatTimestamp(plan.createdAt),
              comments: plan.comments
            };
          }
        })
      );
      
      setLearningPlans(transformedData);
    } catch (err) {
      console.log(err);
      setLearningPlans([]);
    }
  };

  const fetchUserLikes = async () => {
    try {
      const id = user?.id;
      if (!id) return;
      
      // Fetch user's liked plans
      const response = await axios.get(
        `http://localhost:8080/api/v1/learning/likes/${id}`
      );
      
      // Transform the API response into an object with plan IDs as keys
      const likesMap = {};
      response.data.forEach(likedPlan => {
        likesMap[likedPlan.planId] = true;
      });
      
      setLikedPlans(likesMap);
    } catch (err) {
      console.error("Error fetching user likes:", err);
    }
  };

  const handleLike = async (planId) => {
    const id = user?.id;
    if (!id) return;
    
    try {
      const isCurrentlyLiked = likedPlans[planId];
      
      // Optimistically update UI
      setLikedPlans(prev => ({
        ...prev,
        [planId]: !isCurrentlyLiked
      }));

      // Make API call based on whether we're liking or unliking
      if (!isCurrentlyLiked) {
        // Unlike the plan
        await axios.post(`http://localhost:8080/api/v1/learning/like?id=${planId}&userId=${id}`);
      }
    } catch (err) {
      console.error('Error updating like:', err);
      // Revert changes if API fails
      setLikedPlans(prev => ({
        ...prev,
        [planId]: !prev[planId]
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return 'Recently';
    
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  // Comment handling functions
  const handleAddComment = async (planId) => {
    const id = user?.id;
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/learning/comment?id=${planId}`, {
        userId: id,
        comment: commentInputs[planId] || ''
      });
      console.log(response, 'comment added');
      getAllLearningPlans(); // Refresh to get updated comments
      setCommentInputs(prev => ({ ...prev, [planId]: '' }));
    } catch (e) {
      console.log(e, 'comment add error');
    }
  };

  const handleDeleteComment = async(planId, commentId) => {
    const id = user?.id;
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/learning/comment?id=${planId}&userId=${id}&commentId=${commentId}`);
      console.log(response, 'comment deleted');
      getAllLearningPlans(); // Refresh to get updated comments
    } catch (e) {
      console.log(e, 'comment delete error');
    }
  };

  const handleEditComment = (planId, commentId, existingComment) => {
    setEditComment(existingComment);
    setEditCommentId(commentId);
    setEditPlanId(planId);
    setShowEditModal(true);
  };

  const handleSaveEditedComment = async () => {
    const id = user?.id;

    console.log(editComment,"ediiiiiiiiiiiiit")
    try {
      await axios.put(`http://localhost:8080/api/v1/learning/comment?id=${editPlanId}&userId=${id}&commentId=${editCommentId}`, {
        comment: editComment
      });
      setShowEditModal(false);
      setEditComment('');
      getAllLearningPlans(); // Refresh to get updated comments
    } catch (e) {
      console.log(e, 'edit comment error');
    }
  };
console.log(learningPlans,"plaans")
  return (
    <div className="learning-plan__container">
      {learningPlans.length > 0 ? (
        learningPlans.map(plan => (
          <div key={plan.id} className="learning-plan__card">
            <div className="learning-plan__header">
              <div className="learning-plan__user-wrapper">
                <img 
                  src={plan.user.profile} 
                  alt={planUser.name} 
                  className="learning-plan__profile-pic"
                />
                <div className="learning-plan__name-info">
                  <h6 className="learning-plan__user-name">{planUser?.name}</h6>
                  <div className="learning-plan__timestamp">{plan.timestamp}</div>
                </div>
              </div>
            </div>
            
            <div className="learning-plan__body">
              <h5 className="learning-plan__title">{plan.title}</h5>
              
              <div className="learning-plan__dates">
                <div className="learning-plan__date">
                  <span className="learning-plan__date-label">Start:</span>
                  <span>{plan.startDate}</span>
                </div>
                <div className="learning-plan__date">
                  <span className="learning-plan__date-label">Target:</span>
                  <span>{plan.endDate}</span>
                </div>
              </div>
              
              <div className="learning-plan__topics">
                <h6 className="learning-plan__section-title">Topics</h6>
                <ul className="learning-plan__topic-list list-unstyled">
                  {plan.topics.map((topic, index) => (
                    <li key={index} className="learning-plan__topic-item">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="learning-plan__resources">
                <h6 className="learning-plan__section-title">Resources</h6>
                <ul className="learning-plan__resource-list list-unstyled">
                  {plan.resources.map((resource, index) => (
                    <li key={index} className="learning-plan__resource-item">
                      <a 
                        href={resource.startsWith('http') ? resource : `https://${resource}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="learning-plan__footer">
              <div 
                className="learning-plan__action"
                onClick={() => handleLike(plan.id)}
                style={{ color: likedPlans[plan.id] ? "#2ecc71" : "#555" }}
              >
                <FaThumbsUp />
                <span>{likedPlans[plan.id] ? "Liked" : "Like"}</span>
              </div>
              <div className="learning-plan__action">
                <FaCommentDots />
                <span>Comment</span>
              </div>
              <div className="learning-plan__action">
                <FaShare />
                <span>Share</span>
              </div>
            </div>

            {/* Comment Section */}
            <div className="learning-plan__comments styled-comments">
              {plan?.comments?.length > 0 ? (
                plan?.comments.map((c, i) => (
                  <div key={i} className="styled-comment">
                    <div className="comment-user">
                      <strong>{c?.user?.name}</strong>
                      <span className="comment-text">{c?.comment}</span>
                    </div>
                    {c?.user.id === user?.id && (
                      <div className="comment-actions">
                        <button onClick={() => handleEditComment(plan.id, c.commentId, c.comment)}>Edit</button>
                        <button onClick={() => handleDeleteComment(plan.id, c.commentId)}>Delete</button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="learning-plan__comment learning-plan__comment--empty">No comments yet.</div>
              )}
              <div className="learning-plan__comment-input-group styled-input-group">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="styled-comment-input"
                  value={commentInputs[plan.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [plan.id]: e.target.value }))}
                />
                <button
                  onClick={() => handleAddComment(plan.id)}
                  className="styled-comment-submit"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="learning-plan__empty-state">
          <p>No learning plans found. Create your first learning plan to get started!</p>
        </div>
      )}

      {/* Edit Comment Modal */}
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