import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';
import profileImg from '../../assets/images/profile.png';
import axios from 'axios';
import { UserContext } from '../../common/UserContext';
import { toast } from 'react-toastify';
import LearningProgressModal from '../Learning-Progress-Post/post/LearningProgressModal';

export default function Sidebar() {
    const { user } = useContext(UserContext);
    const API_BASE_URL = 'http://localhost:8080/api/v1';
    
    const [popularSkills, setPopularSkills] = useState([
        { id: 1, name: 'Web Development', icon: 'fa-code' },
        { id: 2, name: 'Data Science', icon: 'fa-database' },
        { id: 3, name: 'Mobile Development', icon: 'fa-mobile' },
        { id: 4, name: 'Graphic Design', icon: 'fa-palette' },
    ]);
    
    const [userProgress, setUserProgress] = useState([]);
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [followedUsers, setFollowedUsers] = useState(new Set());
    const [loading, setLoading] = useState({
        progress: true,
        recommendations: true
    });
    const [followLoading, setFollowLoading] = useState({});
    const [showProgressModal, setShowProgressModal] = useState(false);

    useEffect(() => {
        if (user?.id) {
            getLearningProgress();
            getFollowedUsers().then(() => {
                getRecommendedUsers();
            });
        }
    }, [user?.id]);

    const getLearningProgress = async () => {
        try {
            setLoading(prev => ({ ...prev, progress: true }));
            const response = await axios.get(`${API_BASE_URL}/learning/progresses/${user.id}`);
            
            const transformedProgress = response.data.map(progress => ({
                id: progress.id,
                skill: progress.skill,
                level: progress.level,
                description: progress.description,
                date: progress.date,
                percentage: getLevelPercentage(progress.level)
            }));
            
            setUserProgress(transformedProgress);
        } catch (error) {
            console.error('Error fetching learning progress:', error);
            setUserProgress([]);
        } finally {
            setLoading(prev => ({ ...prev, progress: false }));
        }
    };

    const getLevelPercentage = (level) => {
        switch(level) {
            case 'Beginner': return 25;
            case 'Intermediate': return 50;
            case 'Advanced': return 75;
            case 'Expert': return 100;
            default: return 0;
        }
    };

    const getFollowedUsers = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/follow/following/${user.id}`);
            const following = response.data.map(followUser => followUser.userId);
            setFollowedUsers(new Set(following));
            return following;
        } catch (error) {
            console.error('Error fetching followed users:', error);
            return [];
        }
    };

    const getRecommendedUsers = async () => {
        try {
            setLoading(prev => ({ ...prev, recommendations: true }));
            const response = await axios.get(`${API_BASE_URL}/user/all-users`);
            const filteredUsers = response.data
                .filter(u => u.id !== user?.id && !followedUsers.has(u.id))
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            
            const techSkills = [
                ['Web Development', 'JavaScript'],
                ['Mobile Development', 'React Native'],
                ['Data Science', 'Python'],
                ['UI/UX Design', 'Figma'],
                ['Cloud Computing', 'AWS']
            ];
            
            setRecommendedUsers(filteredUsers.map((user, index) => ({
                id: user.id,
                name: user.name || 'Tech Enthusiast',
                image: user.imgUrl || profileImg,
                skills: techSkills[index % techSkills.length]
            })));
        } catch (error) {
            console.error('Error fetching recommended users:', error);
            setRecommendedUsers([
                { id: 1, name: 'Sarah Developer', image: profileImg, skills: ['Web Dev', 'JavaScript'] },
                { id: 2, name: 'David Data Scientist', image: profileImg, skills: ['Data Science', 'Python'] },
                { id: 3, name: 'Alex Mobile Dev', image: profileImg, skills: ['Mobile Dev', 'Flutter'] }
            ]);
        } finally {
            setLoading(prev => ({ ...prev, recommendations: false }));
        }
    };

    const handleFollow = async (userId, userName) => {
        if (followLoading[userId]) return;
        
        try {
            setFollowLoading(prev => ({ ...prev, [userId]: true }));
            await axios.patch(`${API_BASE_URL}/follow/${user.id}/follow/${userId}`);
            
            setFollowedUsers(prev => {
                const newSet = new Set(prev);
                newSet.add(userId);
                return newSet;
            });
            
            setRecommendedUsers(prev => prev.filter(user => user.id !== userId));
            toast.success(`You are now following ${userName || 'this user'}`);
            
            if (recommendedUsers.length <= 1) {
                getRecommendedUsers();
            }
        } catch (error) {
            console.error('Error following user:', error);
            toast.error('Failed to follow user');
        } finally {
            setFollowLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    return (
        <div className="sidebar bg-white shadow-sm">
            <div className="p-3 border-bottom">
                <h6 className="mb-3">My Learning Progress</h6>
                {loading.progress ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : userProgress.length > 0 ? (
                    <>
                        {userProgress.slice(0, 3).map(progress => (
                            <div key={progress.id} className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="fw-semibold">{progress.skill}</small>
                                    <small>{progress.percentage}%</small>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                    <div 
                                        className="progress-bar bg-primary" 
                                        role="progressbar" 
                                        style={{ width: `${progress.percentage}%` }}
                                        aria-valuenow={progress.percentage} 
                                        aria-valuemin="0" 
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>
                        ))}
                        <button 
                            className="btn btn-outline-primary btn-sm w-100 mt-2"
                            onClick={() => setShowProgressModal(true)}
                        >
                            View All Progress
                        </button>
                    </>
                ) : (
                    <div className="text-center py-2">
                        <small className="text-muted">No learning progress recorded yet</small>
                        <Link to="/learning-progress" className="btn btn-outline-primary btn-sm w-100 mt-2">
                            Start Tracking
                        </Link>
                    </div>
                )}
            </div>
            
            <div className="p-3 border-bottom">
                <h6 className="mb-3">Popular Skills</h6>
                <ul className="list-group list-group-flush">
                    {popularSkills.map(skill => (
                        <li key={skill.id} className="list-group-item px-0 py-2 border-0">
                            <Link to={`/skills/${skill.id}`} className="text-decoration-none text-dark">
                                <i className={`fas ${skill.icon} me-2 text-primary`}></i>
                                {skill.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                {/* <Link to="/explore-skills" className="btn btn-outline-primary btn-sm w-100 mt-2">
                    Explore More Skills
                </Link> */}
            </div>
            
            <div className="p-3">
                <h6 className="mb-3">Recommended Users</h6>
                {loading.recommendations ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {recommendedUsers.map(user => (
                            <div key={user.id} className="d-flex align-items-center mb-3">
                                <img 
                                    src={user.image} 
                                    alt={user.name} 
                                    className="rounded-circle me-2"
                                    width="36"
                                    height="36"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = profileImg;
                                    }}
                                />
                                <div className="flex-grow-1">
                                    <div className="fw-semibold">{user.name}</div>
                                    <small className="text-muted">
                                        {user.skills.join(' • ')}
                                    </small>
                                </div>
                                <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleFollow(user.id, user.name)}
                                    disabled={followLoading[user.id]}
                                >
                                    {followLoading[user.id] ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        'Follow'
                                    )}
                                </button>
                            </div>
                        ))}
                        {recommendedUsers.length === 0 && !loading.recommendations && (
                            <div className="text-muted small">No recommendations available</div>
                        )}
                        <Link to="/follow" className="btn btn-outline-primary btn-sm w-100 mt-2">
                            Find More Users
                        </Link>
                    </>
                )}
            </div>

            <LearningProgressModal 
                show={showProgressModal}
                onHide={() => setShowProgressModal(false)}
                progresses={userProgress}
                loading={loading.progress}
            />
        </div>
    );
}