import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import "../styles/Form.css";

const login = () => {
  window.location.href = "/login";
};


function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [credits, setCredits] = useState(100); // Default credits value
  const [plate_number, setPlateNumber] = useState(""); // New field for plate number
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post("/api/user/register/", {
        username,
        password,
        first_name,
        email,
        credits,
        plate_number
      });
      navigate("/login");
    } catch (error) {
      alert(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Register</h1>
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          className="form-input"
          type="text"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
        />
        <input
          className="form-input"
          type="number"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          placeholder="Credits (Default: 100)"
        />
        <input
          className="form-input"
          type="text"
          value={plate_number}
          onChange={(e) => setPlateNumber(e.target.value)}
          placeholder="License Plate Number (Optional)"
        />
        <button className="form-button" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <button className="register-btn" onClick={login}>
        Login
      </button>
      
    </div>
  );
}

export default Register;
