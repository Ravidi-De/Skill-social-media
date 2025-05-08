import React, { useContext, useEffect, useState } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import profileImg from "../../assets/images/profile.png";
import { UserContext } from "../../common/UserContext";
import axios from "axios";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [getUser , setGetUser] = useState();

  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/user/${user.id}`);
      setGetUser(response.data);
      console.log("get user by id : " , response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };


  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <i className="fas fa-share-alt text-primary me-2 fs-3"></i>
          <span className="fw-bold text-primary">SkillShare</span>
        </Link>

        <form
          className="d-none d-md-flex position-relative ms-4 flex-grow-1"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="fas fa-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Search skills, topics, or users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
            <li className="nav-item px-2">
              <Link className="nav-link" to="/home">
                <i className="fas fa-home fs-4"></i>
              </Link>
            </li>
            <li className="nav-item px-2">
                <i className="fas fa-lightbulb fs-4"></i>
            </li>
            <li className="nav-item px-2">
                <i className="fas fa-book fs-4"></i>
              
            </li>

            <li className="nav-item px-2">
              {user ? (
                <div className="dropdown">
                  <a 
                    className="nav-link dropdown-toggle d-flex align-items-center" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img 
                      src={getUser?.imgUrl || profileImg}
                      alt="Profile" 
                      className="rounded-circle me-md-2" 
                      width="32" 
                      height="32" 
                    />
                    <span className="d-none d-md-block">
                      {user.username || 'User'}
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                    {/* <li><Link className="dropdown-item" to="/settings">Settings</Link></li> */}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex">
                  <li className="nav-item ms-2">
                    <Link className="btn btn-outline-primary" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item ms-2">
                    <Link className="btn btn-primary" to="/register">
                      Sign Up
                    </Link>
                  </li>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}