import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignInRequest, SignInResponse } from './Model';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    const request: SignInRequest = { username, password };
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    // Todo: Create a type for the response that you get back from the server
    const data: SignInResponse = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      navigate('/todos', { relative: 'route' });
    } else {
      alert('invalid credentials');
    }
  };

  return (
    <div style={{ justifyContent: 'center', display: 'flex', width: '100%' }}>
      <div>
        <h2>Login</h2>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Username'
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
        />
        New here? <Link to='/signup'>Signup</Link>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
