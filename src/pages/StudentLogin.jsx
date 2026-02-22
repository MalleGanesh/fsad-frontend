import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaText, setCaptchaText] = useState("");

  // ✅ Define function BEFORE useEffect
  const generateCaptcha = () => {
    const text = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setCaptchaText(text);
  };

  // ✅ No ESLint warning now
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateCaptcha();
  }, []);

  const handleLogin = () => {
    if (!username || !password || !captchaInput) {
      alert("All fields are required");
      return;
    }

    if (captchaInput !== captchaText) {
      alert("Invalid CAPTCHA");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    sessionStorage.setItem("studentLoggedIn", "true");
    sessionStorage.setItem("studentName", username);
    navigate("/feedback-form");
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2>👨‍🎓 Student Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="captcha-box">{captchaText}</div>

        <input
          type="text"
          placeholder="Enter CAPTCHA"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}