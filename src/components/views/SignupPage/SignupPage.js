import React, { useState } from "react";
import { FaDropbox } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { API_SERVER } from "../../../config/apiConfig";

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault();

    setUsernameError('');
    setPasswordError('');
    setSignupError('');

    if (!username) {
      setUsernameError('*Username is required');
    }

    if (!password) {
      setPasswordError('*Password is required');
    }

    if (username && password) {
      console.log("username",username);
    }

    const req = {
      username: username,
      password: password
    };


    try {
      const response = await axios.post(
        `${API_SERVER}/auth/signup`,
        req,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("회원가입에 성공했습니다.");
        navigate("/");
      } else {
        console.log(response.status)
      }
    } catch (error) {
      alert("문제가 발생했습니다. 다시 시도해주세요.");
      console.error("Error:", error)
    }
  };

  return (
    <div className="signup template d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="form_container p-5 rounded bg-white">
        <div className="dropbox-icon-container mb-4">
          <FaDropbox className="dropbox-icon" size={100} />
          <h2
            className="logo-text"
            style={{ fontSize: "40px", fontWeight: "bolder" }}
          >
            KHUropbox
          </h2>
        </div>
        <form onSubmit={handleSignup}>
          {" "}
          <h3 className="text-center">Sign Up</h3>
          <div className="mb-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Create Username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <div className="text-danger">{usernameError}</div>
            )}{" "}
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
            {passwordError && (
              <div className="text-danger">{passwordError}</div>
            )}{" "}
          </div>
          <div className="d-grid mt-2">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>{" "}
          </div>
          {signupError && <div className='text-danger'>{signupError}</div>}
          <p className="text-end mt-2">
            Already have an account?
            <Link to="/" className="ms-2">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
