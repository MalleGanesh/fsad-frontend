import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    // 🔐 Protect Admin Route
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
      alert("Please login as Admin first");
      navigate("/admin-login");
      return;
    }

    axios
      .get("/api/feedback")
      .then((response) => {
        const data = response.data;
        setFeedbackList(data);

        if (data.length === 0) {
          setChartData(null);
          return;
        }

        // 📊 Group and Average feedback by Faculty + Course
        const groupedMap = {};
        data.forEach(f => {
          const key = `${f.faculty?.name || "Unknown"} (${f.courseName})`;
          const avg = ((f.q1 || 0) + (f.q2 || 0) + (f.q3 || 0) + (f.q4 || 0) + (f.q5 || 0)) / 5;
          
          if (!groupedMap[key]) {
            groupedMap[key] = { ratings: [], faculty: f.faculty, course: f.courseName };
          }
          groupedMap[key].ratings.push(avg);
        });

        const labels = Object.keys(groupedMap);
        const averages = labels.map(label => {
          const group = groupedMap[label];
          const sum = group.ratings.reduce((a, b) => a + b, 0);
          return (sum / group.ratings.length).toFixed(2);
        });

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Average Rating",
              data: averages,
              backgroundColor: "#4e54c8",
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching feedback:", error);
      });

    axios
      .get("/api/faculty")
      .then((response) => setFacultyList(response.data))
      .catch((error) => {
        console.error("Error fetching faculty list:", error);
      });
  }, [navigate]);

  const updateFacultyAccess = (faculty, enabled) => {
    axios
      .patch(`/api/faculty/${faculty.id}/access`, { enabled })
      .then((response) => {
        const updated = response.data;
        setFacultyList((prev) =>
          prev.map((f) => (f.id === updated.id ? updated : f))
        );
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Failed to update faculty access");
      });
  };

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
                  <th>Average Rating</th>
                  <th>Comment</th>
                </tr>
              </thead>

              <tbody>
                {feedbackList.map((f, index) => {
                  const avg =
                    ((f.q1 || 0) + (f.q2 || 0) + (f.q3 || 0) + (f.q4 || 0) + (f.q5 || 0)) / 5;

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{f.courseName}</td>
                      <td>{f.faculty?.name || "-"}</td>
                      <td>
                        <b>{avg.toFixed(2)}</b>
                      </td>
                      <td>{f.comment || "-"}</td>
                    </tr>
                  );
                })}
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
                {(() => {
                  const groupedMap = {};
                  feedbackList.forEach(f => {
                    const key = `${f.faculty?.id}-${f.courseName}`;
                    const avg = ((f.q1 || 0) + (f.q2 || 0) + (f.q3 || 0) + (f.q4 || 0) + (f.q5 || 0)) / 5;
                    if (!groupedMap[key]) {
                      groupedMap[key] = { name: f.faculty?.name, course: f.courseName, sum: 0, count: 0 };
                    }
                    groupedMap[key].sum += avg;
                    groupedMap[key].count += 1;
                  });

                  return Object.keys(groupedMap).map((key) => {
                    const group = groupedMap[key];
                    return (
                      <tr key={key}>
                        <td>{group.name || "-"}</td>
                        <td>{group.course}</td>
                        <td>
                          <b>{(group.sum / group.count).toFixed(2)}</b>
                        </td>
                        <td>{group.count}</td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          ) : (
            <p>No summary available.</p>
          )}
        </div>

        {/* CHART */}
        <div className="card">
          <h3>📈 Faculty Rating Chart</h3>

          {chartData ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 5,
                  },
                },
              }}
            />
          ) : (
            <p>No chart data available.</p>
          )}
        </div>

        {/* FACULTY ACCESS CONTROL */}
        <div className="card">
          <h3>🔐 Faculty Access Control</h3>

          {facultyList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Faculty</th>
                  <th>Faculty ID</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {facultyList.map((f) => (
                  <tr key={f.id}>
                    <td>{f.name}</td>
                    <td>{f.facultyId}</td>
                    <td>
                      <button onClick={() => updateFacultyAccess(f, !f.enabled)}>
                        {f.enabled ? "Revoke Access" : "Grant Access"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No faculty records available.</p>
          )}
        </div>

      </div>
    </div>
  );
}