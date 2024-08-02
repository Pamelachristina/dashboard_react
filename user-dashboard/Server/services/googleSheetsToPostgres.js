const { google } = require('googleapis');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load service account credentials
const CREDENTIALS_PATH = path.join(__dirname, '..', process.env.GOOGLE_SHEETS_CREDENTIALS_PATH);
console.log('CREDENTIALS_PATH:', CREDENTIALS_PATH); // Log the credentials path
let credentials;
try {
  credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
} catch (error) {
  console.error('Error loading credentials:', error);
  process.exit(1); // Exit the process if credentials cannot be loaded
}

// Set up Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Define the sheet name and range
const SHEET_NAME = "Sheet1"; // Ensure this matches the exact sheet name in Google Sheets
const RANGE = `${SHEET_NAME}!A1:Z1091`; // Define the range

async function getSheetData() {
  console.log('Fetching data from Google Sheets using range:', RANGE); // Log the range
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    console.log('Google Sheets API response:', response.data);
    return response.data.values;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Set up PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function insertDataIntoPostgres(data, year) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update table name and columns
    const insertQuery = `
      INSERT INTO google_sheets_data (
        col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, 
        col11, col12, col13, col14, col15, col16, col17, col18, col19, col20, 
        col21, col22, col23, col24, col25, col26, year
      ) VALUES `;

    const values = data.map((row, i) => {
      // Ensure the row has exactly 26 columns, fill with null if shorter
      const completeRow = row.concat(new Array(26 - row.length).fill(null)).concat(year);
      return `(${completeRow.map((_, j) => `$${i * 27 + j + 1}`).join(', ')})`;
    }).join(', ');

    const flattenedData = data.reduce((acc, row) => {
      return acc.concat(row.concat(new Array(26 - row.length).fill(null)).concat(year));
    }, []);

    await client.query(insertQuery + values, flattenedData);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting data into PostgreSQL:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function fetchDataAndInsert(spreadsheetId, year) {
  try {
    const data = await getSheetData();
    console.log('Google Sheets Data:', data);

    if (data && data.length > 0) {
      await insertDataIntoPostgres(data, year);
      console.log('Data inserted into PostgreSQL successfully');
    } else {
      console.log('No data found in the specified range');
    }
  } catch (error) {
    console.error('Error in fetchDataAndInsert:', error);
    throw error;
  }
}

module.exports = {
  fetchDataAndInsert,
};













