import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function FacultyLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      alert("All fields are required");
      return;
    }

    // ✅ MOCK LOGIN (Frontend-only)
    sessionStorage.setItem("facultyLoggedIn", "true");
    sessionStorage.setItem("facultyName", username);

    navigate("/faculty-dashboard");
  };

  return (
    <div className="login-bg">
      <div className="card">
        <h2>👨‍🏫 Faculty Login</h2>

        <input
          type="text"
          placeholder="Faculty Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}