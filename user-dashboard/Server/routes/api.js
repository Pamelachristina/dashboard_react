// server/routes/api.js
const express = require('express');
const { fetchDataAndInsert } = require('../services/googleSheetsToPostgres');
const router = express.Router();

router.get('/fetch-and-insert', async (req, res) => {
  try {
    await fetchDataAndInsert();
    res.status(200).send('Data fetched from Google Sheets and inserted into PostgreSQL successfully');
  } catch (error) {
    console.error('Error in /fetch-and-insert:', error);
    res.status(500).send('Error fetching and inserting data');
  }
});

module.exports = router;
