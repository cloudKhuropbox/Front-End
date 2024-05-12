import React, { useState } from "react";
import { Container, Navbar, Form, FormControl } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
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
        <Link
          to={isLoggedIn ? "/" : "/"}
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
          {isLoggedIn ? (
            <>
              <FaSignOutAlt style={{ marginRight: "5px", fontSize: "16px" }} />
              로그아웃
            </>
          ) : (
            <>
              <FaSignInAlt style={{ marginRight: "5px", fontSize: "16px" }} />
              로그인 / 회원가입
            </>
          )}
        </Link>
      </Container>
    </Navbar>
  );
};

export default Header;
