import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'verify'
  const [code, setCode] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 'verify' && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    } else if (step === 'verify' && timeLeft === 0) {
      clearInterval(timer);
      navigate('/login');
    }
  }, [step, timeLeft]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setServerMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/user/api/forgot-password',
        { email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setServerMessage('A 7-digit verification code has been sent to your email.');
        setStep('verify');
        setTimeLeft(30);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Email not found.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerify = async (e) => {
    e.preventDefault();
    setError('');
    setServerMessage('');

    try {
      const res = await axios.post(
        'http://localhost:8080/user/api/verify-code',
        { email, code },
        { withCredentials: true }
      );

      if (res.status === 200) {
        clearInterval(timer);
        setServerMessage('Code verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      alert('Please type correct code.',error);
      clearInterval(timer);
      setTimeLeft(5);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Forgot Password</h2>

      {step === 'request' && (
        <form onSubmit={handleEmailSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          {error && <div style={styles.error}>{error}</div>}
          {serverMessage && <div style={styles.success}>{serverMessage}</div>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send Code & Recover Password'}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={handleCodeVerify} style={styles.form}>
          <input
            type="text"
            placeholder="Enter 7-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={7}
            pattern="\d{7}"
            style={styles.input}
          />
          <div>⏳ Time remaining: {timeLeft} seconds</div>
          {error && <div style={styles.error}>{error}</div>}
          {serverMessage && <div style={styles.success}>{serverMessage}</div>}
          <button type="submit" style={styles.button}>
            Verify Code
          </button>
        </form>
      )}
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
    backgroundColor: '#3498db',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
  success: {
    color: 'green',
    fontSize: '14px',
  },
};

export default ForgotPassword;
