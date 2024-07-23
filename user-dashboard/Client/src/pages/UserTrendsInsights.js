// UserTrendsInsights.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import Dropdown from '../components/Dropdown';
import TextualInsights from '../components/TextualInsights';
import styles from './UserTrendsInsights.module.css'; // Import CSS module
import 'bootstrap/dist/css/bootstrap.min.css';

const UserTrendsInsights = () => {
  const [fiscalYear, setFiscalYear] = useState('2023');
  const [userCategory, setUserCategory] = useState('all');
  const [engagementData, setEngagementData] = useState([]);
  const [insightsData, setInsightsData] = useState({});
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/UserTrends', {
          params: { fiscalYear, userCategory }
        });
        console.log('Fetched data:', response.data); // Debugging log
        setEngagementData(response.data.engagement);
        setInsightsData(response.data.insights);
        setComparisonData(response.data.comparison);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [fiscalYear, userCategory]);

  return (
    <div className="container-fluid">
      <header className="mb-4">
        <h1>User Trends and Insights</h1>
        <Dropdown label="Fiscal Year" options={['2023', '2022', '2021']} selected={fiscalYear} onChange={setFiscalYear} />
        <Dropdown label="User Category" options={['all', 'on-site', 'remote']} selected={userCategory} onChange={setUserCategory} />
      </header>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-md-6">
            <div className={`card ${styles.customCard}`} style={{ borderRadius: 0 }}>
              <div className="card-body">
                <h5 className="card-title">Trends in User Engagement</h5>
                {engagementData.length > 0 ? (
                  <LineChart data={engagementData} />
                ) : (
                  <p>No engagement data available</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`card ${styles.customCard}`} style={{ borderRadius: 0 }}>
              <div className="card-body">
                <h5 className="card-title">Key Insights and Analytics</h5>
                <h6>Peak Usage Times</h6>
                {insightsData.peakUsage ? (
                  <BarChart data={insightsData.peakUsage} />
                ) : (
                  <p>No peak usage data available</p>
                )}
                <TextualInsights data={insightsData.peakUsageText || 'No textual insights available'} />
                <h6>Popular Facilities/Resources</h6>
                {insightsData.facilities ? (
                  <PieChart data={insightsData.facilities} />
                ) : (
                  <p>No facilities data available</p>
                )}
                <TextualInsights data={insightsData.facilitiesText || 'No textual insights available'} />
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-12">
            <div className={`card ${styles.customCard}`} style={{ borderRadius: 0 }}>
              <div className="card-body">
                <h5 className="card-title">Comparative Analysis of On-site vs. Remote User Growth</h5>
                {comparisonData.length > 0 ? (
                  <BarChart data={comparisonData} />
                ) : (
                  <p>No comparison data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrendsInsights;



