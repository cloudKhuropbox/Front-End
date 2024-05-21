import React, { useState, useEffect } from "react";
import { Container, Navbar, Form, FormControl } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/");
    }
  }, [navigate]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter") {
      console.log(searchTerm);
      event.preventDefault();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <Navbar style={{ padding: "20px" }}>
      <Container fluid>
        <Form className="d-flex flex-grow-1 mx-2">
          <FormControl
            type="search"
            placeholder="Search"
            className="me-2"
            style={{ width: "80%" }}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
          />
        </Form>
        <Link
          to="/create-team"
          className="btn me-2"
          style={{
            backgroundColor: "#f7f5f2",
            color: "black",
            fontWeight: "normal",
            fontSize: "12px",
            padding: "6px 10px",
            border: "none",
          }}
        >
          <FaUserPlus style={{ marginRight: "5px", fontSize: "16px" }} /> 팀
          생성
        </Link>
        {isLoggedIn ? (
          <button
            className="btn"
            onClick={handleLogout}
            style={{
              backgroundColor: "#f7f5f2",
              color: "black",
              fontWeight: "normal",
              fontSize: "12px",
              padding: "6px 10px",
              border: "none",
            }}
          >
            <FaSignOutAlt style={{ marginRight: "5px", fontSize: "16px" }} />
            로그아웃
          </button>
        ) : (
          <Link
            to="/login"
            className="btn"
            style={{
              backgroundColor: "#f7f5f2",
              color: "black",
              fontWeight: "normal",
              fontSize: "12px",
              padding: "6px 10px",
              border: "none",
            }}
          >
            <FaSignInAlt style={{ marginRight: "5px", fontSize: "16px" }} />
            로그인 / 회원가입
          </Link>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
