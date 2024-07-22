require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
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
    console.error('Database connection error', err.stack);
  } else {
    console.log('Database connected');
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/total-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as totalUsers FROM project_users');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying the database');
  }
});

app.get('/api/on-site-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as onSiteUsers FROM project_users WHERE user_type = \'on-site\'');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying the database');
  }
});

app.get('/api/remote-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as remoteUsers FROM project_users WHERE user_type = \'remote\'');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error querying the database');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
