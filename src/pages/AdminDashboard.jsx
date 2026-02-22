import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../styles.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [feedbackList, setFeedbackList] = useState([]);
  const [chartData, setChartData] = useState(null);

  // 🔐 Protect route + load data
  useEffect(() => {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
      alert("Please login as Admin first");
      navigate("/admin-login");
      return;
    }

    // Compute all values first
    let newFeedbackList = [];
    let newChartData = null;

    const stored = localStorage.getItem("latestFeedback");
    if (stored) {
      const feedback = JSON.parse(stored);
      newFeedbackList = [feedback];

      // Prepare chart
      const avg =
        (feedback.q1 +
          feedback.q2 +
          feedback.q3 +
          feedback.q4 +
          feedback.q5) /
        5;

      newChartData = {
        labels: [`${feedback.facultyName} (${feedback.courseName})`],
        datasets: [
          {
            label: "Average Rating",
            data: [avg.toFixed(2)],
            backgroundColor: "#4e54c8",
          },
        ],
      };
    }

    // Set all state at once
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFeedbackList(newFeedbackList);
    setChartData(newChartData);
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/admin-login");
  };

  return (
    <div className="admin-bg">
      {/* NAVBAR */}
      <div className="navbar">
        <h2>🛡️ Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="container">
        {/* STUDENT FEEDBACK TABLE */}
        <div className="card">
          <h3>📋 Student Feedback</h3>

          {feedbackList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course</th>
                  <th>Faculty</th>
                  <th>Rating</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((f, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{f.courseName}</td>
                    <td>{f.facultyName}</td>
                    <td>
                      <b>
                        {(
                          (f.q1 +
                            f.q2 +
                            f.q3 +
                            f.q4 +
                            f.q5) /
                          5
                        ).toFixed(2)}
                      </b>
                    </td>
                    <td>{f.comment || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No feedback submitted yet.</p>
          )}
        </div>

        {/* FACULTY SUMMARY */}
        <div className="card">
          <h3>📊 Faculty Performance Summary</h3>

          {feedbackList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Faculty</th>
                  <th>Course</th>
                  <th>Average Rating</th>
                  <th>Total Feedback</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((f, i) => (
                  <tr key={i}>
                    <td>{f.facultyName}</td>
                    <td>{f.courseName}</td>
                    <td>
                      <b>
                        {(
                          (f.q1 +
                            f.q2 +
                            f.q3 +
                            f.q4 +
                            f.q5) /
                          5
                        ).toFixed(2)}
                      </b>
                    </td>
                    <td>1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No summary available.</p>
          )}
        </div>

        {/* FACULTY RATING CHART */}
        <div className="card">
          <h3>📈 Faculty Rating Chart</h3>
          {chartData ? (
            <Bar
              data={chartData}
              options={{
                scales: {
                  y: { beginAtZero: true, max: 5 },
                },
              }}
            />
          ) : (
            <p>No chart data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}