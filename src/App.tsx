import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserAvailability from "./components/UserAvailability";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/availability" element={<UserAvailability />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
