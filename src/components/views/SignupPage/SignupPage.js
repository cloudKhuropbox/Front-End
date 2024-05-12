import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignupPage() {
  // State variables for username, email, password, and error messages
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Function to handle form submission
  const handleSignup = (e) => {
    e.preventDefault();

    // Reset previous error messages
    setUsernameError("");
    setEmailError("");
    setPasswordError("");

    // Check if username is empty
    if (!username) {
      setUsernameError("*Username is required");
    }

    // Check if email is empty
    if (!email) {
      setEmailError("*Email is required");
    }

    // Check if password is empty
    if (!password) {
      setPasswordError("*Password is required");
    }

    // Proceed with signup logic if all fields are provided
    if (username && email && password) {
      // Your signup logic here
      console.log("username ", username);
      console.log("email ", email);
      console.log("password ", password);
      console.log("Signed up successfully");
    }
  };

  return (
    <div className="signup template d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSignup}>
          {" "}
          {/* Added onSubmit event handler */}
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
            {/* Display username error message */}
          </div>
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
          <div className="d-grid mt-2">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>{" "}
            {/* Added type="submit" */}
          </div>
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
