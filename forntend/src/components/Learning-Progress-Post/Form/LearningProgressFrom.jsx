import React, { useState, useRef, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { UserContext } from '../../../common/UserContext';
import profileImg from '../../../assets/images/profile.png';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function LearningProgressModal({ show, handleClose, onSuccess }) {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    skill: '',
    level: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const learningProgressRequest = {
        userId: user?.id,
        skill: formData.skill,
        level: formData.level,
        description: formData.description
      };
      const response = await axios.post('http://localhost:8080/api/v1/learning/progresses', learningProgressRequest);
      console.log('Learning Progress:', response.data);
      resetForm();
      handleClose();
       Swal.fire({
              icon: "success",
              title: "Learning Progress create Successful!",
              customClass: {
                popup: "fb-swal-popup",
              },
              showConfirmButton: false,
              timer: 2000,
            })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create learning progress. Please try again.');
      console.error('Error creating learning progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      skill: '',
      level: '',
      description: ''
    });
    setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Track Learning Progress</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-center bg-light p-3 mb-3">
          <img 
            src={user?.profilePicture || profileImg} 
            alt="Profile" 
            className="rounded-circle me-3" 
            width="40" 
            height="40" 
          />
          <span className="fw-bold">{user?.username || 'User'}</span>
        </div>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="skill" className="form-label">Skill</label>
            <input 
              type="text" 
              className="form-control" 
              id="skill"
              name="skill"
              placeholder="What skill are you tracking? (e.g., Java, React, UI Design)"
              value={formData.skill}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="level" className="form-label">Proficiency Level</label>
            <select 
              className="form-select" 
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">Select your current level</option>
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Progress Description</label>
            <textarea 
              className="form-control" 
              id="description"
              name="description"
              rows="4" 
              placeholder="Describe what you've learned or achieved with this skill recently..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button 
          className="btn btn-secondary me-2"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !formData.skill || !formData.level || !formData.description}
        >
          {loading ? 'Saving...' : 'Save Progress'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}