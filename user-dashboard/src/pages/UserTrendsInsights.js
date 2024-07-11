import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from '../components/LineChart'; // Correct path to LineChart
import BarChart from '../components/BarChart'; // Correct path to BarChart
import PieChart from '../components/PieChart'; // Correct path to PieChart
import Dropdown from '../components/Dropdown'; // Correct path to Dropdown
import TextualInsights from '../components/TextualInsights'; // Correct path to TextualInsights
import './UserTrendsInsights.css'; // Import your CSS file

const UserTrendsInsights = () => {
  const [fiscalYear, setFiscalYear] = useState('2023');
  const [userCategory, setUserCategory] = useState('all');
  const [engagementData, setEngagementData] = useState([]);
  const [insightsData, setInsightsData] = useState([]);
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
    <div className="main-content">
      <header>
        <h1>User Trends and Insights</h1>
        <Dropdown label="Fiscal Year" options={['2023', '2022', '2021']} selected={fiscalYear} onChange={setFiscalYear} />
        <Dropdown label="User Category" options={['all', 'on-site', 'remote']} selected={userCategory} onChange={setUserCategory} />
      </header>
      <section>
        <h2>Trends in User Engagement</h2>
        {engagementData.length > 0 ? (
          <LineChart data={engagementData} />
        ) : (
          <p>No engagement data available</p>
        )}
      </section>
      <section>
        <h2>Key Insights and Analytics</h2>
        <h3>Peak Usage Times</h3>
        {insightsData.peakUsage ? (
          <BarChart data={insightsData.peakUsage} />
        ) : (
          <p>No peak usage data available</p>
        )}
        <TextualInsights data={insightsData.peakUsageText || 'No textual insights available'} />
        <h3>Popular Facilities/Resources</h3>
        {insightsData.facilities ? (
          <PieChart data={insightsData.facilities} />
        ) : (
          <p>No facilities data available</p>
        )}
        <TextualInsights data={insightsData.facilitiesText || 'No textual insights available'} />
      </section>
      <section>
        <h2>Comparative Analysis of On-site vs. Remote User Growth</h2>
        {comparisonData.length > 0 ? (
          <BarChart data={comparisonData} />
        ) : (
          <p>No comparison data available</p>
        )}
      </section>
    </div>
  );
};

export default UserTrendsInsights;


