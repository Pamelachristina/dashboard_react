import React from "react";
import "./App.css"; // Ensure this path is correct
import SideBar from "./components/SideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Overview from "./pages/Overview";
import UserTrendsInsights from './pages/UserTrendsInsights';
import UserStats from "./pages/UserStats";
import Charts from "./pages/Charts";
import Tables from "./pages/Tables";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="app-container">
        <SideBar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/user-trends-and-insights" element={UserTrendsInsights} />
            <Route path="/user-stats" element={<UserStats />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
