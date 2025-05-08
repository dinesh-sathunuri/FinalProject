import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error when user types

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const userPayload = {
      username: formData.username,
      email: formData.email,
      passwordHash: formData.password
    };
    console.log("Form Data to be sent to the backend:", JSON.stringify(userPayload));
    try {
      const response = await axios.post("http://localhost:8080/user/api/register", userPayload);
      alert("Registration successful!");
      console.log(response.data); // Handle successful registration
    window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("An error occurred while registering.");
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = "Weak";
    const lengthCriteria = password.length >= 8;
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const uppercaseCriteria = /[A-Z]/.test(password);

    if (lengthCriteria && numberCriteria && specialCharCriteria && uppercaseCriteria) {
      strength = "Strong";
    } else if (lengthCriteria && (numberCriteria || specialCharCriteria)) {
      strength = "Medium";
    }

    return strength;
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          {formData.password && (
            <p style={styles.passwordStrength}>Password Strength: {passwordStrength}</p>
          )}
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {error && <p style={styles.errorMessage}>{error}</p>}
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>

      <div style={styles.links}>
        <Link to="/login" style={styles.link}>
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0",
    padding: "80px 100px 80px 100px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "auto",
    backgroundColor: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
  },
  passwordStrength: {
    fontSize: "14px",
    color: "#888",
  },
  links: {
    marginTop: "15px",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
};

export default Register;