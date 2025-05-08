import React, { useContext, useState, useEffect } from "react";
import "./userprofile.css";
import Posts from "../../components/Skill-Sharing-Post/post/Posts";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar2 from "../../components/Sidebar/Sidebar2";
import Sidebar from "../../components/Sidebar/Sidebar";
import { UserContext } from "../../common/UserContext";
import LearningProgressPosts from "../../components/Learning-Progress-Post/post/LearningProgressPosts";
import LearningPlanPosts from "../../components/Learning-Plan-Post/post/LearningPlanPosts";
import { uploadToCloudinary } from "../../components/utils/uploadToCloudinary";
import axios from "axios";
import Swal from "sweetalert2";

function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    imgUrl: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/${user.id}`);
        setCurrentUser(response.data);
        setFormData({
          name: response.data.name || "",
          username: response.data.username || "",
          email: response.data.email || "",
          password: "",
          imgUrl: response.data.imgUrl || ""
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load user data',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    if (user && user.id) {
      fetchUserData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        document.getElementById("profileImagePreview").src = loadEvent.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      let imageUrl = currentUser.imgUrl;
      
      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage, "image");
      }
      
      // Only include fields that have changed
      const updateData = {};
      
      if (formData.name !== currentUser.name) {
        updateData.name = formData.name;
      }
      
      if (formData.username !== currentUser.username) {
        updateData.username = formData.username;
      }
      
      if (formData.email !== currentUser.email) {
        updateData.email = formData.email;
      }
      
      if (selectedImage) {
        updateData.imgUrl = imageUrl;
      }
      
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }
  
      // Only proceed with update if there are actual changes
      if (Object.keys(updateData).length > 0) {
        const response = await axios.put(
          `http://localhost:8080/api/v1/user/update/${user.id}`,
          updateData
        );
        
        // Update both context and local state
        setUser({
          ...user,
          ...response.data
        });
        
        setCurrentUser(response.data);
        setIsEditing(false);
        
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        setIsEditing(false);
        Swal.fire({
          title: 'No changes',
          text: 'No changes were made to your profile',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      let errorMessage = "Failed to update profile. Please try again.";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will lose all unsaved changes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, discard changes!'
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData({
          name: currentUser.name || "",
          username: currentUser.username || "",
          email: currentUser.email || "",
          password: "",
          imgUrl: currentUser.imgUrl || ""
        });
        setSelectedImage(null);
        setError("");
        setIsEditing(false);
      }
    });
  };

  if (!currentUser) {
    return (
      <div className="loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="container-fluid p-0">
        <Navbar />
        <div className="row g-0">
          <div className="col-lg-2">
            <Sidebar />
          </div>
          <div className="col-lg-8 main-content">
            <div className="container-fluid p-4">
              <div className="user-profile">
                <div className="profile-header">
                  <h2 className="profile-title">My Profile</h2>
                  {!isEditing && (
                    <button
                      className="edit-profile-btn"
                      onClick={() => setIsEditing(true)}
                      disabled={isLoading}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {isEditing ? (
                  <div className="edit-profile-form">
                    <div className="profile-image-wrapper edit-mode">
                      <img
                        id="profileImagePreview"
                        src={formData.imgUrl || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="profile-image"
                      />
                      <label className="upload-button">
                        Change Photo
                        <input 
                          type="file" 
                          style={{ display: "none" }} 
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">
                          New Password (leave blank to keep current)
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>

                      <div className="form-actions">
                        <button 
                          type="submit" 
                          className="save-btn"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={handleCancel}
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="profile-content">
                    <div className="profile-top">
                      <div className="profile-image-wrapper">
                        <img
                          src={currentUser.imgUrl || "https://via.placeholder.com/150"}
                          alt="Profile"
                          className="profile-image"
                        />
                      </div>
                      <div className="profile-info">
                        <h2 className="user-name">{currentUser.name}</h2>
                        <p className="username">@{currentUser.username}</p>
                        <p className="email">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="posts-section">
                  <h3>Posts</h3>
                  <Posts editable={true} />
                  <LearningProgressPosts editable={true}/>
                  <LearningPlanPosts editable={true} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2">
            <Sidebar2 />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;