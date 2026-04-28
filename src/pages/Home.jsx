import { Link } from "react-router-dom";
import "../styles.css";

export default function Home() {
  return (
    <div className="home-bg">
      {/* HEADER */}
      <div className="top-bar">
        🎓 <span>Feedback System</span>
      </div>

      {/* MAIN CONTENT */}
      <div className="home-content">
        <h1>Student Feedback Management System</h1>
        <p className="subtitle">
          A single platform for Students, Faculty, and Admin
        </p>

        <div className="card-container">
          {/* STUDENT */}
          <div className="role-card">
            <h3>👨‍🎓 Student</h3>
            <p>Submit feedback for faculty</p>
            <Link to="/student-login">
              <button className="btn student-btn">Login</button>
            </Link>
          </div>

          {/* FACULTY */}
          <div className="role-card">
            <h3>👨‍🏫 Faculty</h3>
            <p>View your feedback & ratings</p>
            <Link to="/faculty-login">
              <button className="btn faculty-btn">Login</button>
            </Link>
          </div>

          {/* ADMIN */}
          <div className="role-card">
            <h3>🛡️ Admin</h3>
            <p>Manage feedback & analytics</p>
            <Link to="/admin-login">
              <button className="btn admin-btn">Login</button>
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        © 2026 Student Feedback System | Developed by Malle Ganesh & Team
      </footer>
    </div>
  );
}