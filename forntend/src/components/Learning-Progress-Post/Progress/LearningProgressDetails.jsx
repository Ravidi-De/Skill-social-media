// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import profileImg from '../../../assets/images/profile.png';
// import './learning-progress.css';

// export default function LearningProgressDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [progressItem, setProgressItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     fetchProgressDetail();
//   }, [id]);

//   const fetchProgressDetail = async () => {
//     try {
//       setLoading(true);
//       // Fetch the progress item
//       const response = await axios.get(`/api/learning-progress/${id}`);
//       setProgressItem(response.data);
      
//       // Fetch user details
//       const userResponse = await axios.get(`/api/users/${response.data.userId}`);
//       setUserData(userResponse.data);
      
//       setError('');
//     } catch (err) {
//       setError('Failed to load progress details. The item may no longer exist.');
//       console.error('Error fetching progress details:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get appropriate badge color based on skill level
//   const getLevelBadgeClass = (level) => {
//     if (!level) return 'badge-secondary';
    
//     switch(level.toLowerCase()) {
//       case 'beginner': return 'badge-beginner';
//       case 'intermediate': return 'badge-intermediate';
//       case 'advanced': return 'badge-advanced';
//       case 'expert': return 'badge-expert';
//       default: return 'badge-secondary';
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
    
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'long',
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   if (loading) {
//     return (
//       <div className="progress-detail-container d-flex justify-content-center p-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error || !progressItem) {
//     return (
//       <div className="progress-detail-container">
//         <div className="alert alert-danger" role="alert">
//           {error || 'Progress entry not found'}
//         </div>
//         <button 
//           className="btn btn-primary" 
//           onClick={() => navigate('/learning-progress')}
//         >
//           Back to Learning Progress
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="progress-detail-container">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <button 
//           className="btn btn-link p-0 text-decoration-none"
//           onClick={() => navigate('/learning-progress')}
//         >
//           <i className="fas fa-arrow-left me-2"></i>
//           Back to Learning Progress
//         </button>
//       </div>

//       <div className="progress-detail-card">
//         <div className="progress-detail-header">
//           <div className="d-flex align-items-center">
//             <img 
//               src={userData?.profilePicture || profileImg} 
//               alt={userData?.username || 'User'} 
//               className="progress-profile-pic"
//             />
//             <div className="progress-user-info">
//               <h6 className="progress-user-name">{userData?.username || 'User'}</h6>
//               <div className="progress-meta">
//                 <span className="progress-date">{formatDate(progressItem.date)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="progress-detail-body">
//           <div className="progress-skill-info mb-4">
//             <h3 className="progress-skill-title">{progressItem.skill}</h3>
//             <span className={`progress-level badge ${getLevelBadgeClass(progressItem.level)}`}>
//               {progressItem.level}
//             </span>
//           </div>
          
//           <div className="progress-detail-section">
//             <h5>Progress Description</h5>
//             <p className="progress-description">{progressItem.description}</p>
//           </div>
          
//           <div className="progress-detail-section">
//             <h5>Achievements & Milestones</h5>
//             <div className="progress-milestones">
//               <div className="progress-milestone">
//                 <div className="milestone-icon">
//                   <i className="fas fa-trophy"></i>
//                 </div>
//                 <div className="milestone-content">
//                   <h6>Reached {progressItem.level} level in {progressItem.skill}</h6>
//                   <p className="text-muted">{formatDate(progressItem.date)}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }