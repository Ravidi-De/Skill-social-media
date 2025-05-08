// import React, { useState, useEffect, useContext } from 'react';
// import { UserContext } from '../../../common/UserContext';
// import profileImg from '../../../assets/images/profile.png';
// import LearningProgressModal from './LearningProgressModal';
// import axios from 'axios';
// import './learning-progress.css';

// export default function LearningProgressList() {
//   const { user } = useContext(UserContext);
//   const [progressItems, setProgressItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // Fetch learning progress items on component mount
//   useEffect(() => {
//     fetchLearningProgress();
//   }, []);

//   const fetchLearningProgress = async () => {
//     if (!user?.id) return;
    
//     try {
//       setLoading(true);
//       const response = await axios.get(`/api/learning-progress/user/${user.id}`);
//       setProgressItems(response.data);
//       setError('');
//     } catch (err) {
//       setError('Failed to load learning progress. Please try again later.');
//       console.error('Error fetching learning progress:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddProgress = () => {
//     setSelectedItem(null);
//     setShowModal(true);
//   };

//   const handleEditProgress = (item) => {
//     setSelectedItem(item);
//     setShowModal(true);
//   };

//   const handleDeleteProgress = async (id) => {
//     if (window.confirm('Are you sure you want to delete this progress entry?')) {
//       try {
//         await axios.delete(`/api/learning-progress/${id}`);
//         setProgressItems(prev => prev.filter(item => item.id !== id));
//       } catch (err) {
//         alert('Failed to delete. Please try again.');
//         console.error('Error deleting learning progress:', err);
//       }
//     }
//   };

//   const handleProgressSuccess = (newItem) => {
//     if (selectedItem) {
//       // Update existing item
//       setProgressItems(prev => 
//         prev.map(item => item.id === newItem.id ? newItem : item)
//       );
//     } else {
//       // Add new item
//       setProgressItems(prev => [newItem, ...prev]);
//     }
//   };

//   // Get appropriate badge color based on skill level
//   const getLevelBadgeClass = (level) => {
//     switch(level.toLowerCase()) {
//       case 'beginner': return 'badge-beginner';
//       case 'intermediate': return 'badge-intermediate';
//       case 'advanced': return 'badge-advanced';
//       case 'expert': return 'badge-expert';
//       default: return 'badge-secondary';
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   if (loading && progressItems.length === 0) {
//     return (
//       <div className="progress-container d-flex justify-content-center p-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="progress-container">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="m-0">My Learning Progress</h4>
//         <button 
//           className="btn btn-primary" 
//           onClick={handleAddProgress}
//         >
//           <i className="fas fa-plus me-2"></i>Track New Progress
//         </button>
//       </div>

//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}

//       {progressItems.length === 0 ? (
//         <div className="progress-empty-state text-center py-5">
//           <i className="fas fa-book-reader fa-3x mb-3 text-muted"></i>
//           <h5>No learning progress tracked yet</h5>
//           <p className="text-muted">Start tracking your learning journey by adding a new progress entry.</p>
//           <button 
//             className="btn btn-outline-primary mt-2" 
//             onClick={handleAddProgress}
//           >
//             <i className="fas fa-plus me-2"></i>Add First Progress Entry
//           </button>
//         </div>
//       ) : (
//         <div className="progress-list">
//           {progressItems.map(item => (
//             <div key={item.id} className="progress-card">
//               <div className="progress-header">
//                 <div className="d-flex align-items-center">
//                   <img 
//                     src={user?.profilePicture || profileImg} 
//                     alt={user?.username || 'User'} 
//                     className="progress-profile-pic"
//                   />
//                   <div className="progress-user-info">
//                     <h6 className="progress-user-name">{user?.username || 'User'}</h6>
//                     <div className="progress-meta">
//                       <span className="progress-date">{formatDate(item.date)}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="progress-actions dropdown">
//                   <button className="btn btn-link dropdown-toggle" type="button" id={`dropdown-${item.id}`} data-bs-toggle="dropdown" aria-expanded="false">
//                     <i className="fas fa-ellipsis-v"></i>
//                   </button>
//                   <ul className="dropdown-menu" aria-labelledby={`dropdown-${item.id}`}>
//                     <li><button className="dropdown-item" onClick={() => handleEditProgress(item)}>Edit</button></li>
//                     <li><button className="dropdown-item text-danger" onClick={() => handleDeleteProgress(item.id)}>Delete</button></li>
//                   </ul>
//                 </div>
//               </div>
              
//               <div className="progress-body">
//                 <div className="progress-skill-info mb-3">
//                   <h5 className="progress-skill">{item.skill}</h5>
//                   <span className={`progress-level badge ${getLevelBadgeClass(item.level)}`}>
//                     {item.level}
//                   </span>
//                 </div>
//                 <p className="progress-description">{item.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <LearningProgressModal 
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         onSuccess={handleProgressSuccess}
//         initialData={selectedItem}
//       />
//     </div>
//   );
// }