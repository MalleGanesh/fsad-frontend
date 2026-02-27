import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function FacultyLogin() {
  const [facultyId, setFacultyId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Faculty list with short names
  const facultyList = [
    { id: "saxena", name: "Dr. R. Saxena" },
    { id: "hari", name: "Dr. Hari Pothuluru" },
    { id: "maneesha", name: "Dr. Maneesha Vadduri" },
    { id: "rajesh", name: "Dr. Nichenametla Rajesh" },
    { id: "srinivas", name: "Dr. K. Srinivas" }
  ];
  

  const DEFAULT_PASSWORD = "faculty@123";

  const handleLogin = () => {
    if (!facultyId || !password) {
      alert("All fields are required");
      return;
    }

    // Check default password
    if (password !== DEFAULT_PASSWORD) {
      alert("Incorrect password");
      return;
    }

    // Valid faculty login
    sessionStorage.setItem("facultyLoggedIn", "true");
    sessionStorage.setItem("facultyId", facultyId);

    const faculty = facultyList.find(f => f.id === facultyId);
    sessionStorage.setItem("facultyName", faculty.name);

    navigate("/faculty-dashboard");
  };

  return (
    <div className="login-bg">
      <div className="card">
        <h2>👨‍🏫 Faculty Login</h2>

        <select
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
        >
          <option value="">-- Select Faculty --</option>
          {facultyList.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

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