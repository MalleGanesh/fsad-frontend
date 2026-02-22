import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function FacultyDashboard() {
  const navigate = useNavigate();

  const [facultyName, setFacultyName] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  // Initialize data when component mounts
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("facultyLoggedIn");
    const faculty = sessionStorage.getItem("facultyName");

    if (loggedIn !== "true" || !faculty) {
      alert("Please login as Faculty");
      navigate("/faculty-login");
      return;
    }

    // Compute all values first
    let newFeedbackList = [];
    let newAvgRating = 0;

    const stored = localStorage.getItem("latestFeedback");
    if (stored) {
      const feedback = JSON.parse(stored);

      // Show feedback only for this faculty
      if (feedback.facultyName === faculty) {
        const ratings = [feedback.q1, feedback.q2, feedback.q3, feedback.q4, feedback.q5];
        newAvgRating = (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2);
        newFeedbackList = [feedback];
      }
    }

    // Set all state at once
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFacultyName(faculty);
    setFeedbackList(newFeedbackList);
    setAvgRating(newAvgRating);
  }, [navigate]);

  const logout = () => {
    sessionStorage.clear();
    navigate("/faculty-login");
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "#4caf50";
    if (rating >= 3.5) return "#ff9800";
    if (rating >= 2.5) return "#ffc107";
    return "#f44336";
  };

  return (
    <div className="faculty-dashboard">
      {/* HEADER */}
      <div className="faculty-header">
        <div className="header-content">
          <h1>👨‍🏫 {facultyName || "Faculty"}</h1>
          <p>Student Feedback Dashboard</p>
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="faculty-table-container">
        {/* SUMMARY STATS */}
        <div className="summary-stats">
          <div className="stat-box">
            <span className="stat-label">Overall Rating</span>
            <span className="stat-value" style={{ color: getRatingColor(avgRating) }}>
              {avgRating || "0"} / 5.0 ⭐
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Total Feedback</span>
            <span className="stat-value">{feedbackList.length} Responses</span>
          </div>
        </div>

        {/* FEEDBACK TABLE */}
        {feedbackList.length > 0 ? (
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Q1: Teaching Quality</th>
                <th>Q2: Course Content</th>
                <th>Q3: Communication</th>
                <th>Q4: Accessibility</th>
                <th>Q5: Satisfaction</th>
                <th>Average</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((f, i) => (
                <tr key={i}>
                  <td className="course-name">{f.courseName}</td>
                  <td>
                    <span className="rating-badge">{f.q1}/5</span>
                  </td>
                  <td>
                    <span className="rating-badge">{f.q2}/5</span>
                  </td>
                  <td>
                    <span className="rating-badge">{f.q3}/5</span>
                  </td>
                  <td>
                    <span className="rating-badge">{f.q4}/5</span>
                  </td>
                  <td>
                    <span className="rating-badge">{f.q5}/5</span>
                  </td>
                  <td>
                    <strong style={{ color: getRatingColor((f.q1 + f.q2 + f.q3 + f.q4 + f.q5) / 5) }}>
                      {((f.q1 + f.q2 + f.q3 + f.q4 + f.q5) / 5).toFixed(2)}
                    </strong>
                  </td>
                  <td className="comment-cell">{f.comment || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data-message">
            <p>📭 No feedback submitted yet</p>
            <p>Check back later for student feedback</p>
          </div>
        )}
      </div>
    </div>
  );
}