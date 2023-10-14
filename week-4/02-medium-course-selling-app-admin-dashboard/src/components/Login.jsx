import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isFormValid, setIsFormValid] = React.useState(true);
  const navigate = useNavigate();

  const loginHandler = async () => {
    try {
      if (email.length === 0 || password.length === 0) {
        setIsFormValid(false);
        return;
      }
      const response = await axios.post(
        'http://localhost:3000/admin/login',
        null,
        {
          headers: {
            username: email,
            password: password,
          },
        }
      );
      localStorage.setItem('token', response.data.token);
      navigate('/about', { relative: 'path' });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Login to admin dashboard</h1>
      <br />
      Email - <input type={'text'} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <br />
      Password -{' '}
      <input type={'password'} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={loginHandler}>Login</button>
      <br />
      New here? <a href='/register'>Register</a>
    </div>
  );
}

export default Login;
