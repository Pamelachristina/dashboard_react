import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import User from '../components/User';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './UserStats.module.css'; // Ensure you have this CSS module

const UserStats = () => {
  const [institutions, setInstitutions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [year, setYear] = useState(2023); // Default year
  const institutionsPerPage = 10;

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch(`/api/institutions?year=${year}`);
        const data = await response.json();

        // Remove duplicates based on the 'name' property
        const uniqueInstitutions = removeDuplicates(data, 'name');

        setInstitutions(uniqueInstitutions);
      } catch (error) {
        console.error('Error fetching institutions:', error);
      }
    };

    fetchInstitutions();
  }, [year]);

  const removeDuplicates = (array, key) => {
    const seen = new Set();
    return array.filter(item => {
      const keyValue = item[key];
      if (seen.has(keyValue)) {
        return false;
      } else {
        seen.add(keyValue);
        return true;
      }
    });
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const offset = currentPage * institutionsPerPage;
  const currentInstitutions = institutions.slice(offset, offset + institutionsPerPage);
  const pageCount = Math.ceil(institutions.length / institutionsPerPage);

  return (
    <div className="container-fluid">
      <div className= "header" >
        <User />
      </div>
      <div className="main-content mt-4">
        <div className="container-fluid">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className={`card ${styles.fixedCard}`}>
                <div className={`card-body ${styles.scrollableContent}`}>
                  <h5 className="card-title">Universities that are classified as MSI or EPSCoR</h5>
                  <div className="mb-3">
                    <label htmlFor="yearSelector" className="form-label">Select Year:</label>
                    <select
                      id="yearSelector"
                      className="form-select"
                      value={year}
                      onChange={handleYearChange}
                      style={{ width: '100px' }} // Adjust width here
                    >
                      <option value={2022}>2022</option>
                      <option value={2023}>2023</option>
                      <option value={2024}>2024</option>
                      {/* Add more years as needed */}
                    </select>
                  </div>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>MSI</th>
                        <th>EPSCoR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentInstitutions.map((institution, index) => (
                        <tr key={index}>
                          <td>{offset + index + 1}</td>
                          <td>{institution.name}</td>
                          <td>{institution.msi ? '✔️' : '❌'}</td>
                          <td>{institution.epscor ? '✔️' : '❌'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-0">Showing {offset + 1} to {Math.min(offset + institutionsPerPage, institutions.length)} of {institutions.length} entries</p>
                    <ReactPaginate
                      previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`card ${styles.fixedCard}`}>
                <div className={`card-body ${styles.scrollableContent}`}>
                  <h5 className="card-title">Visual of total users breakdown pie chart</h5>
                  <div className="chart-placeholder d-flex justify-content-center align-items-center" style={{ height: '300px', backgroundColor: '#f9f9f9' }}>
                    {/* Insert chart here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className={`card ${styles.fixedCard}`}>
                <div className="card-body">
                  <h5 className="card-title">Placeholder 1</h5>
                  <div className="chart-placeholder d-flex justify-content-center align-items-center" style={{ height: '300px', backgroundColor: '#f9f9f9' }}>
                    {/* Insert content here */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`card ${styles.fixedCard}`}>
                <div className="card-body">
                  <h5 className="card-title">Placeholder 2</h5>
                  <div className="chart-placeholder d-flex justify-content-center align-items-center" style={{ height: '300px', backgroundColor: '#f9f9f9' }}>
                    {/* Insert content here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;









