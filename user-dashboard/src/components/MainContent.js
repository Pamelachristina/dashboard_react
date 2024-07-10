import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatsCard from './StatsCard';
import USMap from './USMap'; // Import the USMap component
import globe from '../assets/globe.svg'; // Adjust the path if needed

const MainContent = () => {
    const [stats, setStats] = useState({
        totalUsers: 'Loading...',
        onSiteUsers: 'Loading...',
        remoteUsers: 'Loading...',
        minorityInstitutions: 'Loading...',
        countriesServed: 'Loading...'
    });

    useEffect(() => {
        const endpoint = '/api/v1/UserStatistics'; // Relative URL because of proxy

        axios.get(endpoint)
            .then(response => {
                const data = response.data;
                setStats({
                    totalUsers: data.totalUsers,
                    onSiteUsers: data.onSiteUsers,
                    remoteUsers: data.remoteUsers,
                    minorityInstitutions: data.minorityInstitutions,
                    countriesServed: data.countriesServed
                });
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setStats({
                    totalUsers: 'Error',
                    onSiteUsers: 'Error',
                    remoteUsers: 'Error',
                    minorityInstitutions: 'Error',
                    countriesServed: 'Error'
                });
            });
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
                                <p className="display-4 font-weight-bold text-primary">{stats.minorityInstitutions}</p>
                                <p className="h4 font-weight-bold text-dark">Minority Serving Institutions</p>
                            </div>
                            <div className="w-50 d-flex ">
                                <USMap />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 d-flex flex-column align-items-center justify-content-center content-box">
                        <p className="h4 font-weight-bold mb-2">Serving</p>
                        <p className="display-4 font-weight-bold mb-2">{stats.countriesServed}</p>
                        <p className="h4 font-weight-bold mb-4">Countries</p>
                        <img src={globe} alt="Globe icon representing worldwide service" className="large-image-globe" />
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
}

export default MainContent;





