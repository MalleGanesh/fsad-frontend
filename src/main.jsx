import "./styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";

// Config for Render deployment: axios now uses the local /api proxy configured in Nginx
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);