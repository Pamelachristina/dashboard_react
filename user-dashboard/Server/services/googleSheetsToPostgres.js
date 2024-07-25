// server/services/googleSheetsToPostgres.js
const { google } = require('googleapis');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load service account credentials
const CREDENTIALS_PATH = path.join(__dirname, process.env.GOOGLE_SHEETS_CREDENTIALS_PATH);
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));

// Set up Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const RANGE = 'Sheet1!A1:C10'; // Adjust the range as needed

async function getSheetData() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    return response.data.values;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
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

async function insertDataIntoPostgres(data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertQuery = 'INSERT INTO your_table_name(column1, column2, column3) VALUES($1, $2, $3)';
    for (const row of data) {
      await client.query(insertQuery, row);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting data into PostgreSQL:', error);
  } finally {
    client.release();
  }
}

async function fetchDataAndInsert() {
  const data = await getSheetData();
  console.log('Google Sheets Data:', data);

  if (data) {
    await insertDataIntoPostgres(data);
    console.log('Data inserted into PostgreSQL successfully');
  }
}

module.exports = {
  fetchDataAndInsert,
};

