import React, { useContext, useEffect, useState } from 'react';
import Sidebar2 from '../../components/Sidebar/Sidebar2';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import '../Follow-Users/followUser.css';
import { UserContext } from '../../common/UserContext';
import { toast } from 'react-toastify';

export default function FollowUsers() {
    const [allUsers, setAllUsers] = useState([]);
    const [followedUsers, setFollowedUsers] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState({});
    const { user } = useContext(UserContext);
    const [error, setError] = useState(null);
    const API_BASE_URL = 'http://localhost:8080/api/v1';

    useEffect(() => {
        if (user?.id) {
            getFollowedUsers().then(() => {
                getAllUsers();
            });
            const storedFollows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
            if (storedFollows.length > 0) {
                setFollowedUsers(new Set(storedFollows));
            }
        }
    }, [user?.id]);

    const getAllUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/user/all-users`);
            const filteredUsers = response.data
                .filter(u => u.id !== user?.id)
                .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            setAllUsers(filteredUsers); 
        } catch (error) {
            console.error('Error fetching all users:', error);
            setError('Failed to load user suggestions. Please try again later.');
            toast.error('Failed to load user suggestions');
        } finally {
            setLoading(false);
        }
    };

    const getFollowedUsers = async () => {
        try {
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/follow/following/${user.id}`);
            const following = response.data.map(followUser => followUser.userId);
            setFollowedUsers(new Set(following));
            localStorage.setItem(`follows_${user.id}`, JSON.stringify(following));
            return following;
        } catch (error) {
            console.error('Error fetching followed users:', error);
            toast.error('Failed to load your followed users');
            return [];
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
            const storedFollows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
            if (!storedFollows.includes(userId)) {
                localStorage.setItem(`follows_${user.id}`, JSON.stringify([...storedFollows, userId]));
            }
            toast.success(`You are now following ${userName || 'this user'}`);
        } catch (error) {
            console.error('Error following user:', error);
            if (error.response && error.response.status === 409) {
                toast.info('You are already following this user');
                setFollowedUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.add(userId);
                    return newSet;
                });
                const storedFollows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
                if (!storedFollows.includes(userId)) {
                    localStorage.setItem(`follows_${user.id}`, JSON.stringify([...storedFollows, userId]));
                }
            } else {
                toast.error('Failed to follow user');
            }
        } finally {
            setFollowLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleUnfollow = async (userId, userName) => {
        if (followLoading[userId]) return;
        
        try {
            setFollowLoading(prev => ({ ...prev, [userId]: true }));
            await axios.patch(`${API_BASE_URL}/follow/${user.id}/unfollow/${userId}`);
            setFollowedUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
            const storedFollows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
            const updatedFollows = storedFollows.filter(id => id !== userId);
            localStorage.setItem(`follows_${user.id}`, JSON.stringify(updatedFollows));
            toast.info(`You have unfollowed ${userName || 'this user'}`);
        } catch (error) {
            console.error('Error unfollowing user:', error);
            toast.error('Failed to unfollow user');
        } finally {
            setFollowLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleRemoveSuggestion = (userId) => {
        setAllUsers(prev => prev.filter(user => user.id !== userId));
        toast.info('Suggestion removed');
    };

    const refreshSuggestions = () => {
        getAllUsers();
        toast.info('Refreshing suggestions...');
    };

    return (
        <div className="container-fluid p-0 follow-users-page">
            <Navbar />
            <div className="row g-0">
                <div className="col-lg-2">
                    <Sidebar />
                </div>
                <div className="col-lg-8 main-content">
                    <div className="container-fluid p-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="fw-bold">People You May Know</h2>
                                    <button 
                                        className="btn btn-light refresh-btn"
                                        onClick={refreshSuggestions}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-arrow-clockwise me-1"></i>
                                        Refresh
                                    </button>
                                </div>
                                
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                
                                {loading ? (
                                    <div className="text-center p-5 no-users-message">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3">Looking for more people you may know...</p>
                                    </div>
                                ) : (
                                    <>
                                        {allUsers.length > 0 ? (
                                            <div className="user-grid facebook-style-grid">
                                                {allUsers.map((fUser) => (
                                                    <div key={fUser.id} className="user-card facebook-style">
                                                        <div className="user-card-header">
                                                            <div className="user-avatar-container">
                                                                {fUser.imgUrl ? (
                                                                    <img 
                                                                        src={fUser.imgUrl} 
                                                                        alt={fUser.name || 'User'} 
                                                                        className="user-avatar"
                                                                    />
                                                                ) : (
                                                                    <div className="user-avatar-placeholder">
                                                                        {(fUser.name ? fUser.name.charAt(0) : 'U').toUpperCase()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="user-card-body">
                                                            <h5 className="user-name">{fUser.name || 'Unknown User'}</h5>
                                                            
                                                            <div className="action-buttons">
                                                                {followedUsers.has(fUser.id) ? (
                                                                    <button 
                                                                        className="following-btn"
                                                                        onClick={() => handleUnfollow(fUser.id, fUser.name)}
                                                                        disabled={followLoading[fUser.id]}
                                                                    >
                                                                        {followLoading[fUser.id] ? (
                                                                            <>
                                                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                                                Processing...
                                                                            </>
                                                                        ) : (
                                                                            <>Following</>
                                                                        )}
                                                                    </button>
                                                                ) : (
                                                                    <button 
                                                                        className="follow-btn"
                                                                        onClick={() => handleFollow(fUser.id, fUser.name)}
                                                                        disabled={followLoading[fUser.id]}
                                                                    >
                                                                        {followLoading[fUser.id] ? (
                                                                            <>
                                                                                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                                                Processing...
                                                                            </>
                                                                        ) : (
                                                                            <>Follow</>
                                                                        )}
                                                                    </button>
                                                                )}
                                                                <button 
                                                                    className="remove-btn"
                                                                    onClick={() => handleRemoveSuggestion(fUser.id)}
                                                                    title="Remove suggestion"
                                                                >
                                                                    <i className="bi bi-x-lg"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center p-5 no-users-message">
                                                <i className="bi bi-people-fill fs-1 mb-3 text-secondary"></i>
                                                <p>No user suggestions available at the moment.</p>
                                                <button 
                                                    className="btn btn-primary mt-2"
                                                    onClick={refreshSuggestions}
                                                >
                                                    <i className="bi bi-arrow-clockwise me-1"></i>
                                                    Try Again
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-2">
                    <Sidebar2 />
                </div>
            </div>
        </div>
    );
}