import React, { useState } from "react";
import "./style.css";
import { FaDropbox } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_SERVER } from "../../../config/apiConfig";
import { useSetRecoilState } from "recoil";
import { isLoggedInState } from "../../../recoil/userAtom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setIsLoggedInState = useSetRecoilState(isLoggedInState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");

    if (!username) {
      setUsernameError("*Username is required");
    }

    if (!password) {
      setPasswordError("*Password is required");
    }

    if (username && password) {
      const req = { username, password };

      try {
        const response = await axios.post(`${API_SERVER}/auth/signin`, req, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          alert("로그인에 성공했습니다.");
          const { id, username, token } = response.data;

          localStorage.setItem("userId", id);
          localStorage.setItem("userName", username);
          localStorage.setItem("token", token);
          
          setIsLoggedInState(true);

          navigate("/personal");
        }
      } catch (error) {
        alert("문제가 발생했습니다. 다시 시도해주세요.");
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="login template d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="form_container p-5 rounded bg-white">
        <div className="dropbox-icon-container mb-4">
          <FaDropbox className="dropbox-icon" size={100} />
          <h2 className="logo-text">KHUropbox</h2>
        </div>
        {error && (
          <p
            className="text-danger text-center mb-3"
            style={{ fontSize: "1.2rem" }}
          >
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <h3 className="text-center mb-4">Login</h3>
          <div className="mb-3">
            <input
              type="text"
              placeholder="닉네임"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <p className="text-danger">{usernameError}</p>}
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="비밀번호"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-danger">{passwordError}</p>}
          </div>
          <p className="text-end mt-2">
            아직 회원이 아니신가요?
            <Link to="/signup" className="ms-2">
              회원가입
            </Link>
          </p>
          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary">
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
