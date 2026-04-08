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
        <h2>📋 Student Feedback Form</h2>

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
      </div>
    </div>
  );
}