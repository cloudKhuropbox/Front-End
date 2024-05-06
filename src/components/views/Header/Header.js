import React, { useState } from "react";
import { Container, Navbar, Form, FormControl, Button } from "react-bootstrap";
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUsers } from "react-icons/fa"; // 필요한 아이콘들을 불러옵니다.

const Header = () => {
  const isLoggedIn = false; // 예시로 항상 로그인된 상태를 가정합니다.
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
        <Button variant="outline-dark" className="me-2">
          <FaUsers /> Create a Team
        </Button>
        <Button variant="outline-dark" className="me-2">
          <FaUserPlus /> Signup
        </Button>
        <Button variant="outline-dark">
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
        </Button>
      </Container>
    </Navbar>
  );
};

export default Header;
