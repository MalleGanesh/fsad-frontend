import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

export default function FacultyLogin() {
  const [mode, setMode] = useState("signin");
  const [facultyId, setFacultyId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (mode !== "signin") {
      // 🆕 Fetch next available Faculty ID when switching to signup
      axios.get("/api/faculty/next-id")
        .then(res => setFacultyId(res.data.nextId))
        .catch(err => console.error("Error fetching next faculty ID", err));
      return;
    }
    setFacultyId("");
    setPassword("");
  }, [mode]);

  const handleLogin = async () => {
    if (!facultyId || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await axios.post("/api/faculty/login", { facultyId, password });
      const faculty = response.data;
      sessionStorage.setItem("facultyLoggedIn", "true");
      sessionStorage.setItem("facultyId", faculty.facultyId);
      sessionStorage.setItem("facultyName", faculty.name);
      navigate("/faculty-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Faculty login failed");
    }
  };

  const handleSignup = async () => {
    if (!name || !facultyId || !course || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/api/faculty/register", {
        name,
        facultyId,
        password,
        course,
      });
      alert(response.data?.message || "Signup successful. Waiting for admin approval.");
      setMode("signin");
      setName("");
      setConfirmPassword("");
      setPassword("");
    } catch (error) {
      alert(error.response?.data?.message || "Faculty signup failed");
    }
  };

  return (
    <div className="login-bg">
      <div className="card">
        <h2>👨‍🏫 Faculty {mode === "signin" ? "Login" : "Sign Up"}</h2>

        {mode === "signup" && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Course Teaching"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
          </>
        )}

        <input
          type="text"
          placeholder="Unique Faculty ID (e.g. 101)"
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
          readOnly={mode === "signup"}
          style={mode === "signup" ? { backgroundColor: "#f0f0f0", cursor: "not-allowed" } : {}}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === "signup" && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button onClick={mode === "signin" ? handleLogin : handleSignup}>
          {mode === "signin" ? "Login" : "Sign Up"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          style={{ marginTop: "10px" }}
        >
          {mode === "signin" ? "New Faculty? Sign Up" : "Already registered? Sign In"}
        </button>
      </div>
    </div>
  );
}