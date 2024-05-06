import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { FaDropbox } from "react-icons/fa";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const styles = {
    navStyle: {
      backgroundColor: "#f8f9fa",
      height: "100vh",
      width: "250px",
      fontFamily: "Arial, sans-serif",
      color: "#495057",
      fontWeight: "normal",
    },
    section: {
      padding: "20px 10px",
      borderBottom: "1px solid #e1e1e1",
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
      padding: "15px 25px",
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
      marginTop: "20px",
    },
  };

  const toggleTeamSpace = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Nav className="flex-column" style={styles.navStyle}>
      <div style={styles.section}>
        <Nav.Link
          href="/"
          style={{
            ...styles.link,
            ...styles.title,
            backgroundColor: styles.navStyle.backgroundColor,
          }}
        >
          <FaDropbox style={{ marginRight: "10px" }} />{" "}
          {/* Include Dropbox icon */}
          KHUropbox
        </Nav.Link>
      </div>

      <div style={styles.section}>
        <Nav.Link
          href="/personal"
          style={{ ...styles.link, ...styles.subtitle }}
        >
          Personal Space
        </Nav.Link>
      </div>

      <div style={styles.section} onClick={toggleTeamSpace}>
        <div style={{ ...styles.link, ...styles.subtitle }}>
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
          Team Space
        </div>
        {isOpen && (
          <div style={styles.teamSpaceGap}>
            <Nav.Link
              href="/team/1"
              style={{ ...styles.link, ...styles.subItem }}
            >
              Team 1
            </Nav.Link>
            <Nav.Link
              href="/team/2"
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
