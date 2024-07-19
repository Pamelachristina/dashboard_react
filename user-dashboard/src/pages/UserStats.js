import React from 'react';
import User from '../components/User';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './UserStats.module.css'; // Ensure you have this CSS module

const UserStats = () => (
  <div className="container-fluid">
    <User />
    <div className="main-content mt-4">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-md-6">
            <div className={`card ${styles.fixedCard}`} style={{ borderRadius: 0 }}>
              <div className={`card-body ${styles.scrollableContent}`}>
                <h5 className="card-title">More details about institutions/companies based on fiscal year</h5>
                <p className="card-text">Provide detailed information about institutions or companies based on the fiscal year.</p>
                <img src="institution-image.jpg" alt="Institutions" className="img-fluid" />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`card ${styles.fixedCard}`} style={{ borderRadius: 0 }}>
              <div className={`card-body ${styles.scrollableContent}`}>
                <h5 className="card-title">Name of Uni that is MSI / EPSCoR</h5>
                <p className="card-text">List of universities that are classified as MSI or EPSCoR.</p>
                <ul>
                  <li>University A</li>
                  <li>University B</li>
                  <li>University C</li>
                  <li>University D</li>
                  <li>University E</li>
                  <li>University F</li>
                  <li>University G</li>
                  <li>University H</li>
                  <li>University I</li>
                  <li>University J</li>
                  {/* Add more as needed */}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-6">
            <div className={`card ${styles.fixedCard}`} style={{ borderRadius: 0 }}>
              <div className={`card-body ${styles.scrollableContent}`}>
                <h5 className="card-title">First year? or Returning</h5>
                <p className="card-text">Statistics about first-year and returning users.</p>
                <img src="returning-users.jpg" alt="Returning Users" className="img-fluid" />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`card ${styles.fixedCard}`} style={{ borderRadius: 0 }}>
              <div className={`card-body ${styles.scrollableContent}`}>
                <h5 className="card-title">Number of users from each school</h5>
                <p className="card-text">Number of users from each school.</p>
                <table className="table">
                  <thead>
                    <tr>
                      <th>School</th>
                      <th>Number of Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>School A</td>
                      <td>100</td>
                    </tr>
                    <tr>
                      <td>School B</td>
                      <td>150</td>
                    </tr>
                    <tr>
                      <td>School C</td>
                      <td>200</td>
                    </tr>
                    <tr>
                      <td>School D</td>
                      <td>250</td>
                    </tr>
                    <tr>
                      <td>School E</td>
                      <td>300</td>
                    </tr>
                    {/* Add more rows as needed */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-6">
            <div className={`card ${styles.fixedCard}`} style={{ borderRadius: 0 }}>
              <div className="card-body">
                <h5 className="card-title">Chart 1</h5>
                <div className="chart-placeholder d-flex justify-content-center align-items-center" style={{ height: '300px', backgroundColor: '#f9f9f9' }}>
                  {/* Insert chart here */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`card ${styles.fixedCard}`} style={{ borderRadius: 0 }}>
              <div className="card-body">
                <h5 className="card-title">Chart 2</h5>
                <div className="chart-placeholder d-flex justify-content-center align-items-center" style={{ height: '300px', backgroundColor: '#f9f9f9' }}>
                  {/* Insert chart here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default UserStats;





