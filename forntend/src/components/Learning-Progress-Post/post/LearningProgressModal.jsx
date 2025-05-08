import React from 'react';
import { Modal } from 'react-bootstrap';
import './LearningProgressModal.css';

const LearningProgressModal = ({ show, onHide, progresses, loading }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>My Learning Progress</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : progresses.length > 0 ? (
                    <div className="progress-list">
                        {progresses.map(progress => (
                            <div key={progress.id} className="progress-item mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0 fw-bold">{progress.skill}</h6>
                                    <small className="text-muted">{formatDate(progress.date)}</small>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">{progress.level}</small>
                                    <small>{progress.percentage}%</small>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div 
                                        className="progress-bar bg-primary" 
                                        role="progressbar" 
                                        style={{ width: `${progress.percentage}%` }}
                                        aria-valuenow={progress.percentage} 
                                        aria-valuemin="0" 
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                                {progress.description && (
                                    <p className="mt-2 mb-0 small text-muted">
                                        {progress.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p>No learning progress recorded yet</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={onHide}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default LearningProgressModal;