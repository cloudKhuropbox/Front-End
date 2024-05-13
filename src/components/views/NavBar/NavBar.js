import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { FaDropbox } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      const userName = localStorage.getItem("userName");
      const token = localStorage.getItem("token");

      if (!userName || !token) {
        setError("User not authenticated.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/teams/list/${userName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setTeams(response.data);
        } else {
          alert(
            "팀 스페이스 목록을 불러오는 데 실패했습니다. 다시 시도해주세요."
          );
        }
      } catch (error) {
        alert("에러가 발생했습니다. 다시 시도해주세요.");
        console.error("Error:", error);
      }
    };

    fetchTeams();
  }, []);

  const toggleTeamSpace = () => {
    setIsOpen(!isOpen);
  };

  const handleTeamLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Nav className="flex-column" style={styles.navStyle}>
      <div style={styles.section}>
        <Nav.Link
          as={Link}
          to={"/personal"}
          style={{
            ...styles.link,
            ...styles.title,
            backgroundColor: styles.navStyle.backgroundColor,
          }}
        >
          <FaDropbox style={{ marginRight: "10px" }} /> KHUropbox
        </Nav.Link>
      </div>

      <div style={styles.section}>
        <Nav.Link
          as={Link}
          to={"/personal"}
          style={{ ...styles.link, ...styles.subtitle }}
        >
          Personal Space
        </Nav.Link>
      </div>

      <div style={styles.section} onClick={toggleTeamSpace}>
        <div style={{ ...styles.link, ...styles.subtitle, marginLeft: "15px" }}>
          Team Space
          <svg
            viewBox="0 0 24 24"
            fill="none"
            style={{ ...styles.icon, ...(isOpen ? styles.iconOpen : {}) }}
            width="16"
            height="16"
          >
            <path
              d="m5.25 14.75 6.5-6.25 6.5 6.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              vectorEffect="non-scaling-stroke"
            ></path>
          </svg>
        </div>
        {isOpen && (
          <div style={styles.teamSpaceGap}>
            {teams.length > 0 ? (
              teams.map((team) => (
                <Nav.Link
                  key={team.teamId}
                  as={Link}
                  to={`/team/${team.teamId}`}
                  style={{ ...styles.link, ...styles.subItem }}
                  onClick={handleTeamLinkClick}
                >
                  {team.teamName}
                </Nav.Link>
              ))
            ) : (
              <div style={{ padding: "10px 25px", fontSize: "15px" }}>
                {error ? error : "No Teamspace Available"}
              </div>
            )}
          </div>
        )}
      </div>
    </Nav>
  );
};

const styles = {
  navStyle: {
    backgroundColor: "#f7f5f2",
    height: "100vh",
    width: "250px",
    fontFamily: "Arial, sans-serif",
    color: "#495057",
    fontWeight: "normal",
    border: "1px solid #e1e1e1",
  },
  section: {
    padding: "15px 10px",
  },
  link: {
    color: "#495057",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "flex-start",
  },
  title: {
    fontWeight: "bolder",
    alignItems: "center",
    fontSize: "20px",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  subItem: {
    padding: "10px 25px",
    fontSize: "15px",
  },
  icon: {
    marginRight: "10px",
    transform: "rotate(0deg)",
    transition: "transform 0.3s ease",
  },
  iconOpen: {
    transform: "rotate(180deg)",
  },
  teamSpaceGap: {
    marginTop: "10px",
  },
};

export default NavBar;
