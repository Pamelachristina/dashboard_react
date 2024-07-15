// src/pages/UserStats.js
import React from 'react';
import StatsCard from "../components/StatsCard";
import User from '../components/User';

const UserStats = () => (
  <div>
    <User />
    <div className="main-content">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-md-4">
            <StatsCard title="more details about institutions/companies based on fiscal year"  />
          </div>
          <div className="col-md-4">
            <StatsCard title="Name of Uni that is MSI / Epsore" />
          </div>
          <div className="col-md-4">
            <StatsCard title="Number of users from each school" />
          </div>
          <div className="col-md-4">
            <StatsCard title="First year ? or Returning" />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="content-box d-flex">
              <div className="w-50">
                
               
                 
              
              <div className="w-50 d-flex">
               
              </div>
            </div>
          </div>
          <div className="col-md-4 d-flex flex-column align-items-center justify-content-center content-box">
            
           
            
            <div className="globe-container">
             
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-4">
            <StatsCard title="Placeholder" />
          </div>
          <div className="col-md-4">
            <StatsCard title="Placeholder"  />
          </div>
          <div className="col-md-4">
            <StatsCard title="Placeholder"  />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);

export default UserStats;

