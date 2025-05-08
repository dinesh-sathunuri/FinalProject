import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/appointment/api/admin', {
        params: { startDate, endDate },
        withCredentials: true,
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch admin appointments', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert('Both dates are required');
    fetchAppointments();
  };

  return (
    <AdminLayout>
      <h2 style={{ marginBottom: '20px' }}>View Appointments</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <label style={{ fontSize: '14px' }}>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{
              marginLeft: '8px',
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
        </label>
        <label style={{ fontSize: '14px' }}>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{
              marginLeft: '8px',
              padding: '8px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4c6ef5',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#3b5bdb')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#4c6ef5')}
        >
          Fetch
        </button>
      </form>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <thead>
            <tr>
              <th style={th}>Username</th>
              <th style={th}>Date</th>
              <th style={th}>Start Time</th>
              <th style={th}>End Time</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr
                key={a.id}
                style={{ transition: 'background 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
              >
                <td style={td}>{a.user.username}</td>
                <td style={td}>{a.schedule.date}</td>
                <td style={td}>{a.schedule.startTime}</td>
                <td style={td}>{a.schedule.endTime}</td>
                <td style={td}>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}

function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleSchedules = () => navigate('/adminschedules');
  const handleHome = () => navigate('/admin-dashboard');
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/user/api/logout', {}, { withCredentials: true });
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div style={styles.dashboard}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Admin</h2>
        <button style={styles.tabButton} onClick={handleHome}>Home</button>
        <button style={styles.tabButton} onClick={handleSchedules}>Generate Schedules</button>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
      <div style={styles.main}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  dashboard: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#343a40',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    marginBottom: '40px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  tabButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#495057',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  logoutButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    marginTop: 'auto',
    fontSize: '16px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: '40px',
    backgroundColor: '#f1f3f5',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: '20px',
    borderBottomLeftRadius: '20px',
  },
};

const th = {
  padding: '14px 18px',
  backgroundColor: '#f1f3f5',
  fontWeight: '600',
  fontSize: '15px',
  textAlign: 'left',
  borderBottom: '1px solid #dee2e6',
};

const td = {
  padding: '14px 18px',
  fontSize: '14px',
  backgroundColor: 'white',
  borderBottom: '1px solid #f1f3f5',
};

export default AdminAppointments;
