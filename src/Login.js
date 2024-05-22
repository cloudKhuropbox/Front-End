import React, { useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUsernameError('');
    setPasswordError('');

    if (!username) {
      setUsernameError('*Username is required');
    }

    if (!password) {
      setPasswordError('*Password is required');
    }

    if (username && password) {
      console.log({username, password});
    axios.post(
      "http://localhost:8080/auth/signin",
      {
          "username": "admin",
          "password": "1234"
      },
      {
          headers: {
              'Content-type': 'application/json',
              'Accept': '*/*'
          }
      }).then(res => {
          console.log(res.data);
          alert("Successfully Login")
      }).catch(err => {
          console.log(err);
          alert("Cannot Login")
      });
    }
  }

  return (
    <div className='login template d-flex justify-content-center align-items-center vh-100 bg-primary'>
      <div className='form_container p-5 rounded bg-white'>
        {error && <p className="text-danger text-center mb-3" style={{ fontSize: '1.2rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <h3 className='text-center'>Login</h3>
          <div className='mb-2'>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder='Username'
              className='form-control'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <p className="text-danger">{usernameError}</p>}
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
            {passwordError && <p className="text-danger">{passwordError}</p>}
          </div>
          <div className='mb-2'>
            <input type="checkbox" className='custom-control custom-checbox' id="check"/>
            <label htmlFor="check" className='custom-input-label ms-2'>
              Remember me
            </label>
          </div>
          <div className='d-grid'>
            <button type="submit" className='btn btn-primary'>Login</button>
          </div>
          <p className='text-end mt-2'>
            <a href=''>Forgot Password?</a><Link to='/signup' className='ms-2'>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
