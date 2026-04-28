import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

export default function Home() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!identifier || !password) {
      alert("Please enter credentials");
      return;
    }

    setLoading(true);
    const trimmedId = identifier.trim().toLowerCase();
    
    try {
      if (trimmedId.includes("@")) {
        // Student Login
        const response = await axios.post('/api/auth/login', { email: identifier, password });
        const user = response.data;
        localStorage.setItem(
          'authUser',
          JSON.stringify({ name: user.name, email: user.email, course: user.course })
        );
        sessionStorage.setItem('studentLoggedIn', 'true');
        sessionStorage.setItem('studentName', user.name);
        navigate("/feedback-form");
      } else if (!isNaN(trimmedId) && trimmedId !== "") {
        // Faculty Login (faculty IDs are numeric, e.g. 101, 102)
        const response = await axios.post("/api/faculty/login", { facultyId: identifier, password });
        const faculty = response.data;
        sessionStorage.setItem("facultyLoggedIn", "true");
        sessionStorage.setItem("facultyId", faculty.facultyId);
        sessionStorage.setItem("facultyName", faculty.name);
        navigate("/faculty-dashboard");
      } else {
        // Admin Login
        await axios.post("/api/auth/admin/login", { 
          username: identifier.trim(), 
          password: password.trim() 
        });
        sessionStorage.setItem("adminLoggedIn", "true");
        navigate("/admin-dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-bg">
      <div className="top-bar">
        🎓 <span>Feedback System</span>
      </div>

      <div className="home-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <div className="card" style={{ maxWidth: "400px", width: "100%", padding: "30px", background: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>System Login</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              type="text"
              placeholder="User ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
            />
            <button 
              onClick={handleLogin} 
              disabled={loading}
              style={{
                background: "#007BFF",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                width: "100%"
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", fontSize: "13px" }}>
            <Link to="/student-login" style={{ color: "#007BFF", textDecoration: "none" }}>Student Signup</Link>
            <Link to="/faculty-login" style={{ color: "#007BFF", textDecoration: "none" }}>Faculty Signup</Link>
          </div>
        </div>
      </div>

      <footer>
        © 2026 Student Feedback System | Developed by Malle Ganesh & Team
      </footer>
    </div>
  );
}