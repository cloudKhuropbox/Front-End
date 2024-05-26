import React, { useState } from "react";
import "./style.css";
import { FaDropbox } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_SERVER } from "../../../config/apiConfig";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");
    setSignupError("");

    if (!username) {
      setUsernameError("*Username is required");
    }

    if (!password) {
      setPasswordError("*Password is required");
    }

    if (username && password) {
      const req = { username, password };

      try {
        const response = await axios.post(`${API_SERVER}/auth/signup`, req, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          alert("회원가입에 성공했습니다.");
          navigate("/");
        }
      } catch (error) {
        alert("문제가 발생했습니다. 다시 시도해주세요.");
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="signup template d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="form_container p-5 rounded bg-white">
        <div className="dropbox-icon-container mb-4">
          <FaDropbox className="dropbox-icon" size={100} />
          <h2 className="logo-text">KHUropbox</h2>
        </div>
        <form onSubmit={handleSignup}>
          <h3 className="text-center mb-4">Sign Up</h3>
          <div className="mb-3">
            <input
              type="text"
              placeholder="닉네임"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <div className="text-danger">{usernameError}</div>
            )}
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="비밀번호"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <div className="text-danger">{passwordError}</div>
            )}
          </div>
          <p className="text-end mt-2">
            이미 계정이 존재하신가요?
            <Link to="/" className="ms-2">
              로그인
            </Link>
          </p>
          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary">
              회원가입
            </button>
          </div>
          {signupError && <div className="text-danger">{signupError}</div>}
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
