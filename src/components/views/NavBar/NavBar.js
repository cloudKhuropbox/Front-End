import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { FaDropbox } from "react-icons/fa";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(true);

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

  const toggleTeamSpace = () => {
    setIsOpen(!isOpen);
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
            <Nav.Link
              as={Link}
              to={"/team/1"}
              style={{ ...styles.link, ...styles.subItem }}
            >
              Team 1
            </Nav.Link>
            <Nav.Link
              as={Link}
              to={"/team/2"}
              style={{ ...styles.link, ...styles.subItem }}
            >
              Team 2
            </Nav.Link>
          </div>
        )}
      </div>
    </Nav>
  );
};

export default NavBar;
