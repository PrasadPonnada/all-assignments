import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isFormValid, setIsFormValid] = React.useState(true);
  const navigate = useNavigate();

  const signupHandler = async () => {
    try {
      if (email.length === 0 || password.length === 0) {
        setIsFormValid(false);
        return;
      }
      setIsFormValid(true);
      const response = await axios.post('http://localhost:3000/admin/signup', {
        username: email,
        password: password,
      });
      if (response.status === 200) {
        setEmail('');
        setPassword('');
        navigate('/login', { relative: 'path' });
      } else {
        alert('Unable to create Admin User');
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  return (
    <div>
      <h1>Register to the website</h1>
      <br />
      <div>
        <label>Email </label>
        <input type={'text'} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <br />
      <div>
        <label>Password</label>
        <input
          type={'password'}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />
      <button onClick={signupHandler}>SignUp</button>
      {!isFormValid && <label>Please fill the details</label>}
      <br />
      Already a user? <a href='/login'>Login</a>
    </div>
  );
}

export default Register;
