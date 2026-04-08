import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const adminLogin = async () => {
    try {
      await axios.post("/api/auth/admin/login", { 
        username: username.trim(), 
        password: password.trim() 
      });
      sessionStorage.setItem("adminLoggedIn", "true");
      navigate("/admin-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid Admin Credentials");
    }
  };

  return (
    <div className="admin-login-bg">
      <div className="login-box">
        <h2>🛡️ Admin Login</h2>

        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={adminLogin}>Login</button>

        <div className="back">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}