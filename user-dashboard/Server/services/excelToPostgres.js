const { Pool } = require('pg');
const readXlsxFile = require('read-excel-file/node');
require('dotenv').config();

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
  console.log('Fetched existing data for year:', year);
  return result.rows;
}

function filterDuplicates(existingData, newData) {
  const existingDataSet = new Set(existingData.map(item => JSON.stringify(Object.values(item).slice(0, -1)))); // Exclude the year from the comparison
  const filteredData = newData.filter(row => {
    const completeRow = row.concat(new Array(29 - row.length).fill(null)); // Assuming 29 columns
    const rowStr = JSON.stringify(completeRow);
    return !existingDataSet.has(rowStr);
  });
  console.log('Filtered data length:', filteredData.length);
  return filteredData;
}

async function processExcelFile(filePath, year) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const rows = await readXlsxFile(filePath);
    console.log('Rows read from Excel:', rows.length);

    // Skip the header row if there is one
    const data = rows.slice(1);
    console.log('Data length after skipping header:', data.length);

    if (data.length === 0) {
      console.log('No data found in the Excel file');
      await client.query('ROLLBACK');
      return { message: 'No data found in the Excel file' };
    }

    // Fetch existing data for the given year
    const existingData = await getExistingDataForYear(year);
    console.log('Existing data length:', existingData.length);

    // Filter out duplicates
    const filteredData = filterDuplicates(existingData, data);

    if (filteredData.length === 0) {
      console.log('No new data to insert (all duplicates were filtered out)');
      await client.query('ROLLBACK');
      return { message: 'No new data to insert (all duplicates were filtered out)' };
    }

    const numColumns = 29; // 29 columns in the file plus 1 for the year
    const totalColumns = numColumns + 1; // Total columns including the year

    // Construct the insert query with correct placeholders
    const insertQuery = `
      INSERT INTO google_sheets_data (
        col1, col2, col3, col4, col5, col6, col7, col8, col9, col10,
        col11, col12, col13, col14, col15, col16, col17, col18, col19, col20,
        col21, col22, col23, col24, col25, col26, col27, col28, col29, year
      ) VALUES `;

    const values = filteredData.map((row, i) => {
      const completeRow = row.concat(new Array(Math.max(numColumns - row.length, 0)).fill(null)).concat(year);
      return `(${completeRow.map((_, j) => `$${i * totalColumns + j + 1}`).join(', ')})`;
    }).join(', ');

    const flattenedData = filteredData.reduce((acc, row) => {
      const completeRow = row.concat(new Array(Math.max(numColumns - row.length, 0)).fill(null)).concat(year);
      return acc.concat(completeRow);
    }, []);

    console.log('Flattened Data Length:', flattenedData.length);
    console.log('Expected Columns:', totalColumns * filteredData.length);

    // Add the values placeholders correctly
    await client.query(insertQuery + values, flattenedData);
    await client.query('COMMIT');
    return { message: 'Data inserted successfully' };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing Excel file and inserting data into PostgreSQL:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  processExcelFile,
};




