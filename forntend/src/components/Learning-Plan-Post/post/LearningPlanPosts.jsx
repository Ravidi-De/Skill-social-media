import React, { useState, useEffect, useContext } from "react";
import profileImg from "../../../assets/images/profile.png";
import "./learningPlanPosts.css";
import axios from "axios";
import { UserContext } from "../../../common/UserContext";
import Swal from "sweetalert2";
import UpdateLearningPlanModal from "./UpdateLearningPlanModal";

export default function LearningPlanPosts() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [likedPlans, setLikedPlans] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const [comments, setComments] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    getAllLearningPlans();
  }, []);

  const getAllLearningPlans = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/learning/plans/${user.id}`
      );

      const transformedData = response.data.map((plan) => ({
        id: plan.id,
        user: {
          profile: profileImg,
        },
        title: plan.title,
        status: plan.status,
        progress: calculateProgress(plan.status),
        startDate: formatDate(plan.startDate),
        endDate: formatDate(plan.endDate),
        daysRemaining: calculateDaysRemaining(plan.endDate),
        topics: plan.topics,
        resources: plan.resources,
        timestamp: formatTimestamp(plan.createdAt),
        likes: plan.likes || 0,
        comments: plan.comments || [],
        rawStartDate: plan.startDate,
        rawEndDate: plan.endDate,
      }));

      setLearningPlans(transformedData);
    } catch (err) {
      console.log(err);
      setLearningPlans([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load learning plans",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return "Recently";

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

  const calculateProgress = (status) => {
    switch (status) {
      case "NOT_STARTED":
        return 0;
      case "IN_PROGRESS":
        return 50;
      case "COMPLETED":
        return 100;
      default:
        return 0;
    }
  };

  const calculateDaysRemaining = (endDateString) => {
    if (!endDateString) return 0;

    const endDate = new Date(endDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "NOT_STARTED":
        return "#e74c3c";
      case "IN_PROGRESS":
        return "#f39c12";
      case "COMPLETED":
        return "#2ecc71";
      default:
        return "#95a5a6";
    }
  };

  const handleLike = async (planId) => {
    try {
      setLearningPlans(prevPlans =>
        prevPlans.map(plan =>
          plan.id === planId
            ? { ...plan, likes: likedPlans[planId] ? plan.likes - 1 : plan.likes + 1 }
            : plan
        )
      );

      setLikedPlans(prev => ({
        ...prev,
        [planId]: !prev[planId]
      }));

      // API call would go here
    } catch (err) {
      console.error('Error updating like:', err);
      // Revert changes if API fails
      setLearningPlans(prevPlans =>
        prevPlans.map(plan =>
          plan.id === planId
            ? { ...plan, likes: likedPlans[planId] ? plan.likes + 1 : plan.likes - 1 }
            : plan
        )
      );
    }
  };

  const toggleComments = (planId) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const handleShare = (plan) => {
    const shareText = `Check out my learning plan: ${
      plan.title
    }\n\nTopics:\n${plan.topics.join(
      "\n"
    )}\n\nResources:\n${plan.resources.join("\n")}`;
    if (navigator.share) {
      navigator
        .share({
          title: plan.title,
          text: shareText,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      alert("Share this plan:\n\n" + shareText);
    }
  };

  const handleDelete = (planId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/v1/learning/plans/${planId}`);
          
          // Update state to remove the deleted plan
          setLearningPlans(prevPlans => 
            prevPlans.filter(plan => plan.id !== planId)
          );
          
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your learning plan has been deleted.",
            timer: 1500,
          });
        } catch (error) {
          console.error("Error deleting learning plan:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete learning plan.",
          });
        }
      }
    });
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowUpdateModal(true);
  };

  const handleStatusUpdate = async (planId, newStatus) => {
    try {
      const updateRequest = {
        postId: planId,
        status: newStatus
      };
      
      await axios.put("http://localhost:8080/api/v1/learning/plans", updateRequest);
      
      // Update the local state
      setLearningPlans(prevPlans =>
        prevPlans.map(plan =>
          plan.id === planId
            ? { 
                ...plan, 
                status: newStatus,
                progress: calculateProgress(newStatus) 
              }
            : plan
        )
      );
      
      Swal.fire({
        icon: "success",
        title: "Status Updated!",
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status.",
      });
    }
  };

  const handleCommentChange = (planId, value) => {
    setComments({
      ...comments,
      [planId]: value
    });
  };

  const handleCommentSubmit = (planId) => {
    if (!comments[planId] || comments[planId].trim() === '') return;
    
    // In a real implementation, you would make an API call here
    // For now, we'll just update the state locally
    setLearningPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.id === planId) {
          const newComment = {
            userName: user.name || 'User',
            text: comments[planId]
          };
          return {
            ...plan,
            comments: [...plan.comments, newComment]
          };
        }
        return plan;
      })
    );
    
    // Clear the comment input
    setComments({
      ...comments,
      [planId]: ''
    });
  };

  const handleUpdateSuccess = (updatedPlan) => {
    setShowUpdateModal(false);
    getAllLearningPlans(); // Refresh all plans
  };

  return (
    <div className="learning-plan__container">
      {learningPlans.length > 0 ? (
        learningPlans.map((plan) => {
          const statusColor = getStatusColor(plan.status);

          return (
            <div key={plan.id} className="learning-plan__card">
              <div className="learning-plan__header">
                <div className="learning-plan__user-wrapper">
                  <img
                    src={plan.user.profile}
                    alt={user.name}
                    className="learning-plan__profile-pic"
                  />
                  <div className="learning-plan__name-info">
                    <h6 className="learning-plan__user-name">{user.name}</h6>
                    <div className="learning-plan__timestamp">
                      {plan.timestamp}
                    </div>
                  </div>

                  <div className="posts__edit-buttons">
                    <button 
                      className="posts__icon-btn"
                      onClick={() => handleEdit(plan)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="posts__icon-btn delete"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="learning-plan__body">
                <h5 className="learning-plan__title">{plan.title}</h5>

                <div className="learning-plan__status-wrapper">
                  <span
                    className="learning-plan__status-badge"
                    style={{
                      backgroundColor: `${statusColor}20`,
                      color: statusColor,
                    }}
                  >
                    {plan.status.replace("_", " ")}
                  </span>

                  <div className="learning-plan__status-dropdown">
                    <select 
                      className="form-select form-select-sm"
                      value={plan.status}
                      onChange={(e) => handleStatusUpdate(plan.id, e.target.value)}
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  {plan.status === "IN_PROGRESS" && plan.daysRemaining > 0 && (
                    <span className="learning-plan__days-remaining">
                      {plan.daysRemaining} days remaining
                    </span>
                  )}
                </div>

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
                          href={
                            resource.startsWith("http")
                              ? resource
                              : `https://${resource}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {resource}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {commentsVisible[plan.id] && (
                  <div className="learning-plan__comments-section">
                    <div className="learning-plan__comments-list">
                      {plan.comments.length > 0 ? (
                        plan.comments.map((comment, index) => (
                          <div key={index} className="learning-plan__comment">
                            <div className="learning-plan__comment-author">
                              {comment.userName}
                            </div>
                            <div className="learning-plan__comment-text">
                              {comment.text}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="learning-plan__no-comments">
                          No comments yet. Be the first to comment!
                        </div>
                      )}
                    </div>
                    <div className="learning-plan__comment-input">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="learning-plan__comment-field"
                        value={comments[plan.id] || ''}
                        onChange={(e) => handleCommentChange(plan.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleCommentSubmit(plan.id);
                          }
                        }}
                      />
                      <button 
                        className="learning-plan__comment-submit"
                        onClick={() => handleCommentSubmit(plan.id)}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="learning-plan__footer">
                <div
                  className="learning-plan__action"
                  onClick={() => handleLike(plan.id)}
                  style={{ color: likedPlans[plan.id] ? "#2ecc71" : "#555" }}
                >
                  <i className="fas fa-thumbs-up"></i>
                  <span>
                    {plan.likes} {likedPlans[plan.id] ? "Liked" : "Like"}
                  </span>
                </div>
                <div
                  className="learning-plan__action"
                  onClick={() => toggleComments(plan.id)}
                >
                  <i className="fas fa-comment"></i>
                  <span>Comment</span>
                </div>
                <div
                  className="learning-plan__action"
                  onClick={() => handleShare(plan)}
                >
                  <i className="fas fa-share"></i>
                  <span>Share</span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="learning-plan__empty-state">
          <p>
            No learning plans found. Create your first learning plan to get
            started!
          </p>
        </div>
      )}
      
      {showUpdateModal && selectedPlan && (
        <UpdateLearningPlanModal
          show={showUpdateModal}
          handleClose={() => setShowUpdateModal(false)}
          plan={selectedPlan}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}