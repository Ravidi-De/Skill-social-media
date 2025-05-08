import React, { useContext, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Sidebar2 from "../../components/Sidebar/Sidebar2";
import { UserContext } from "../../common/UserContext";
import profileImg from "../../assets/images/profile.png";
import SkillSharingPostModal from "../../components/Skill-Sharing-Post/modal/SkillSharingPostModal";
import Posts from "../../components/Skill-Sharing-Post/post/Posts";
import "./home.css";
import LearningPlanModal from "../../components/Learning-Plan-Post/modal/LearningPlanModal";
import LearningProgressModal from "../../components/Learning-Progress-Post/Form/LearningProgressFrom";
import LearningProgressPosts from "../../components/Learning-Progress-Post/post/LearningProgressPosts";
import LearningPlanPosts from "../../components/Learning-Plan-Post/post/LearningPlanPosts";
import SkillPostFeed from "../../components/Feed/Skill-Post/SkillPostFeed";
import LearningPlanPostFeed from "../../components/Feed/Plan/LearningPlanPostFeed";
import LearningProgressPostFeed from "../../components/Feed/Progress/LearningProgressPostFeed";

export default function Home() {
  const { user } = useContext(UserContext);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showLearningPostModal, setShowLearningPostModal] = useState(false);
  const [showLearningProgressPostModal, setShowLearningProgressPostModal] = useState(false);

  return (
    <div className="container-fluid p-0">
      <Navbar />
      <div className="row g-0">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-8 main-content">
          <div className="container-fluid p-4">
            {user && (
              <div className="upload-post-container bg-white shadow-sm rounded mb-4">
                <div className="d-flex align-items-center p-3 border-bottom">
                  <img
                    src={user.profilePicture || profileImg}
                    alt="Profile"
                    className="rounded-circle me-3"
                    width="40"
                    height="40"
                  />
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder={`What's on your mind, ${
                      user.username || "User"
                    }?`}
                    onClick={() => setShowPostModal(true)}
                  />
                </div>
                <div className="d-flex justify-content-between p-3">
                  <button className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={() => setShowLearningProgressPostModal(true)}
                  >
                    <i className="fas fa-chart-line text-danger me-2"></i>
                    Learning Progress
                  </button>
                  <button
                    className="btn btn-outline-secondary d-flex align-items-center"
                    onClick={() => setShowPostModal(true)}
                  >
                    <i className="fas fa-lightbulb text-success me-2"></i>
                    Skill Sharing Post
                  </button>
                  <button className="btn btn-outline-secondary d-flex align-items-center"
                  onClick={() => setShowLearningPostModal(true)}
                  >
                    <i className="fas fa-tasks text-warning me-2"></i>
                    Learning Plan
                  </button>
                </div>
              </div>
            )}

            <SkillPostFeed/>
            <LearningPlanPostFeed/>
          </div>
        </div>
        <div className="col-lg-2">
          <Sidebar2 />
        </div>
      </div>
      <SkillSharingPostModal
        show={showPostModal}
        handleClose={() => setShowPostModal(false)}
      />
      <LearningPlanModal show={showLearningPostModal} handleClose={() => setShowLearningPostModal(false)}/>
        <LearningProgressModal show={showLearningProgressPostModal} handleClose={() => setShowLearningProgressPostModal(false)}/>
    </div>
  );
}