import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
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
      console.log("username:",username)

    }

    const req = {
      username: username,
      password: password
    };

    try {
      const response = await axios.post(
        "http://182.218.159.76:8080/auth/signup",
        req,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("account created successfully");
        navigate("/personal");
      } else {
        console.log(response.status)
      }
    } catch (error) {
      alert("Error occured. Please try again.");
      console.error("Error:", error)
    }
  };

  return (
    <div className='signup template d-flex justify-content-center align-items-center vh-100 bg-primary'>
      <div className='form_container p-5 rounded bg-white'>
        <form onSubmit={handleSignup}>
          <h3 className='text-center'>Sign Up</h3>
          <div className='mb-2'>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder='Create Username'
              className='form-control'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <div className='text-danger'>{usernameError}</div>}
          </div>
          <div className='mb-2'>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder='Password'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <div className='text-danger'>{passwordError}</div>}
          </div>
          <div className='d-grid mt-2'>
            <button type="submit" className='btn btn-primary'>Sign Up</button>
          </div>
          {signupError && <div className='text-danger'>{signupError}</div>}
          <p className='text-end mt-2'>
            Already have an account?<Link to='/' className='ms-2'>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
