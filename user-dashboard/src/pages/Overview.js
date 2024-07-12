import React, { useState, useEffect } from "react";
import StatsCard from "../components/StatsCard";
import USMap from "../components/USMap";
import globe from "../assets/globe.svg";

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: "Loading...",
    onSiteUsers: "Loading...",
    remoteUsers: "Loading...",
    minorityInstitutions: "Loading...",
    countriesServed: "Loading...",
  });

  useEffect(() => {
    // Use mock data instead of making an API call
    const mockData = {
      totalUsers: "100",
      onSiteUsers: "60",
      remoteUsers: "40",
      minorityInstitutions: "10",
      countriesServed: "5",
    };

    // Simulate an API call delay
    setTimeout(() => {
      setStats(mockData);
    }, 1000);
  }, []);

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
              <img
                src={globe}
                alt="Globe icon representing worldwide service"
                className="large-image-globe"
              />
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
