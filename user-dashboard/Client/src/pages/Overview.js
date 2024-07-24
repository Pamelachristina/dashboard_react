import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the path as needed
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
        // Fetch total users
        const totalUsersResponse = await axiosInstance.get('/api/total-users');
        console.log('Total Users Response:', totalUsersResponse.data); // Log API response
        const totalUsers = totalUsersResponse.data.totalusers; // Access the correct property

        // Fetch on-site users
        const onSiteUsersResponse = await axiosInstance.get('/api/on-site-users');
        console.log('On-Site Users Response:', onSiteUsersResponse.data); // Log API response
        const onSiteUsers = onSiteUsersResponse.data.onsiteusers; // Adjust this based on actual response

        // Fetch remote users
        const remoteUsersResponse = await axiosInstance.get('/api/remote-users');
        console.log('Remote Users Response:', remoteUsersResponse.data); // Log API response
        const remoteUsers = remoteUsersResponse.data.remoteusers; // Adjust this based on actual response

        // Update state
        setStats(prevStats => {
          const updatedStats = {
            ...prevStats,
            totalUsers: totalUsers,
            onSiteUsers: onSiteUsers,
            remoteUsers: remoteUsers,
          };
          console.log('Updated Stats:', updatedStats); // Log updated state
          return updatedStats;
        });
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

    console.log('Fetching stats...'); // Log when fetching starts
    fetchStats();
  }, []);

  useEffect(() => {
    const texts = [
      `${stats.minorityInstitutions} Minority Serving Institutions`,
      `${stats.companies} Companies`,
      `in ${stats.states} States`,
    ];
    let index = 0;

    console.log('State Data:', stats); // Log the state data before setting up the interval

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
            {console.log('Rendering Total Users:', stats.totalUsers)} {/* Log rendering data */}
          </div>
          <div className="col-md-4">
            <StatsCard title="On-site Users" value={stats.onSiteUsers} />
            {console.log('Rendering On-Site Users:', stats.onSiteUsers)} {/* Log rendering data */}
          </div>
          <div className="col-md-4">
            <StatsCard title="Remote Users" value={stats.remoteUsers} />
            {console.log('Rendering Remote Users:', stats.remoteUsers)} {/* Log rendering data */}
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
                <USMap data={[]} /> {/* Pass empty data or remove if not needed */}
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






