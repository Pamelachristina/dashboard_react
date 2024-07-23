// src/components/NavBar.js

import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="navbar-brand" to="/">
        MyApp
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" to="/overview">
              Overview
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/user-stats">
              User Stats
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/user-trends-and-insights">
              User Trends and Insights
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/charts">
              Charts
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/tables">
              Tables
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/settings">
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
