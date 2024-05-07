import React, { useState } from "react";
import { Container, Navbar, Form, FormControl, Button } from "react-bootstrap";
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  const isLoggedIn = false;
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter") {
      console.log(searchTerm);
      event.preventDefault();
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
        {/* <Link to="/signup" className="btn btn-outline-dark me-2">
          <FaUserPlus /> Signup
        </Link> */}
        <Link to={isLoggedIn ? "/" : "/login"} className="btn btn-outline-dark">
          {isLoggedIn ? (
            <>
              <FaSignOutAlt style={{ marginRight: "5px" }} />
              Logout
            </>
          ) : (
            <>
              <FaSignInAlt style={{ marginRight: "5px" }} />
              Signup / Login
            </>
          )}
        </Link>
      </Container>
    </Navbar>
  );
};

export default Header;
