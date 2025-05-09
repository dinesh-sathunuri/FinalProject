import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAppointments();
  }, []);

  const fetchUserAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/appointment/api/my', {
        withCredentials: true,
      });
      console.log('User appointments:', response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  };

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
          <button style={styles.tabButton} onClick={()=> navigate('/profile')}>Profile</button>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.main}>
        <h2 style={styles.heading}>My Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td style={styles.td}>{appt.schedule.date}</td>
                  <td style={styles.td}>
                    {appt.schedule.startTime} - {appt.schedule.endTime}
                  </td>
                  <td style={styles.td}>{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
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
  main: {
    flex: 1,
    padding: '40px',
    overflowY: 'auto',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#2c3e50',
    color: 'white',
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    color: '#333',
  },
};

export default UserAppointments;