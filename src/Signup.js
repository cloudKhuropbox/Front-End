import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = "http://localhost:8080";

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
      setIsLoading(true);

      try {
        const response = await axios.post(`${baseUrl}/auth/signup`, {
          username,
          password,
        });
  
        if (response.status === 201) {
          alert(` You have created: ${JSON.stringify(response.data)}`);
          setIsLoading(false);
          setUsername("");
          setPassword("");
        } else {
          throw new Error("An error has occurred");
        }
      } catch (error) {
        alert("An error has occurred");
        setIsLoading(false);
      }
    };
    }

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
