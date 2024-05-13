import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

function CreateTeamPage() {
  // State variable for teamName and error messages
  const [teamName, setTeamName] = useState("");
  const [teamNameError, setTeamNameError] = useState("");

  // Function to handle form submission
  const handleCreateTeam = (e) => {
    e.preventDefault();

    // Reset previous error messages
    setTeamNameError("");

    // Check if teamName is empty
    if (!teamName) {
      setTeamNameError("*Team name is required");
    }

    // Proceed with create team logic if team name is provided
    if (teamName) {
      // Your create team logic here
      console.log("teamName ", teamName);
      console.log("Team created successfully");
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
          {" "}
          <h3 className="text-center">Team Space</h3>
          <div className="mb-2">
            {" "}
            {/* Adjusted class for consistent margin */}
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
            {" "}
            {/* Adjusted class for consistent margin */}
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
