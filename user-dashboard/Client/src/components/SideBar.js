// src/components/SideBar.js

import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/1_Signature_Preferred_2c_lg.png";

const SideBar = () => {
  return (
    <div className="sideBar">
      <div className="p-4">
        <img
          src={logo}
          alt="Molecular Foundry logo"
          className="mb-4"
          style={{ width: '215px', height: 'auto', position: 'relative', left: '-15px' }} // Adjust the width as needed
        />
        <div className="relative">
          <input
            type="text"
            placeholder="Search ..."
            className="w-full pl-8 pr-2 py-1"
          />
          <i className="fas fa-search absolute left-2 top-2 text-gray-400"></i>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">User Office Dashboard</h2>
        <ul>
          <li className="mb-2">
            <NavLink
              to="/"
              className={({ isActive }) => {
                console.log("NavLink to / isActive:", isActive);
                return isActive ? "nav-link active" : "nav-link";
              }}
            >
              <i className="fas fa-chart-pie mr-2"></i> Overview
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user-stats"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <i className="fas fa-users mr-2"></i> User Stats
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user-trends-and-insights"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <i className="fas fa-chart-line mr-2"></i> User Trends and
              Insights
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/charts"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <i className="fas fa-chart-bar mr-2"></i> Charts
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/tables"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <i className="fas fa-table mr-2"></i> Tables
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <i className="fas fa-cog mr-2"></i> Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;

