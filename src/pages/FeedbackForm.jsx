import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function FeedbackForm() {
  const navigate = useNavigate();

  // 🔐 Protect route
  useEffect(() => {
    if (sessionStorage.getItem("studentLoggedIn") !== "true") {
      alert("Please login as Student first");
      navigate("/student-login");
    }
  }, [navigate]);

  const [facultyValue, setFacultyValue] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");

  const facultyMap = {
    "CSE118 - IoT": "Dr. R. Saxena",
    "CSE205 - Java": "Dr. Hari Pothuluru",
    "CSE210 - Python": "Dr. Maneesha Vadduri",
    "CSE305 - DBMS": "Dr. Nichenametla Rajesh",
    "CSE402 - AI": "Dr. K. Srinivas",
  };

  const handleFacultyChange = (value) => {
    setFacultyValue(value);
    setCourseName(value);
    setFacultyName(facultyMap[value]);
  };

  const handleRating = (q, value) => {
    setRatings({ ...ratings, [q]: parseInt(value) });
  };

  const submitFeedback = (e) => {
    e.preventDefault();

    if (Object.keys(ratings).length < 5) {
      alert("Please answer all questions");
      return;
    }

    const feedback = {
      facultyName,
      courseName,
      ...ratings,
      comment,
    };

    // ✅ Frontend-only storage (for Admin / Faculty dashboards)
    localStorage.setItem("latestFeedback", JSON.stringify(feedback));

    alert("Feedback submitted successfully");
    navigate("/"); // or /thank-you later
  };

  return (
    <div className="feedback-bg">
      <div className="container">
        <h2>📋 Student Feedback Form</h2>

        <form onSubmit={submitFeedback}>
          <label>Faculty Name</label>
          <select
            value={facultyValue}
            onChange={(e) => handleFacultyChange(e.target.value)}
            required
          >
            <option value="">-- Select Faculty --</option>
            <option value="CSE118 - IoT">Dr. R. Saxena</option>
            <option value="CSE205 - Java">Dr. Hari Pothuluru</option>
            <option value="CSE210 - Python">Dr. Maneesha Vadduri</option>
            <option value="CSE305 - DBMS">Dr. Nichenametla Rajesh</option>
            <option value="CSE402 - AI">Dr. K. Srinivas</option>
          </select>

          <label>Course Code & Name</label>
          <input value={courseName} readOnly />

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