import React, { useState, useRef, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { UserContext } from '../../../common/UserContext';
import profileImg from '../../../assets/images/profile.png';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function SkillSharingPostModal({ show, handleClose, onPostCreated }) {
  const { user } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleImageUpload = async (event) => {
    try {
      setIsLoading(true);
      const imageUrl = await uploadToCloudinary(event.target.files[0], "image");
      setImages(prev => [...prev, { url: imageUrl }]);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoUpload = async (event) => {
    try {
      setIsLoading(true);
      const videoUrl = await uploadToCloudinary(event.target.files[0], "video");
      setVideo({ url: videoUrl });
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/post`, postData);
      Swal.fire({
        icon: "success",
        title: "Learning Plan Created Successfully!",
        customClass: {
          popup: "fb-swal-popup",
        },
        showConfirmButton: false,
        timer: 2000,
      });
      window.location.reload();
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || (images.length === 0 && !video)) return;

    try {
      setIsLoading(true);
      
      const postData = {
        description,
        imageUrls: images.map(img => img.url),
        videoUrl: video?.url || null,
        userId: user.id 
      };

      const createdPost = await createPost(postData);
      console.log('Post created:', createdPost);
      
      setDescription('');
      setImages([]);
      setVideo(null);
      
      handleClose();
      if (onPostCreated) onPostCreated(createdPost);
      
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a Skill Sharing Post</Modal.Title>
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
        
        <textarea 
          className="form-control mb-3" 
          rows="4" 
          placeholder={`What skill are you sharing today, ${user?.username || 'User'}?`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        
        <div className="upload-preview d-flex flex-wrap mb-3">
          {images.map((image, index) => (
            <div key={index} className="image-preview position-relative me-2 mb-2">
              <img 
                src={image.url} 
                alt={`Preview ${index + 1}`} 
                className="img-thumbnail"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <button 
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={() => removeImage(index)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
          
          {video && (
            <div className="video-preview position-relative me-2 mb-2">
              <video 
                src={video.url} 
                className="img-thumbnail"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                controls
              />
              <button 
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={removeVideo}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {(images.length < 3 || !video) && (
            <div className="upload-buttons d-flex">
              {images.length < 3 && (
                <>
                  <input 
                    type="file" 
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="d-none"
                  />
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={() => imageInputRef.current.click()}
                    disabled={isLoading}
                  >
                    <i className="fas fa-image me-2"></i>
                    {isLoading ? 'Uploading...' : 'Add Photo'}
                  </button>
                </>
              )}
              
              {!video && (
                <>
                  <input 
                    type="file" 
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    accept="video/*"
                    className="d-none"
                  />
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => videoInputRef.current.click()}
                    disabled={isLoading}
                  >
                    <i className="fas fa-video me-2"></i>
                    {isLoading ? 'Uploading...' : 'Add Video'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button 
          className="btn btn-primary w-100"
          onClick={handleSubmit}
          disabled={!description || (images?.length === 0 && !video) || isLoading}
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}