import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import User from '../components/User';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './UserStats.module.css'; // Ensure you have this CSS module

const UserStats = () => {
  const [institutions, setInstitutions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [year, setYear] = useState(2023); // Default year
  const [error, setError] = useState(null);
  const institutionsPerPage = 10;

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        console.log(`Fetching institutions for year: ${year}`);
        const response = await fetch(`/api/institutions?year=${year}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch institutions');
        }

        const data = await response.json();

        // Remove duplicates based on the 'name' property
        const uniqueInstitutions = removeDuplicates(data, 'name');

        if (uniqueInstitutions.length === 0) {
          setError('No data available for the selected year.');
          setInstitutions([]);
        } else {
          setError(null);
          setInstitutions(uniqueInstitutions);
        }
      } catch (error) {
        console.error('Error fetching institutions:', error);
        setError(error.message);
        setInstitutions([]); // Clear the institutions state if there's an error
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
    console.log(`Year changed to: ${event.target.value}`);
    setYear(event.target.value);
    setCurrentPage(0); // Reset to the first page when the year changes
  };

  const offset = currentPage * institutionsPerPage;
  const currentInstitutions = institutions.slice(offset, offset + institutionsPerPage);
  const pageCount = Math.ceil(institutions.length / institutionsPerPage);

  return (
    <div className="container-fluid">
      <div className="header">
        <User />
      </div>
      <div className="main-content mt-4">
        <div className="container-fluid">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className={`card ${styles.fixedCard}`}>
                <div className={`card-body ${styles.scrollableContent}`}>
                  <h5 className="card-title">Universities that are classified as MSI, EPSCoR, or ERI</h5>
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
                  {error && <div className="alert alert-danger">{error}</div>}
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th className={styles['center-text']}>MSI</th>
                        <th className={styles['center-text']}>EPSCoR</th>
                        <th className={styles['center-text']}>ERI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentInstitutions.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">No data available</td>
                        </tr>
                      ) : (
                        currentInstitutions.map((institution, index) => (
                          <tr key={index}>
                            <td>{offset + index + 1}</td>
                            <td>{institution.name}</td>
                            <td className={styles['center-text']}>{institution.msi ? '✔️' : '❌'}</td>
                            <td className={styles['center-text']}>{institution.epscor ? '✔️' : '❌'}</td>
                            <td className={styles['center-text']}>{institution.eri ? '✔️' : '❌'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <div className={styles['pagination-container']}>
                    <p className={`mb-0 ${styles['entries-info']}`}>Showing {offset + 1} to {Math.min(offset + institutionsPerPage, institutions.length)} of {institutions.length} entries</p>
                    <ReactPaginate
                      previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={'...'}
                      breakClassName={'break-me'}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageClick}
                      containerClassName={styles['pagination']}
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
















