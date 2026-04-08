import "./styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";

// In production, use the exact backend domain. In dev, use the built-in Vite proxy.
axios.defaults.baseURL = import.meta.env.PROD ? "https://fsad-backend-5j11.onrender.com" : "";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);