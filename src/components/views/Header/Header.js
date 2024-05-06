import React, { useState } from "react";
import { Container, Navbar, Form, FormControl, Button } from "react-bootstrap";
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom"; // 리액트 라우터의 Link 컴포넌트를 불러옵니다.

const Header = () => {
  const isLoggedIn = true; // 예시로 항상 로그인되지 않은 상태를 가정합니다.
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter") {
      console.log(searchTerm);
    }
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Form className="d-flex flex-grow-1 mx-2">
          <FormControl
            type="search"
            placeholder="Search"
            className="me-2"
            style={{ width: "100%" }}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
          />
        </Form>
        <Link to="/create-team" className="btn btn-outline-dark me-2">
          <FaUsers /> Create a Team
        </Link>
        <Link to="/signup" className="btn btn-outline-dark me-2">
          <FaUserPlus /> Signup
        </Link>
        <Link to={isLoggedIn ? "/" : "/login"} className="btn btn-outline-dark">
          {isLoggedIn ? (
            <>
              <FaSignOutAlt style={{ marginRight: "5px" }} />
              Logout
            </>
          ) : (
            <>
              <FaSignInAlt style={{ marginRight: "5px" }} />
              Login
            </>
          )}
        </Link>
      </Container>
    </Navbar>
  );
};

export default Header;
