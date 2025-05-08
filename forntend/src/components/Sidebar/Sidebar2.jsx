import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';
import profileImg from '../../assets/images/profile.png';
import { UserContext } from '../../common/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BookOpen, Calendar, Clock, ChevronRight, PlusCircle, Award } from 'lucide-react';

export default function Sidebar2() {
  const { user } = useContext(UserContext);
  const [learningPlans, setLearningPlans] = useState([]);

  const [getUser , setGetUser] = useState();

  
  
  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/${user.id}`);
      setGetUser(response.data);
      console.log("get user by id : " , response.data);
    } catch (err) {
      console.error(err);
    }
  };
console.log(user,"newwwwwwwwwwwwwwwwwwwwww")

  useEffect(() => {
    if (!user?.id) return;

    const fetchLearningPlans = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/learning/plans/${user.id}`
        );

        const transformedData = response.data.map((plan) => ({
          id: plan.id,
          title: plan.title,
          status: plan.status,
          startDate: formatDate(plan.startDate),
          endDate: formatDate(plan.endDate),
          daysRemaining: calculateDaysRemaining(plan.endDate),
          progress: calculateProgress(plan.startDate, plan.endDate),
          topics: plan.topics,
          resources: plan.resources,
        }));

        setLearningPlans(transformedData.slice(0, 3));
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load learning plans",
        });
      }
    };

    fetchLearningPlans();
  }, [user?.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  const calculateProgress = (startDateString, endDateString) => {
    if (!startDateString || !endDateString) return 0;

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const today = new Date();

    const totalDuration = endDate - startDate;
    const elapsedDuration = today - startDate;

    if (elapsedDuration <= 0) return 0;
    if (elapsedDuration >= totalDuration) return 100;

    return Math.round((elapsedDuration / totalDuration) * 100);
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

  const getStatusText = (status) => {
    return status.replace("_", " ");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "NOT_STARTED":
        return <Clock size={14} />;
      case "IN_PROGRESS":
        return <BookOpen size={14} />;
      case "COMPLETED":
        return <Award size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="right-sidebar bg-white shadow-sm">
      <div className="user-profile p-3 border-bottom">
        <div className="d-flex align-items-center mb-3">
          <img 
            src={getUser?.imgUrl || profileImg} 
            alt="Profile" 
            className="rounded-circle me-3"
            width={50}
          />
          <div>
            <h6 className="mb-0">{user?.name || 'Guest User'}</h6>
            <small className="text-muted">{user?.username || ''}</small>
          </div>
        </div>
        
        <div className="d-flex justify-content-around text-center">
          <div>
            <div className="fw-bold">3</div>
            <small className="text-muted">Posts</small>
          </div>
          <div>
            <div className="fw-bold">{user?.followerCount} </div>
            <small className="text-muted">Followers</small>
          </div>
          <div>
            <div className="fw-bold">{user?.followingCount}</div>
            <small className="text-muted">Following</small>
          </div>
        </div>
      </div>
      
      <div className="p-3 border-bottom">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 d-flex align-items-center">
            <BookOpen size={16} className="me-2" />
            My Learning Plans
          </h6>
        </div>
        
        {learningPlans.length > 0 ? (
          <div className="learning-plans-list">
            {learningPlans.map(plan => (
              <div key={plan.id} className="card mb-3 border-0 shadow-sm">
                <div className="card-body p-3">
                  {plan.status === "IN_PROGRESS" && (
                    <div className="progress mb-2" style={{ height: '6px' }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                          width: `${plan.progress}%`,
                          backgroundColor: getStatusColor(plan.status)
                        }}
                        aria-valuenow={plan.progress} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="card-title mb-2">{plan.title}</h6>
                    <div 
                      className="badge rounded-pill d-flex align-items-center"
                      style={{
                        backgroundColor: `${getStatusColor(plan.status)}20`,
                        color: getStatusColor(plan.status),
                        padding: '5px 8px'
                      }}
                    >
                      <span className="me-1">{getStatusIcon(plan.status)}</span>
                      {getStatusText(plan.status)}
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center text-muted mb-2 small">
                    <Calendar size={14} className="me-1" />
                    <span className="me-2">{plan.startDate}</span>
                    <span>→</span>
                    <span className="ms-2">{plan.endDate}</span>
                  </div>
                  
                  {plan.daysRemaining > 0 && plan.status !== "COMPLETED" && (
                    <div className="d-flex align-items-center small mb-2">
                      <Clock size={14} className="me-1 text-warning" />
                      <span className="text-warning">{plan.daysRemaining} days remaining</span>
                    </div>
                  )}
                  
                  <div className="mt-2">
                    {plan.topics.map((topic, index) => (
                      <span 
                        key={index} 
                        className="badge me-1 mb-1"
                        style={{
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          border: '1px solid #dee2e6',
                          fontWeight: 'normal'
                        }}
                      >
                        {topic}
                      </span>
                    ))}

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 bg-light rounded">
            <BookOpen size={32} className="text-muted mb-2" />
            <h6 className="text-muted mb-3">No learning plans yet</h6>
          </div>
        )}
      </div>
      
    </div>
  );
}
