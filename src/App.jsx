import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FacultyLogin from "./pages/FacultyLogin";
import AdminLogin from "./pages/AdminLogin";
import FeedbackForm from "./pages/FeedbackForm";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/student-login" element={<AuthPage />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/feedback-form" element={<FeedbackForm />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}