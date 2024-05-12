import React, { useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";

function LoginPage() {
  // State variables for email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Function to handle form submission
  const handleLogin = (e) => {
    e.preventDefault();

    // Reset previous error messages
    setEmailError("");
    setPasswordError("");

    // Check if email is empty
    if (!email) {
      setEmailError("*Email is required");
    }

    // Check if password is empty
    if (!password) {
      setPasswordError("*Password is required");
    }

    // Proceed with login logic if both email and password are provided
    if (email && password) {
      console.log("email", email);
      console.log("password", password);
    }
  };

  return (
    <div className="login template d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleLogin}>
          {" "}
          {/* Added onSubmit event handler */}
          <h3 className="text-center">Login</h3>
          <div className="mb-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="text-danger">{emailError}</div>}{" "}
            {/* Display email error message */}
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
            {/* Display password error message */}
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
