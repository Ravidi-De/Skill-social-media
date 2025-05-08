// import React, { useState } from 'react';
// import profileImg from '../../../assets/images/profile.png';
// import './learning-plan.css';

// export default function LearningPlanCard({ plan, onUpdate, onDelete }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [status, setStatus] = useState(plan.status);
//   const [expanded, setExpanded] = useState(false);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'NOT_STARTED':
//         return 'text-secondary';
//       case 'IN_PROGRESS':
//         return 'text-primary';
//       case 'COMPLETED':
//         return 'text-success';
//       default:
//         return 'text-secondary';
//     }
//   };

//   const getStatusLabel = (status) => {
//     switch (status) {
//       case 'NOT_STARTED':
//         return 'Not Started';
//       case 'IN_PROGRESS':
//         return 'In Progress';
//       case 'COMPLETED':
//         return 'Completed';
//       default:
//         return status;
//     }
//   };

//   const handleStatusChange = async (e) => {
//     const newStatus = e.target.value;
//     setStatus(newStatus);
    
//     try {
//       // Replace with your API endpoint
//       const response = await fetch(`/api/learning-plans/${plan.id}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           postId: plan.id,
//           status: newStatus
//         }),
//       });
      
//       if (response.ok) {
//         if (onUpdate) onUpdate({ ...plan, status: newStatus });
//       } else {
//         // Revert on error
//         setStatus(plan.status);
//         console.error('Failed to update status');
//       }
//     } catch (error) {
//       setStatus(plan.status);
//       console.error('Error updating status:', error);
//     }
    
//     setIsEditing(false);
//   };

//   const calculateProgress = () => {
//     const now = new Date();
//     const start = new Date(plan.startDate);
//     const end = new Date(plan.endDate);
    
//     if (plan.status === 'COMPLETED') return 100;
//     if (now < start) return 0;
//     if (now > end) return 100;
    
//     const totalDays = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
//     const daysElapsed = Math.max(0, (now - start) / (1000 * 60 * 60 * 24));
//     return Math.min(100, Math.round((daysElapsed / totalDays) * 100));
//   };
  
//   const progressPercentage = calculateProgress();

//   const handleDelete = async () => {
//     if (!window.confirm('Are you sure you want to delete this learning plan?')) {
//       return;
//     }
    
//     try {
//       // Replace with your API endpoint
//       const response = await fetch(`/api/learning-plans/${plan.id}`, {
//         method: 'DELETE',
//       });
      
//       if (response.ok) {
//         if (onDelete) onDelete(plan.id);
//       } else {
//         console.error('Failed to delete learning plan');
//       }
//     } catch (error) {
//       console.error('Error deleting learning plan:', error);
//     }
//   };

//   return (
//     <div className="learning-plan__card">
//       <div className="learning-plan__header">
//         <img 
//           src={profileImg} 
//           alt="Profile" 
//           className="learning-plan__profile-pic"
//         />
//         <div className="learning-plan__user-info">
//           <h6 className="learning-plan__user-name">Learning Plan</h6>
//           <div className="learning-plan__meta">
//             <span className={`learning-plan__status ${getStatusColor(plan.status)}`}>
//               {getStatusLabel(plan.status)}
//             </span>
//             <span className="learning-plan__date-range">
//               {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
//             </span>
//           </div>
//         </div>
//         <div className="learning-plan__actions-dropdown dropdown">
//           <button 
//             className="learning-plan__dropdown-toggle"
//             type="button"
//             id={`dropdown-${plan.id}`}
//             data-bs-toggle="dropdown"
//             aria-expanded="false"
//           >
//             <i className="fas fa-ellipsis-v"></i>
//           </button>
//           <ul className="dropdown-menu" aria-labelledby={`dropdown-${plan.id}`}>
//             <li><button className="dropdown-item" onClick={() => setIsEditing(true)}>Change Status</button></li>
//             <li><button className="dropdown-item" onClick={handleDelete}>Delete</button></li>
//           </ul>
//         </div>
//       </div>
      
//       <div className="learning-plan__body">
//         <h5 className="learning-plan__title">{plan.title}</h5>
        
//         <div className="learning-plan__progress-container">
//           <div className="learning-plan__progress-bar">
//             <div 
//               className="learning-plan__progress-fill" 
//               style={{ width: `${progressPercentage}%` }}
//             ></div>
//           </div>
//           <div className="learning-plan__progress-label">{progressPercentage}% Completed</div>
//         </div>
        
//         {isEditing ? (
//           <div className="learning-plan__status-editor">
//             <select 
//               className="form-select"
//               value={status}
//               onChange={handleStatusChange}
//             >
//               <option value="NOT_STARTED">Not Started</option>
//               <option value="IN_PROGRESS">In Progress</option>
//               <option value="COMPLETED">Completed</option>
//             </select>
//           </div>
//         ) : (
//           <button 
//             className="learning-plan__expand-btn"
//             onClick={() => setExpanded(!expanded)}
//           >
//             {expanded ? 'Show Less' : 'Show More'} <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
//           </button>
//         )}
        
//         {expanded && (
//           <div className="learning-plan__details">
//             <div className="learning-plan__section">
//               <h6 className="learning-plan__section-title">Topics</h6>
//               <ul className="learning-plan__list">
//                 {plan.topics.map((topic, index) => (
//                   <li key={index} className="learning-plan__list-item">
//                     <i className="fas fa-check-circle me-2"></i> {topic}
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div className="learning-plan__section">
//               <h6 className="learning-plan__section-title">Resources</h6>
//               <ul className="learning-plan__list">
//                 {plan.resources.map((resource, index) => (
//                   <li key={index} className="learning-plan__list-item">
//                     <i className="fas fa-link me-2"></i>
//                     {resource.startsWith('http') ? (
//                       <a href={resource} target="_blank" rel="noopener noreferrer">
//                         {resource}
//                       </a>
//                     ) : (
//                       resource
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }