import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Schedule() {
  const [mode, setMode] = useState('range');
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('15');
  const [singleDate, setSingleDate] = useState('');
  const [slots, setSlots] = useState([{ startTime: '', endTime: '' }]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/user/api/logout', {}, { withCredentials: true });
      localStorage.removeItem('userEmail');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddSlot = () => {
    setSlots([...slots, { startTime: '', endTime: '' }]);
  };

  const handleRemoveSlot = (index) => {
    const updatedSlots = slots.filter((_, i) => i !== index);
    setSlots(updatedSlots);
  };

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index][field] = value;
    setSlots(updatedSlots);
  };

  const handleGenerate = async () => {
    try {
      if (mode === 'range') {
        await axios.post('http://localhost:8080/schedule/api/generate-range', {
          startDate: rangeStart,
          endDate: rangeEnd,
          startTime,
          endTime,
          duration: parseInt(duration),
        }, { withCredentials: true });
        alert('Schedules generated for range!');
      } else {
        const validSlots = slots.filter(slot => slot.startTime && slot.endTime);
        if (validSlots.length === 0) {
          alert('Please enter at least one valid time slot.');
          return;
        }
        await axios.post('http://localhost:8080/schedule/api/generate-single', {
          date: singleDate,
          slots: validSlots,
        }, { withCredentials: true });
        alert('Schedules generated for single day!');
      }
    } catch (error) {
      console.error('Failed to generate schedules:', error);
      alert('Failed to generate schedules.');
    }
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Admin</h2>
        <button style={styles.tabButton} onClick={() => navigate('/admin-dashboard')}>Home</button>
        <button style={styles.tabButton} onClick={() => navigate('/adminappointments')}>All Appointments</button>
        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h2 style={styles.heading}>Generate Schedules</h2>

        {/* Mode Switch */}
        <div style={styles.modeSwitch}>
          <button
            style={mode === 'range' ? styles.activeButton : styles.inactiveButton}
            onClick={() => setMode('range')}
          >
            Date Range (Same Timing)
          </button>
          <button
            style={mode === 'single' ? styles.activeButton : styles.inactiveButton}
            onClick={() => setMode('single')}
          >
            Single Date (Different Timings)
          </button>
        </div>

        {/* Forms based on mode */}
        {mode === 'range' ? (
          <div style={styles.form}>
            <label>Start Date:</label>
            <input type="date" value={rangeStart} onChange={e => setRangeStart(e.target.value)} />

            <label>End Date:</label>
            <input type="date" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} />

            <label>Start Time:</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />

            <label>End Time:</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />

            <label>Duration:</label>
            <select value={duration} onChange={e => setDuration(e.target.value)}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
        ) : (
          <div style={styles.form}>
            <label>Date:</label>
            <input type="date" value={singleDate} onChange={e => setSingleDate(e.target.value)} />

            <label>Slots:</label>
            {slots.map((slot, index) => (
              <div key={index} style={styles.slotRow}>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={e => handleSlotChange(index, 'startTime', e.target.value)}
                  placeholder="Start Time"
                />
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={e => handleSlotChange(index, 'endTime', e.target.value)}
                  placeholder="End Time"
                />
                {slots.length > 1 && (
                  <button
                    onClick={() => handleRemoveSlot(index)}
                    style={styles.removeSlotButton}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button style={styles.addSlotButton} onClick={handleAddSlot}>Add Slot</button>
          </div>
        )}

        <button style={styles.generateButton} onClick={handleGenerate}>Generate</button>
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
    backgroundColor: '#f8f9fa',
    overflowY: 'auto',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
    color: '#343a40',
  },
  modeSwitch: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '10px',
  },
  activeButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  inactiveButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  slotRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  addSlotButton: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  removeSlotButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  generateButton: {
    marginTop: '30px',
    padding: '12px 24px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

export default Schedule;
