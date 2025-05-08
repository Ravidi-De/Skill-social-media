import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.css";
import axios from "axios";
import Swal from "sweetalert2";

export default function Signup() {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userRequest = {
      name: `${userData.firstName} ${userData.lastName}`,
      username: userData.username,
      email: userData.email,
      password: userData.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/register",
        userRequest
      );
      console.log("User Registration Request:", response.data);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created successfully.",
        confirmButtonText: "Continue",
        confirmButtonColor: "#3085d6",
      });

      setUserData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Complete Error Object:", error);
      if (error.response) {
        console.error("Backend Error Response:", error.response.data);

        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text:
            error.response.data.message ||
            "An error occurred during registration",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#d33",
        });
      } else {
        console.error("Error Setting Up Request:", error.message);

        Swal.fire({
          icon: "error",
          title: "Unexpected Error",
          text: "An unexpected error occurred. Please try again.",
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <div className="fb-auth-container">
      <div className="fb-auth-content">
        <div className="fb-brand-section">
          <h1 className="fb-logo">SkillShare</h1>
          <p className="fb-tagline">
            Connect with skilled people and share your expertise with the world
          </p>
        </div>

        <div className="fb-form-section">
          <div className="fb-signup-card">
            <div className="fb-signup-header">
              <h2>Create a new account</h2>
              <p>It's quick and easy.</p>
            </div>
            <div className="fb-divider"></div>

            <form className="fb-form" onSubmit={handleSubmit}>
              <div className="fb-name-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={userData.firstName || ""}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={userData.lastName || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="fb-input-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={userData.username || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="fb-input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={userData.email || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="fb-input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="New password"
                  value={userData.password || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <p className="fb-terms">
                By clicking Sign Up, you agree to our{" "}
                <Link to="/terms">Terms</Link>,{" "}
                <Link to="/privacy">Privacy Policy</Link> and{" "}
                <Link to="/cookies">Cookies Policy</Link>.
              </p>

              <button type="submit" className="fb-signup-btn">
                Sign Up
              </button>

              <div className="fb-login-link">
                <Link to="/login">Already have an account?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="fb-footer">
        <div className="fb-footer-content">
          <div className="fb-language">
            <span>English (US)</span>
            <span>Español</span>
            <span>Français</span>
            <span>中文</span>
            <span>العربية</span>
            <span>Português</span>
            <span>Italiano</span>
            <span>한국어</span>
            <span>Deutsch</span>
            <span>हिन्दी</span>
            <span>日本語</span>
          </div>
          <div className="fb-divider"></div>
          <div className="fb-footer-links">
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
            <Link to="/about">About</Link>
            <Link to="/help">Help</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/careers">Careers</Link>
          </div>
          <p className="fb-copyright">SkillShare © 2025</p>
        </div>
      </footer>
    </div>
  );
}
