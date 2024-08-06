require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { fetchDataAndInsert } = require('./services/googleSheetsToPostgres');
const { processExcelFile } = require('./services/excelToPostgres');
const { Pool } = require('pg');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// PostgreSQL Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to fetch data from Google Sheets and insert into Postgres
app.post('/api/fetch-and-insert', async (req, res) => {
  const { spreadsheetId, year } = req.body;
  try {
    console.log('Received request to fetch and insert Google Sheets data:', { spreadsheetId, year });
    await fetchDataAndInsert(spreadsheetId, year);
    res.status(200).json({ message: 'Google Sheets data fetched and inserted successfully' });
  } catch (error) {
    console.error('Error fetching and inserting Google Sheets data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
});

// Route to fetch data from Google Sheets and insert into Postgres
app.post('/api/fetch-and-insert', async (req, res) => {
  const { spreadsheetId, year } = req.body;
  try {
    console.log('Received request to fetch and insert Google Sheets data:', { spreadsheetId, year });
    const result = await fetchDataAndInsert(spreadsheetId, year);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching and inserting Google Sheets data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
});


// Route to upload Excel file and insert data into Postgres
app.post('/api/upload-excel', upload.single('file'), async (req, res) => {
  const { year } = req.body;
  const file = req.file;
  try {
    console.log('Received request to upload and insert Excel data:', { year, file });
    if (!file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = path.join(__dirname, 'uploads', file.filename);
    console.log('File path:', filePath);
    const result = await processExcelFile(filePath, year);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error uploading and inserting Excel data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
});


// Route to get total users for a specific year
app.get('/api/total-users', async (req, res) => {
  const { year } = req.query;
  try {
    console.log('Request to get total users for year:', year);
    const result = await pool.query(`
      SELECT COUNT(*) as totalUsers 
      FROM google_sheets_data 
      WHERE year = $1
    `, [year]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error querying total users:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get on-site users for a specific year
app.get('/api/on-site-users', async (req, res) => {
  const { year } = req.query;
  try {
    console.log('Request to get on-site users for year:', year);
    const result = await pool.query(`
      SELECT COUNT(*) as onSiteUsers 
      FROM google_sheets_data 
      WHERE year = $1 AND col2 = 'On-site'
    `, [year]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error querying on-site users:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get remote users for a specific year
app.get('/api/remote-users', async (req, res) => {
  const { year } = req.query;
  try {
    console.log('Request to get remote users for year:', year);
    const result = await pool.query(`
      SELECT COUNT(*) as remoteUsers 
      FROM google_sheets_data 
      WHERE year = $1 AND col2 = 'Remote'
    `, [year]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error querying remote users:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get the total number of proposals submitted for a specific year
app.get('/api/total-proposals', async (req, res) => {
  const { year } = req.query;
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as totalProposals 
       FROM public.proposal 
       WHERE (proposal_cycle = $1 OR proposal_cycle = $2)`,
      [`${year}-a`, `${year}-b`]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error querying total proposals:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get the number of accepted proposals for a specific year
app.get('/api/accepted-proposals', async (req, res) => {
  const { year } = req.query;
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as acceptedProposals 
       FROM public.proposal 
       WHERE (proposal_cycle = $1 OR proposal_cycle = $2) 
       AND status IN ('ACTIVE', 'COMPLETED', 'PENDING', 'ACTIVATION', 'WITHDRAWN')`,
      [`${year}-a`, `${year}-b`]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error querying accepted proposals:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get minority institutions for a specific year
app.get('/api/minority-institutions', async (req, res) => {
  const { year } = req.query;
  try {
    console.log('Request to get minority institutions for year:', year);
    const result = await pool.query(`
      SELECT COUNT(*) as minorityinstitutions 
      FROM google_sheets_data 
      WHERE year = $1 AND col11 = 'Yes'
    `, [year]);
    console.log('Minority institutions result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error querying minority institutions:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get state data (minority institutions and EPSCoR) for a specific year
app.get('/api/state-data', async (req, res) => {
  const { year } = req.query;
  try {
    console.log('Request to get state data for year:', year);
    const result = await pool.query(`
      SELECT col9 AS state, 
             SUM(CASE WHEN col11 = 'Yes' THEN 1 ELSE 0 END) AS minorityServingInstitutions, 
             SUM(CASE WHEN col12 = 'Yes' THEN 1 ELSE 0 END) AS EPSCOR
      FROM google_sheets_data 
      WHERE year = $1
      GROUP BY col9
    `, [year]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying state data:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get companies (non-universities) for a specific year
app.get('/api/companies', async (req, res) => {
  const { year } = req.query;
  try {
    console.log('Request to get companies for year:', year);
    const result = await pool.query(`
      SELECT COUNT(DISTINCT col7) AS companies
      FROM google_sheets_data
      WHERE year = $1
        AND col7 NOT LIKE '%University%'
        AND col7 NOT LIKE '%College%'
        AND col7 NOT LIKE '%Institute%'
        AND col7 NOT LIKE '%Academy%'
        AND col7 NOT LIKE '%School%'
        AND col7 NOT LIKE '%Educational%'
        AND col7 NOT LIKE '%Campus%'
        AND col7 NOT LIKE '%Polytechnic%'
        AND col7 NOT LIKE '%High%'
        AND col7 NOT LIKE '%Elementary%'
        AND col7 NOT LIKE '%Middle%'
        AND col7 NOT LIKE '%Academy%'
        AND col7 NOT LIKE '%Politecnico%'
        AND col7 NOT LIKE '%Instituto%'
        AND col7 NOT LIKE '%Universitat%'
        AND col7 NOT LIKE '%Istituto%'
    `, [year]);
    console.log('Companies result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error querying companies:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get states for a specific year
app.get('/api/states', async (req, res) => {
  const { year } = req.query;
  try {
    console.log('Request to get states for year:', year);
    const result = await pool.query(`
      SELECT COUNT(DISTINCT col9) as states 
      FROM google_sheets_data 
      WHERE year = $1
    `, [year]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error querying states:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get the number of countries served for a specific year
app.get('/api/countries-served', async (req, res) => {
  const { year } = req.query;
  try {
    console.log('Request to get countries served for year:', year);
    const result = await pool.query(`
      SELECT COUNT(DISTINCT col14) as countriesServed 
      FROM google_sheets_data 
      WHERE year = $1
    `, [year]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error querying countries served:', err);
    res.status(500).send('Error querying the database');
  }
});

app.get('/api/publications', async (req, res) => {
  const { year } = req.query;
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as publications
      FROM publication
      WHERE 
        CASE 
          WHEN pub_dates ~ '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$' 
          THEN EXTRACT(YEAR FROM TO_DATE(pub_dates, 'MM/DD/YYYY')) = $1
          ELSE FALSE
        END
    `, [year]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error querying publications:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get institutions classified as MSI or EPSCoR for a specific year
app.get('/api/institutions', async (req, res) => {
  const { year } = req.query;
  try {
    console.log('Request to get institutions for year:', year);
    const result = await pool.query(`
      SELECT col7 AS name, 
             col10 = 'Yes' AS emerging_research_institute, 
             col11 = 'Yes' AS msi, 
             col12 = 'Yes' AS epscor 
      FROM google_sheets_data 
      WHERE year = $1 AND (col11 = 'Yes' OR col12 = 'Yes')
    `, [year]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying institutions:', err);
    res.status(500).send('Error querying the database');
  }
});

// Route to get employer type count
app.get('/api/employer-type-count', async (req, res) => {
  const { year } = req.query;
  try {
    const result = await pool.query(`
      SELECT year, col17 AS employer_type, COUNT(*) as user_count
      FROM google_sheets_data
      WHERE year = $1
      GROUP BY year, col17
      ORDER BY year, col17;
    `, [year]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying employer type count:', err);
    res.status(500).send('Error querying the database');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

