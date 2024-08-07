// services/duplicateChecker.js
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function getExistingDataForYear(year) {
  const query = 'SELECT * FROM google_sheets_data WHERE year = $1';
  const values = [year];
  const result = await pool.query(query, values);
  return result.rows;
}

function filterDuplicates(existingData, newData) {
  const existingDataSet = new Set(existingData.map(item => JSON.stringify(item)));
  const filteredData = newData.filter(item => !existingDataSet.has(JSON.stringify(item)));
  return filteredData;
}

module.exports = { getExistingDataForYear, filterDuplicates };
