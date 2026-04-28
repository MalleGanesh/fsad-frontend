import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles.css";

export default function FeedbackForm() {
  const navigate = useNavigate();

  const [faculties, setFaculties] = useState([]);
  const [facultyId, setFacultyId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("submit");
  const [myFeedbacks, setMyFeedbacks] = useState([]);

  // 🔐 Protect route & Fetch faculty
  useEffect(() => {
    if (sessionStorage.getItem("studentLoggedIn") !== "true") {
      alert("Please login as Student first");
      navigate("/student-login");
      return;
    }

    axios.get("/api/faculty?enabled=true")
      .then(res => {
        setFaculties(res.data || []);
      })
      .catch(err => {
        console.error("Failed to fetch faculty:", err);
        alert("⚠️ Error: Could not load faculty list from server.");
      });
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "view") {
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
      if (authUser.email) {
        axios.get(`/api/feedback/student/${authUser.email}`)
          .then(res => setMyFeedbacks(res.data))
          .catch(err => console.error("Error fetching my feedbacks", err));
      }
    }
  }, [activeTab]);

  const handleRating = (q, value) => {
    setRatings({ ...ratings, [q]: parseInt(value) });
  };

  const handleFacultyChange = (id) => {
    setFacultyId(id);
    const selected = faculties.find(f => String(f.id) === String(id));
    if (selected && selected.course) {
      setCourseName(selected.course);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!facultyId) {
      alert("Please select a faculty member");
      return;
    }

    if (!courseName.trim()) {
      alert("Please enter the course name");
      return;
    }

    // 🛡️ Ensure all 5 ratings are present
    const requiredQuestions = ["q1", "q2", "q3", "q4", "q5"];
    const missing = requiredQuestions.filter(q => !ratings[q]);

    if (missing.length > 0) {
      alert(`Please answer all questions. Missing: ${missing.join(", ")}`);
      return;
    }

    // ✅ Get student info from session/local storage
    const studentName = sessionStorage.getItem("studentName");
    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    const studentEmail = authUser.email;

    // 🔐 Safety check
    if (!studentName || !studentEmail) {
      alert("Session expired. Please login again.");
      navigate("/student-login");
      return;
    }

    const feedbackData = {
      studentName,
      studentEmail,
      facultyId,
      courseName,
      ...ratings,
      comment,
    };

    try {
      await axios.post("/api/feedback", feedbackData);
      alert("✅ Feedback submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Submission error:", error);
      const serverMessage = error.response?.data || "Failed to submit feedback. Please try again.";
      const errorText = typeof serverMessage === 'object' ? serverMessage.message : serverMessage;
      alert(`❌ Error: ${errorText}`);
    }
  };

  return (
    <div className="feedback-bg">
      <div className="container">
        <h2>📋 Student Feedback Dashboard</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "center" }}>
          <button 
            style={{ padding: "10px 20px", cursor: "pointer", background: activeTab === "submit" ? "#667eea" : "#ddd", color: activeTab === "submit" ? "white" : "black", border: "none", borderRadius: "5px", fontWeight: "bold" }}
            onClick={() => setActiveTab("submit")}
          >Submit Feedback</button>
          <button 
            style={{ padding: "10px 20px", cursor: "pointer", background: activeTab === "view" ? "#667eea" : "#ddd", color: activeTab === "view" ? "white" : "black", border: "none", borderRadius: "5px", fontWeight: "bold" }}
            onClick={() => setActiveTab("view")}
          >My Feedbacks</button>
        </div>

        {activeTab === "submit" ? (

        <form onSubmit={submitFeedback}>
          <label>Faculty Name</label>
          <select
            value={facultyId}
            onChange={(e) => handleFacultyChange(e.target.value)}
            required
          >
            <option value="">-- Select Faculty --</option>
            {faculties.length > 0 ? (
              faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} - {f.facultyId}
                </option>
              ))
            ) : (
              <option disabled>No approved faculty available</option>
            )}
          </select>

          <label>Course Code & Name</label>
          <input 
            placeholder="Faculty course will appear here"
            value={courseName} 
            readOnly
            className="readonly-input"
            required 
          />

          {/* QUESTIONS */}
          {[1, 2, 3, 4, 5].map((q) => (
            <div className="question" key={q}>
              <label>
                {q}.{" "}
                {[
                  "Overall rating of the faculty",
                  "Interaction & doubt clarification",
                  "Hands-on examples & applications",
                  "Syllabus coverage",
                  "Teaching clarity",
                ][q - 1]}
              </label>

              <div className="rating-row">
                {[1, 2, 3, 4, 5].map((v) => (
                  <label key={v}>
                    <input
                      type="radio"
                      name={`q${q}`}
                      onChange={() => handleRating(`q${q}`, v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <label>Comments</label>
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <button type="submit">Submit Feedback</button>
        </form>
        ) : (
          <div className="faculty-table-container" style={{ margin: "0" }}>
             {myFeedbacks.length > 0 ? (
               <table className="feedback-table" style={{ width: "100%", boxShadow: "none", border: "1px solid #eee" }}>
                 <thead>
                   <tr>
                     <th>Faculty</th>
                     <th>Course</th>
                     <th>Rating (Avg)</th>
                     <th>Comments</th>
                   </tr>
                 </thead>
                 <tbody>
                   {myFeedbacks.map(fb => {
                     const avg = ((fb.q1 + fb.q2 + fb.q3 + fb.q4 + fb.q5) / 5).toFixed(1);
                     return (
                       <tr key={fb.id}>
                         <td data-label="Faculty">{fb.faculty?.name || 'Unknown'}</td>
                         <td data-label="Course"><span className="course-name">{fb.courseName}</span></td>
                         <td data-label="Rating"><span className="rating-badge">{avg} / 5.0</span></td>
                         <td data-label="Comments" className="comment-cell">{fb.comment || '-'}</td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             ) : (
               <div className="no-data-message" style={{ boxShadow: "none", border: "1px solid #eee", padding: "40px 20px" }}>
                 <p>📭</p>
                 <p>You haven't submitted any feedback yet.</p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}