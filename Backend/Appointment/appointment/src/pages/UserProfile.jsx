import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserProfile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/api/profile', {
          withCredentials: true,
        });
        setUser(response.data);
        console.log('User profile data:', response.data);
      } catch (error) {
        console.error('Error fetching user profile', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/user/api/logout', {}, { withCredentials: true });
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: '30px' }}>Dashboard</h2>
        <div style={styles.tabList}>
          <button style={styles.tabButton} onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button style={styles.tabButton} onClick={() => navigate('/appointments')}>My Appointments</button>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.rightContent}>
        <div style={styles.card}>
          <h2 style={styles.heading}>User Profile</h2>
          <div style={styles.profileInfo}>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f6fa',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  tabList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  tabButton: {
    backgroundColor: '#34495e',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    border: 'none',
    padding: '12px',
    borderRadius: '6px',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    alignSelf: 'center',
    width: '100%',
    marginTop: 'auto',
  },
  rightContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  card: {
    width: '600px',
    padding: '30px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    borderRadius: '20px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '22px',
    color: '#2c3e50',
  },
  profileInfo: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#333',
  },
};

export default UserProfile;
