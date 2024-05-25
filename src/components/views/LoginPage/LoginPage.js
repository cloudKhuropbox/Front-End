import React, { useState } from "react";
import "./style.css";
import { FaDropbox } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_SERVER } from "../../../config/apiConfig";
import { useSetRecoilState } from 'recoil';
import { userState } from '../../../recoil/userAtom'; 

function LoginPage() {
  // State variables for email, password, and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous error messages
    setUsernameError('');
    setPasswordError("");

    // Check if email is empty
    if (!username) {
      setUsernameError("*Username is required");
    }

    // Check if password is empty
    if (!password) {
      setPasswordError("*Password is required");
    }

    // Proceed with login logic if both email and password are provided
    if (username && password) {
      console.log("username",username);
    }

    const req = {
      username: username,
      password: password
    };

      try {
      const response = await axios.post(
        `${API_SERVER}/auth/signin`,
        req,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("로그인에 성공했습니다.");
        const { id, username, token } = response.data;
        
        localStorage.setItem('userId', id);
        localStorage.setItem('userName', username);
        localStorage.setItem('token', token);

        setUser({ userId: id, userName: username, token });

        navigate("/personal");
      } else {
        console.log(response.status)
      }
    } catch (error) {
      alert("문제가 발생했습니다. 다시 시도해주세요.");
      console.error("Error:", error)
    }
  };

  return (
    <div className="login template d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="form_container p-5 rounded bg-white">
        <div className="dropbox-icon-container">
          <FaDropbox className="dropbox-icon" size={100} />
          <h2 className="logo-text">KHUropbox</h2>
        </div>
        {error && <p className="text-danger text-center mb-3" style={{ fontSize: '1.2rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          {" "}
          {/* Added onSubmit event handler */}
          <h3 className="text-center">Login</h3>
          <div className="mb-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <p className="text-danger">{usernameError}</p>}{" "}
          </div>
          <div className="mb-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-danger">{passwordError}</p>}{" "}
          </div>
          <div className="mb-2">
            <input
              type="checkbox"
              className="custom-control custom-checbox"
              id="check"
            />
            <label htmlFor="check" className="custom-input-label ms-2">
              Remember me
            </label>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Login
            </button>{" "}
            {/* Added type="submit" */}
          </div>
          <p className="text-end mt-2">
            <a href="">Forgot Password?</a>
            <Link to="/signup" className="ms-2">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
