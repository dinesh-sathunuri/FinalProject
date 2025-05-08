import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

function CustomerDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/schedule/api/available', {
          withCredentials: true,
        });
        setAvailableTimes(response.data);
      } catch (error) {
        console.error('Error fetching available times', error);
      }
    };

    fetchAvailableTimes();
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

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      alert("Please select a time slot.");
      return;
    }
    const appointmentPayload = {
      id: selectedSlot.id,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      available: selectedSlot.available
    };
    try {
      await axios.post(
        'http://localhost:8080/appointment/api/book',
        appointmentPayload,
        { withCredentials: true }
      );
      alert('Appointment booked successfully!');
      navigate('/appointments');
    } catch (error) {
      console.error('Failed to book appointment', error);
      alert('Failed to book appointment.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: '30px' }}>Dashboard</h2>
        <div style={styles.tabList}>
          <button style={styles.tabButton} onClick={() => navigate('/appointments')}>My Appointments</button>
          <button style={styles.tabButton} onClick={()=> navigate('/profile')}>Profile</button>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.rightContent}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Book New Appointment</h2>

          <div style={styles.cardContent}>
            <div style={styles.calendarContainer}>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                minDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)}
                maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0)}
              />
              <p style={styles.dateText}>Selected Date: {selectedDate.toDateString()}</p>
            </div>

            <div style={styles.formSection}>
              <label style={{ fontWeight: 'bold' }}>Available Time:</label>
              <select
                value={selectedSlot?.id || ''}
                onChange={(e) =>
                  setSelectedSlot(
                    availableTimes.find((slot) => slot.id.toString() === e.target.value)
                  )
                }
                style={styles.select}
              >
                <option value="">-- Select a time slot --</option>
                {availableTimes.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.startTime} - {slot.endTime}
                  </option>
                ))}
              </select>

              <button onClick={handleBookAppointment} style={styles.bookButton}>
                Book Appointment
              </button>
            </div>
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
    width: '800px',
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
  cardContent: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  calendarContainer: {
    flex: '1 1 300px',
  },
  dateText: {
    textAlign: 'center',
    fontSize: '16px',
    marginTop: '10px',
    color: '#333',
  },
  formSection: {
    flex: '1 1 200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
  },
  bookButton: {
    padding: '14px',
    backgroundColor: '#27ae60',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default CustomerDashboard;
