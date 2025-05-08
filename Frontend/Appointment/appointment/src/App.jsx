import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Schedule from './pages/Schedules';
import Appointments from './pages/UserAppointments';
import AllAppointments from './pages/AdminAppointments';
import UserProfile from './pages/UserProfile';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/adminschedules" element={<Schedule />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/adminappointments" element={<AllAppointments />} />
        <Route path="/profile" element={<UserProfile />} />  
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/appointments" element={<Appointments />} /> */}
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
