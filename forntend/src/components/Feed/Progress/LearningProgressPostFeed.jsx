import React, { useState, useEffect, useContext } from 'react';
import profileImg from '../../../assets/images/profile.png';
import '../../Learning-Progress-Post/post/learningProgress.css'; 
import axios from 'axios';
import { UserContext } from '../../../common/UserContext';

export default function LearningProgressPostFeed() {
  const [progressPosts, setProgressPosts] = useState([]);
const [postUser , setPostUser] = useState({});

  useEffect(() => {
    getAllLearningProgress();
  }, []);

  const getAllLearningProgress = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/learning/feed`);
      
      const transformedData = await Promise.all(
        response.data.map(async (post) => {
          try {
            const userResponse = await axios.get(`http://localhost:8080/api/v1/user/${post.userId}`);
            setPostUser(userResponse.data);
            console.log(userResponse.data);
            
            return {
              id: post.id,
              user: {
                id: post.userId,
                name: `${postUser.firstName} ${postUser.lastName}`,
                profile: profileImg 
              },
              skill: post.skill,
              level: post.level,
              description: post.description,
              timestamp: formatTimestamp(post.date), 
              likes: 0, 
              comments: 0 
            };
          } catch (userErr) {
            console.error('Error fetching user data:', userErr);
            return {
              id: post.id,
              user: {
                id: post.userId,
                name: `User ${post.userId}`,
                profile: profileImg
              },
              skill: post.skill,
              level: post.level,
              description: post.description,
              timestamp: formatTimestamp(post.date), 
              likes: 0, 
              comments: 0 
            };
          }
        })
      );
      
      setProgressPosts(transformedData);
    } catch (err) {
      console.log(err);
      setProgressPosts([]);
    }
  };
  const formatTimestamp = (date) => {
    if (!date) return 'Recently';
    
    const postDate = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getLevelInfo = (level) => {
    switch(level) {
      case 'Beginner':
        return {
          color: '#2ecc71',
          percentage: 25
        };
      case 'Intermediate':
        return {
          color: '#2ecc71', 
          percentage: 50
        };
      case 'Advanced':
        return {
          color: '#2ecc71', 
          percentage: 75
        };
      case 'Expert':
        return {
          color: '#2ecc71', 
          percentage: 100
        };
      default:
        return {
          color: '#95a5a6',
          percentage: 0
        };
    }
  };

  const getSkillBadgeStyle = (skill) => {
    const colors = ['#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c'];
    let hash = 0;
    
    for (let i = 0; i < skill.length; i++) {
      hash = skill.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    hash = Math.abs(hash % colors.length);
    return colors[hash];
  };

  return (
    <div className="learning-progress__container">
      {progressPosts.length > 0 ? (
        progressPosts.map(post => {
          const levelInfo = getLevelInfo(post.level);
          const skillColor = getSkillBadgeStyle(post.skill);
          
          return (
            <div key={post.id} className="learning-progress__card">
              <div className="learning-progress__header">
                <div className="learning-progress__user-wrapper">
                  <img 
                    src={post.user.profile} 
                    alt={post.user.name} 
                    className="learning-progress__profile-pic"
                  />
                  <div className="learning-progress__name-info">
                    <div className="learning-progress__name-line">
                      <h6 className="learning-progress__user-name">{postUser.name}</h6>
                      <div className="learning-progress__skill-badge" style={{ backgroundColor: `${skillColor}20`, color: skillColor }}>
                        {post.skill}
                      </div>
                    </div>
                    <div className="learning-progress__timestamp">{post.timestamp}</div>
                  </div>
                </div>
              </div>
              
              <div className="learning-progress__body">
                <div className="learning-progress__level" style={{ color: levelInfo.color }}>
                  {post.level}
                </div>
                
                <div className="learning-progress__progress-container">
                  <div className="learning-progress__progress-bar">
                    <div 
                      className="learning-progress__progress-fill" 
                      style={{ 
                        width: `${levelInfo.percentage}%`,
                        backgroundColor: levelInfo.color 
                      }}
                    ></div>
                  </div>
                  <div className="learning-progress__percentage">
                    {levelInfo.percentage}%
                  </div>
                </div>
                
                <div className="learning-progress__level-labels">
                  <span className="learning-progress__level-label">Beginner</span>
                  <span className="learning-progress__level-label">Intermediate</span>
                  <span className="learning-progress__level-label">Advanced</span>
                  <span className="learning-progress__level-label">Expert</span>
                </div>
                
                <p className="learning-progress__description">{post.description}</p>
              </div>
              
              <div className="learning-progress__footer">
                <div className="learning-progress__action">
                  <i className="fas fa-thumbs-up"></i> 
                  <span>{post.likes}</span>
                </div>
                <div className="learning-progress__action">
                  <i className="fas fa-comment"></i>
                  <span>{post.comments}</span>
                </div>
                <div className="learning-progress__action">
                  <i className="fas fa-share"></i>
                  <span>Share</span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="learning-progress__empty-state">
          <p>No learning progress posts found. Start sharing your learning journey!</p>
        </div>
      )}
    </div>
  );
}