// src/axiosConfig.js
import axios from 'axios';

// Set up Axios base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Update this URL as necessary
});

export default axiosInstance;
