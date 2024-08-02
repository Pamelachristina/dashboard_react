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
    totalProposals: "Loading...",
    acceptedProposals: "Loading...",
    acceptanceRate: "Loading...",
    publications: "Loading..."
  });

  // const [employerTypeCount, setEmployerTypeCount] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [isDropping, setIsDropping] = useState(false);
  const [year, setYear] = useState(2023); // Default year

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const totalUsersResponse = await axiosInstance.get('/api/total-users', { params: { year } });
        const totalUsers = totalUsersResponse.data.totalusers;
        console.log('Total users:', totalUsers); // Log the total users

        // Fetch on-site users
        const onSiteUsersResponse = await axiosInstance.get('/api/on-site-users', { params: { year } });
        const onSiteUsers = onSiteUsersResponse.data.onsiteusers;
        console.log('On-site users:', onSiteUsers); // Log the on-site users

        // Fetch remote users
        const remoteUsersResponse = await axiosInstance.get('/api/remote-users', { params: { year } });
        const remoteUsers = remoteUsersResponse.data.remoteusers;
        console.log('Remote users:', remoteUsers); // Log the remote users

        // Fetch total proposals
        const totalProposalsResponse = await axiosInstance.get('/api/total-proposals', { params: { year } });
        const totalProposals = totalProposalsResponse.data.totalproposals;
        console.log('Total proposals:', totalProposals); // Log the total proposals

        // Fetch accepted proposals
        const acceptedProposalsResponse = await axiosInstance.get('/api/accepted-proposals', { params: { year } });
        const acceptedProposals = acceptedProposalsResponse.data.acceptedproposals;
        console.log('Accepted proposals:', acceptedProposals); // Log the accepted proposals

        // Calculate acceptance rate
        const acceptanceRate = ((acceptedProposals / totalProposals) * 100).toFixed(2);
        console.log('Acceptance rate:', acceptanceRate); // Log the acceptance rate

        // Fetch minority institutions (example endpoint, adjust as needed)
        const minorityInstitutionsResponse = await axiosInstance.get('/api/minority-institutions', { params: { year } });
        const minorityInstitutions = minorityInstitutionsResponse.data.minorityinstitutions;
        console.log('Minority institutions:', minorityInstitutions); // Log the minority institutions

        // Fetch companies (example endpoint, adjust as needed)
        const companiesResponse = await axiosInstance.get('/api/companies', { params: { year } });
        const companies = companiesResponse.data.companies;
        console.log('Companies:', companies); // Log the companies

        // Fetch states (example endpoint, adjust as needed)
        const statesResponse = await axiosInstance.get('/api/states', { params: { year } });
        const states = statesResponse.data.states;
        console.log('States:', states); // Log the states

        // Fetch countries served (example endpoint, adjust as needed)
        const countriesServedResponse = await axiosInstance.get('/api/countries-served', { params: { year } });
        const countriesServed = countriesServedResponse.data.countriesserved;
        console.log('Countries served:', countriesServed); // Log the countries served

         // Fetch publications
         const publicationsResponse = await axiosInstance.get('/api/publications', { params: { year } });
         const publications = publicationsResponse.data.publications;
         console.log('Publications:', publications); // Log the publications

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

  /* useEffect(() => {
    const fetchEmployerTypeCount = async () => {
      try {
        const response = await axiosInstance.get('/api/employer-type-count', { params: { year } });
        setEmployerTypeCount(response.data);
      } catch (error) {
        console.error("Failed to fetch employer type count:", error);
      }
    };

    fetchEmployerTypeCount();
  }, [year]); */

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
            <label htmlFor="yearSelector">Select Year:</label>
            <select id="yearSelector" value={year} onChange={handleYearChange}>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              {/* Add more years as needed */}
            </select>
          </div>
        </div>
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
                <p className="text-dark">In fiscal year {year} we served:</p>
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
            <StatsCard title="Number of Proposals" value={stats.totalProposals} />
          </div>
          <div className="col-md-4">
            <StatsCard title="Acceptance Rate" value={stats.acceptanceRate + '%'} />
          </div>
          <div className="col-md-4">
            <StatsCard title="Number of Publications" value={stats.publications} />
          </div>
        </div>
     {/*    <div className="row mb-4">
          {employerTypeCount.map((item, index) => (
            <div className="col-md-4" key={index}>
              <StatsCard
                title={`${item.employer_type} (${item.year})`}
                value={item.user_count}
              />
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Overview;













