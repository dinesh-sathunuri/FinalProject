import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation instead of window.location.href

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/user/api/login',
        { email:email, passwordHash:password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        localStorage.setItem('userEmail', email); 
        if (email.endsWith('@nyu.edu')) {
          navigate('/admin-dashboard'); 
        } else {
          navigate('/dashboard'); 
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button type="submit" style={styles.button}>Login</button>
      </form>

      <div style={styles.links}>
        <Link to="/forgot-password" style={styles.link}>Forgot Password?</Link>
        <span> | </span>
        <Link to="/register" style={styles.link}>Create Account</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '450px',
    margin: '0',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  links: {
    marginTop: '15px',
    fontSize: '14px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
};

export default Login;
