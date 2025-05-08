import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { UserContext } from '../../../common/UserContext';
import profileImg from '../../../assets/images/profile.png';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PostUpdateModal({ show, handleClose, post, onPostUpdated }) {
  const { user } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (post && show) {
      setDescription(post.description || '');
      setImages(post.imageUrls ? post.imageUrls.map(url => ({ url })) : []);
      setVideo(post.videoUrl ? { url: post.videoUrl } : null);
    } else if (!show) {

      setDescription('');
      setImages([]);
      setVideo(null);
    }
  }, [post, show]);

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleImageUpload = async (event) => {
    if (images.length >= 3) {
      Swal.fire({
        icon: "error",
        title: "Limit Reached",
        text: "Maximum 3 images allowed",
      });
      return;
    }

    try {
      setIsLoading(true);
      const imageUrl = await uploadToCloudinary(event.target.files[0], "image");
      setImages(prev => [...prev, { url: imageUrl }]);
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsLoading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handleVideoUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    try {
      setIsLoading(true);
      const videoUrl = await uploadToCloudinary(event.target.files[0], "video");
      setVideo({ url: videoUrl });
    } catch (error) {
      console.error('Error uploading video:', error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload video. Please try again.",
      });
    } finally {
      setIsLoading(false);
      event.target.value = ''; // Reset file input
    }
  };
  
  const updatePost = async () => {

    const userId = user?.id
    try {
      const postData = {
        description,
        imageUrls: images.map(img => img.url),
        videoUrl: video?.url || null,
      };

      const response = await axios.put(
        `http://localhost:8080/api/v1/post?postId=${post.postId}&userId=${userId}`,
        postData
      );
      
      Swal.fire({
        icon: "success",
        title: "Post Updated Successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update post. Please try again.",
      });
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Description Required",
        text: "Please add a description to your post.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const updatedPost = await updatePost();
      if (onPostUpdated) onPostUpdated(updatedPost);
      handleClose();
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Post</Modal.Title>
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
          placeholder="Update your post..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        
        <div className="upload-preview d-flex flex-wrap mb-3">
          {images?.map((image, index) => (
            <div key={index} className="position-relative me-2 mb-2">
              <img 
                src={image.url} 
                alt={`Preview ${index + 1}`} 
                className="img-thumbnail"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <button 
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={() => removeImage(index)}
                disabled={isLoading}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
          
          {video && (
            <div className="position-relative me-2 mb-2">
              <video 
                src={video?.url} 
                className="img-thumbnail"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                controls
              />
              <button 
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={removeVideo}
                disabled={isLoading}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          <div className="d-flex gap-2">
            {images.length < 3 && (
              <>
                <input 
                  type="file" 
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="d-none"
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="btn btn-outline-secondary"
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
                  disabled={isLoading}
                />
                <button 
                  type="button"
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
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button 
          type="button"
          className="btn btn-secondary me-2"
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button 
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!description.trim() || isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Post'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}