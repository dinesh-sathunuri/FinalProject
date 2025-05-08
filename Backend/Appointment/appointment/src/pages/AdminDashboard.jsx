import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [schedules, setSchedules] = useState([]);
  const [daySchedules, setDaySchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:8080/schedule/api/all', { withCredentials: true });
      setSchedules(response.data);

      const todayIso = new Date().toISOString().split('T')[0];
      const todaySchedules = response.data.filter(s => s.date === todayIso);
      setDaySchedules(todaySchedules);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const handleSchedules = () => {
    navigate('/adminschedules');
  };

  const handleAppointments = () => {
    navigate('/adminappointments');
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/user/api/logout', {}, { withCredentials: true });
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const isoDate = date.toISOString().split('T')[0];
    const filteredSchedules = schedules.filter(s => s.date === isoDate);
    setDaySchedules(filteredSchedules);
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Admin</h2>
        <button style={styles.tabButton} onClick={handleSchedules}>Generate Schedules</button>
        <button style={styles.tabButton} onClick={handleAppointments}>All Appointments</button>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h2 style={styles.heading}>Calendar Overview</h2>

        <div style={styles.contentWrapper}>
          <div style={styles.calendarWrapper}>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
            />
          </div>

          <div style={styles.appointmentList}>
            <h3>Available Slots on {selectedDate.toDateString()}</h3>
            {daySchedules.length > 0 ? (
              daySchedules.map(slot => (
                <div key={slot.id} style={styles.appointmentItem}>
                  {slot.startTime} - {slot.endTime} ({slot.available ? 'Available' : 'Booked'})
                </div>
              ))
            ) : (
              <p>No slots available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboard: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f1f3f5',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#343a40',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    marginBottom: '40px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  tabButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#495057',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    marginBottom: '15px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  tabButtonHover: {
    backgroundColor: '#28a745',
  },
  logoutButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    marginTop: 'auto',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  logoutButtonHover: {
    backgroundColor: '#c82333',
  },
  main: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    boxShadow: 'inset 0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    margin: '10px',
  },
  heading: {
    color: '#343a40',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600',
  },
  contentWrapper: {
    display: 'flex',
    gap: '20px', // Reduced the gap to fit content better
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calendarWrapper: {
    flex: '1 1 350px', // Adjusted width for better balance
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  },
  appointmentList: {
    flex: '3 1 0', // Take up maximum space available
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    maxHeight: '500px',
    overflowY: 'auto',
    transition: 'transform 0.3s ease-in-out',
    marginBottom: '20px',
  },
  appointmentItem: {
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    backgroundColor: '#e2e3e5',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease-in-out',
  },
  appointmentItemHover: {
    transform: 'scale(1.05)',
    backgroundColor: '#f8f9fa',
  },
  calendarTile: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px',
    marginTop: '2px',
    borderRadius: '8px',
  },
};


export default AdminDashboard;
