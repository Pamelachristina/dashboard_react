import React from 'react';
import './KeyMetrics.css';

const KeyMetrics = () => (
  <div className="row mb-3">
    <div className="col-12 col-md-4">
      <div className="card text-white bg-primary mb-3 metric-card">
        <div className="card-body">
          <h5 className="card-title">Total Users</h5>
          <p className="card-text display-4">1234</p>
        </div>
      </div>
    </div>
    <div className="col-12 col-md-4">
      <div className="card text-white bg-success mb-3 metric-card">
        <div className="card-body">
          <h5 className="card-title">On-site Users</h5>
          <p className="card-text display-4">567</p>
        </div>
      </div>
    </div>
    <div className="col-12 col-md-4">
      <div className="card text-white bg-info mb-3 metric-card">
        <div className="card-body">
          <h5 className="card-title">Remote Users</h5>
          <p className="card-text display-4">345</p>
        </div>
      </div>
    </div>
  </div>
);

export default KeyMetrics;


