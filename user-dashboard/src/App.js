import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Overview from './pages/Overview';
import UserStats from './pages/UserStats';
import Charts from './pages/Charts';
import Tables from './pages/Tables';
import Settings from './pages/Settings';

const App = () => (
  <Router>
    <div className="container-fluid">
      <header className="row bg-light p-3 mb-3">
        <div className="col-12 col-md-8">
          <h1 className="display-4">User Program Dashboard</h1>
          <p className="text-muted">Last Updated: {new Date().toLocaleString()}</p>
        </div>
        <div className="col-12 col-md-4 text-right">
          <div className="form-inline">
            <label htmlFor="date-range" className="mr-2">Date Range:</label>
            <input type="text" id="date-range" className="form-control mr-3" name="date-range" />
            <label htmlFor="category" className="mr-2">Category:</label>
            <select id="category" className="form-control" name="category">
              <option value="all">All</option>
              {/* Add other categories as needed */}
            </select>
          </div>
        </div>
      </header>
      <div className="row">
        <nav className="col-12 col-md-2 bg-dark text-white p-3 sidebar">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Overview</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/user-stats">User Stats</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/charts">Charts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/tables">Tables</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
        <main className="col-12 col-md-10">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/user-stats" element={<UserStats />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <footer className="row bg-light p-3 mt-3 footer">
        <div className="col text-center">
          <p>Resources: <a href="#">Documentation</a></p>
          <p>Contact: <a href="mailto:support@example.com">support@example.com</a></p>
        </div>
      </footer>
    </div>
  </Router>
);

export default App;


