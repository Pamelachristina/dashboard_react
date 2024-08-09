import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig"; // Adjust the path as needed
import StatsCard from "../components/StatsCard";
import USMap from "../components/USMap";
import CanvasGlobe from "../components/CanvasGlobe";
import '../App.css'; // Ensure you include the CSS styles

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: "Loading...",
    onSiteUsers: "Loading...",
    remoteUsers: "Loading...",
    minorityInstitutions: "Loading...",
    companies: "Loading...",
    states: "Loading...",
    countriesServed: "Loading...",
    totalProposals: "Loading...",
    acceptedProposals: "Loading...",
    acceptanceRate: "Loading...",
    publications: "Loading..."
  });

  const [isDropping, setIsDropping] = useState(false);
  const [year, setYear] = useState(2023); // Default year
  const [currentIndex, setCurrentIndex] = useState(0); // Current index for the text animation
  const [stateData, setStateData] = useState([]); // State data for the USMap component

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const totalUsersResponse = await axiosInstance.get('/api/total-users', { params: { year } });
        const totalUsers = totalUsersResponse.data.totalusers;

        // Fetch on-site users
        const onSiteUsersResponse = await axiosInstance.get('/api/on-site-users', { params: { year } });
        const onSiteUsers = onSiteUsersResponse.data.onsiteusers;

        // Fetch remote users
        const remoteUsersResponse = await axiosInstance.get('/api/remote-users', { params: { year } });
        const remoteUsers = remoteUsersResponse.data.remoteusers;

        // Fetch total proposals
        const totalProposalsResponse = await axiosInstance.get('/api/total-proposals', { params: { year } });
        const totalProposals = totalProposalsResponse.data.totalproposals;

        // Fetch accepted proposals
        const acceptedProposalsResponse = await axiosInstance.get('/api/accepted-proposals', { params: { year } });
        const acceptedProposals = acceptedProposalsResponse.data.acceptedproposals;

        // Calculate acceptance rate
        const acceptanceRate = ((acceptedProposals / totalProposals) * 100).toFixed(2);

        // Fetch minority institutions
        const minorityInstitutionsResponse = await axiosInstance.get('/api/minority-institutions', { params: { year } });
        const minorityInstitutions = minorityInstitutionsResponse.data.minorityinstitutions;

        // Fetch companies
        const companiesResponse = await axiosInstance.get('/api/companies', { params: { year } });
        const companies = companiesResponse.data.companies;

        // Fetch states
        const statesResponse = await axiosInstance.get('/api/states', { params: { year } });
        const states = statesResponse.data.states;

        // Fetch countries served
        const countriesServedResponse = await axiosInstance.get('/api/countries-served', { params: { year } });
        const countriesServed = countriesServedResponse.data.countriesserved;

        // Fetch publications
        const publicationsResponse = await axiosInstance.get('/api/publications', { params: { year } });
        const publications = publicationsResponse.data.publications;

        // Fetch state data for the USMap component
        const stateDataResponse = await axiosInstance.get('/api/state-data', { params: { year } });
        const stateData = stateDataResponse.data;

        // Update state
        setStats({
          totalUsers,
          onSiteUsers,
          remoteUsers,
          minorityInstitutions,
          companies,
          states,
          countriesServed,
          totalProposals,
          acceptedProposals,
          acceptanceRate,
          publications
        });
        setStateData(stateData);
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
          totalProposals: "Error",
          acceptedProposals: "Error",
          acceptanceRate: "Error",
          publications: "Error"
        });
      }
    };

    fetchStats();
  }, [year]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsDropping(true);
      setTimeout(() => {
        setCurrentIndex((currentIndex + 1) % 3);
        setIsDropping(false);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="main-content">
      <div className="container-fluid overview-container">
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="yearSelector">Select Year:</label>
            <select id="yearSelector" value={year} onChange={handleYearChange}>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              {/* Add more years as needed */}
            </select>
          </div>
        </div>
        <div className="row mb-3">
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
        <div className="row mb-3">
          <div className="col-md-8">
            <div className="content-box map-content-box">
              <div className="animated-text-container">
                <h2>In fiscal year {year} we served:</h2>
                <div
                  className={`animated-text ${isDropping ? "text-drop-out" : "text-drop-in"}`}
                  style={{ display: currentIndex === 0 ? 'block' : 'none' }}
                >
                  <span className="large-number">{stats.minorityInstitutions}</span>
                  <div className="stack-text">
                    <span>Minority</span>
                    <span>Serving</span>
                    <span>Institutions</span>
                  </div>
                </div>
                <div
                  className={`animated-text ${isDropping ? "text-drop-out" : "text-drop-in"}`}
                  style={{ display: currentIndex === 1 ? 'block' : 'none' }}
                >
                  <span className="large-number">{stats.companies}</span>
                  <span className="small-text">Companies</span>
                </div>
                <div
                  className={`animated-text ${isDropping ? "text-drop-out" : "text-drop-in"}`}
                  style={{ display: currentIndex === 2 ? 'block' : 'none' }}
                >
                  <span className="large-number">{stats.states}</span>
                  <span className="small-text">States</span>
                </div>
              </div>
              <div className="us-map-container">
                <USMap data={stateData} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="content-box globe-content-box">
              <p className="serving-text">Serving</p>
              <p className="countries-served">
                <span className="large-number">{stats.countriesServed}</span>
                <span className="small-text">Countries</span>
              </p>
              <div className="globe-container">
                <CanvasGlobe
                  width={200}
                  height={200}
                  landColor="#fff"
                  countryColor="#F0B323"
                  borderColor="#FFF"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <StatsCard title="Number of Proposals" value={stats.totalProposals} />
          </div>
          <div className="col-md-4">
            <StatsCard title="Acceptance Rate" value={stats.acceptanceRate + '%'} />
          </div>
          <div className="col-md-4">
            <StatsCard title="Number of Publications" value={stats.publications} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;





























