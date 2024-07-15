import React, { useState, useEffect } from "react";
import axios from "axios";
import StatsCard from "../components/StatsCard";
import USMap from "../components/USMap";
import CanvasGlobe from "../components/CanvasGlobe";

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: "Loading...",
    onSiteUsers: "Loading...",
    remoteUsers: "Loading...",
    minorityInstitutions: "Loading...",
    companies: "Loading...",
    states: "Loading...",
    countriesServed: "Loading...",
  });

  const [currentText, setCurrentText] = useState("");
  const [isDropping, setIsDropping] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("https://foundry-reviews.dev.lbl.gov/api/v1/UserDashboard/2013/MSIandEPSCoR");
        const data = response.data;

        setStats({
          totalUsers: data.totalUsers,
          onSiteUsers: data.onSiteUsers,
          remoteUsers: data.remoteUsers,
          minorityInstitutions: data.minorityInstitutions,
          companies: data.companies,
          states: data.states,
          countriesServed: data.countriesServed,
        });
        setCurrentText(
          `${data.minorityInstitutions} Minority Serving Institutions`
        );
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats({
          totalUsers: "Error",
          onSiteUsers: "Error",
          remoteUsers: "Error",
          minorityInstitutions: "Error",
          companies: "Error",
          states: "Error",
          countriesServed: "Error",
        });
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const texts = [
      `${stats.minorityInstitutions} Minority Serving Institutions`,
      `${stats.companies} Companies`,
      `in ${stats.states} States`,
    ];
    let index = 0;

    const interval = setInterval(() => {
      setIsDropping(true);
      setTimeout(() => {
        setCurrentText(texts[index]);
        setIsDropping(false);
        index = (index + 1) % texts.length;
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [stats]);

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
                <div
                  className={`display-4 display-4-small ${
                    isDropping ? "text-drop-out" : "text-drop-in"
                  }`}
                >
                  {currentText}
                </div>
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
              <CanvasGlobe
                width={265}
                height={265}
                landColor="#fff"
                countryColor="#F0B323"
                borderColor="#FFF"
              />
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-4">
            <StatsCard title="Number of Proposals" value={stats.totalUsers} />
          </div>
          <div className="col-md-4">
            <StatsCard title="Acceptance Rate" value={stats.onSiteUsers} />
          </div>
          <div className="col-md-4">
            <StatsCard title="Number of Publications" value={stats.remoteUsers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;


