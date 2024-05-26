import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_SERVER } from "../../../config/apiConfig";
import { useRecoilValue } from "recoil";
import { userState, isLoggedInState } from "../../../recoil/userAtom";

function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const isLoggedIn = useRecoilValue(isLoggedInState);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("User not authenticated.");
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setTeamNameError("");

    if (!teamName) {
      setTeamNameError("*팀 이름을 입력해주세요.");
      return;
    }

    const req = {
      teamName: teamName,
    };
    try {
      const response = await axios.post(`${API_SERVER}/teams/create`, req, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.status === 200) {
        alert("성공적으로 팀을 생성했습니다.");
        navigate(`/team/${response.data}`);
      } else {
        alert("팀을 생성하는 데 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      alert("에러가 발생했습니다. 다시 시도해주세요.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="create-team template d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="form_container p-5 rounded bg-white">
        <div
          className="dropbox-icon-container mb-4"
          style={{ paddingBottom: "50px" }}
        >
          <FaUsers className="dropbox-icon" size={100} />
          <h2
            className="logo-text"
            style={{
              fontSize: "40px",
              fontWeight: "bolder",
            }}
          >
            KHUropbox
          </h2>
        </div>
        <form onSubmit={handleCreateTeam}>
          <h3 className="text-center">Team Space</h3>
          <div className="mb-2">
            <label htmlFor="teamName">Team Name</label>
            <input
              type="text"
              placeholder="Enter Team Name"
              className="form-control"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            {teamNameError && (
              <div className="text-danger">{teamNameError}</div>
            )}
          </div>
          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-primary">
              Create a Team
            </button>
          </div>
          <p className="text-end mt-2">
            Want to go back?
            <Link to="/" className="ms-2">
              Home
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreateTeamPage;
