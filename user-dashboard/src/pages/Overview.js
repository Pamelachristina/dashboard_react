import React, { useState, useEffect } from "react";
import axios from "axios";
import StatsCard from "../components/StatsCard";
import USMap from "../components/USMap";
import Globe from "../components/Globe"; // Import the new Globe component

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: "Loading...",
    onSiteUsers: "Loading...",
    remoteUsers: "Loading...",
    minorityInstitutions: "Loading...",
    countriesServed: "Loading...",
  });

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchStats = async () => {
      try {
        // Make the GET request using a CORS proxy
        const response = await axios.get('https://cors-anywhere.herokuapp.com/https://foundry-reviews.dev.lbl.gov/api/user-program-stats');
        
        // Update state with the response data
        setStats(response.data);
      } catch (error) {
        // Handle errors if the request fails
        console.error('Failed to fetch stats:', error);
        // Optionally, you can set an error state or default values
      }
    };

    // Call the async function
    fetchStats();
  }, []); // Empty dependency array means this effect runs once when the component mount
  
  return (
    <div className="main-content">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-md-4">
            <StatsCard title="Total Users" value={stats.totalUsers} />
          </div>
          <div className="col-md-4">
            <StatsCard title="On-site Users" value={stats.onSiteUsers} />
          </div>
          <div className="col-md-4">
            <StatsCard title="Remote Users" value={stats.remoteUsers} />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="content-box d-flex">
              <div className="w-50">
                <p className="text-dark">In fiscal year 2023 we served:</p>
                <p className="display-4 font-weight-bold text-primary">
                  {stats.minorityInstitutions}
                </p>
                <p className="h4 font-weight-bold text-dark">
                  Minority Serving Institutions
                </p>
              </div>
              <div className="w-50 d-flex">
                <USMap />
              </div>
            </div>
          </div>
          <div className="col-md-4 d-flex flex-column align-items-center justify-content-center content-box">
            <p className="h4 font-weight-bold mb-2">Serving</p>
            <p className="display-4 font-weight-bold mb-2">
              {stats.countriesServed}
            </p>
            <p className="h4 font-weight-bold mb-4">Countries</p>
            <div className="globe-container">
              <Globe /> {/* Replace the image with the Globe component */}
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-4 content-box content-box-small d-flex align-items-center justify-content-center">
            <p className="h4 font-weight-bold">Placeholder</p>
          </div>
          <div className="col-md-4 content-box content-box-small d-flex align-items-center justify-content-center">
            <p className="h4 font-weight-bold">Highlight a user</p>
          </div>
          <div className="col-md-4 content-box content-box-small d-flex align-items-center justify-content-center">
            <p className="h4 font-weight-bold">Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;



