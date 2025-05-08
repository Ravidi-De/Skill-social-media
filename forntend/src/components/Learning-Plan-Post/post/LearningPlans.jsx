// import React, { useState, useEffect, useContext } from 'react';
// import { UserContext } from '../../../common/UserContext';
// import LearningPlanCard from './LearningPlanCard';
// import LearningPlanModal from './LearningPlanModal';
// import './learning-plan.css';

// export default function LearningPlans() {
//   const { user } = useContext(UserContext);
//   const [learningPlans, setLearningPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [filterStatus, setFilterStatus] = useState('ALL');

//   useEffect(() => {
//     if (user?.id) {
//       fetchLearningPlans();
//     }
//   }, [user]);

//   const fetchLearningPlans = async () => {
//     setLoading(true);
//     try {
//       // Replace with your API endpoint
//       const response = await fetch(`/api/learning-plans/user/${user.id}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch learning plans');
//       }
      
//       const data = await response.json();
//       setLearningPlans(data);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching learning plans:', err);
//       setError('Failed to load learning plans. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreatePlan = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handlePlanCreated = () => {
//     fetchLearningPlans();
//   };

//   const handlePlanUpdated = (updatedPlan) => {
//     setLearningPlans(prev => 
//       prev.map(plan => plan.id === updatedPlan.id ? updatedPlan : plan)
//     );
//   };

//   const handlePlanDeleted = (planId) => {
//     setLearningPlans(prev => prev.filter(plan => plan.id !== planId));
//   };

//   const getFilteredPlans = () => {
//     if (filterStatus === 'ALL') return learningPlans;
//     return learningPlans.filter(plan => plan.status === filterStatus);
//   };

//   if (loading && !learningPlans.length) {
//     return (
//       <div className="learning-plan__container">
//         <div className="learning-plan__loading">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p>Loading your learning plans...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="learning-plan__container">
//       <div className="learning-plan__header-section">
//         <h4 className="learning-plan__main-title">My Learning Plans</h4>
//         <button 
//           className="learning-plan__create-btn" 
//           onClick={handleCreatePlan}
//         >
//           <i className="fas fa-plus me-2"></i> Create Plan
//         </button>
//       </div>
      
//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}
      
//       <div className="learning-plan__filters">
//         <div className="learning-plan__filter-label">Filter by status:</div>
//         <div className="learning-plan__filter-buttons">
//           <button 
//             className={`learning-plan__filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
//             onClick={() => setFilterStatus('ALL')}
//           >
//             All
//           </button>
//           <button 
//             className={`learning-plan__filter-btn ${filterStatus === 'NOT_STARTED' ? 'active' : ''}`}
//             onClick={() => setFilterStatus('NOT_STARTED')}
//           >
//             Not Started
//           </button>
//           <button 
//             className={`learning-plan__filter-btn ${filterStatus === 'IN_PROGRESS' ? 'active' : ''}`}
//             onClick={() => setFilterStatus('IN_PROGRESS')}
//           >
//             In Progress
//           </button>
//           <button 
//             className={`learning-plan__filter-btn ${filterStatus === 'COMPLETED' ? 'active' : ''}`}
//             onClick={() => setFilterStatus('COMPLETED')}
//           >
//             Completed
//           </button>
//         </div>
//       </div>
      
//       {getFilteredPlans().length === 0 ? (
//         <div className="learning-plan__empty-state">
//           <i className="fas fa-book-open learning-plan__empty-icon"></i>
//           <h5>No learning plans found</h5>
//           <p>
//             {filterStatus === 'ALL' 
//               ? "You don't have any learning plans yet. Create one to get started!" 
//               : `You don't have any ${filterStatus.toLowerCase().replace('_', ' ')} learning plans.`}
//           </p>
//           {filterStatus !== 'ALL' && (
//             <button 
//               className="btn btn-outline-primary btn-sm"
//               onClick={() => setFilterStatus('ALL')}
//             >
//               Show all plans
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="learning-plan__list">
//           {getFilteredPlans().map(plan => (
//             <LearningPlanCard 
//               key={plan.id} 
//               plan={plan} 
//               onUpdate={handlePlanUpdated}
//               onDelete={handlePlanDeleted}
//             />
//           ))}
//         </div>
//       )}
      
//       <LearningPlanModal 
//         show={showModal} 
//         handleClose={handleCloseModal} 
//         onSuccess={handlePlanCreated}
//       />
//     </div>
//   );
// }