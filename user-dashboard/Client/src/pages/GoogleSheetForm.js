import React, { useState, useRef } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner'; // Adjust the import path as necessary

const GoogleSheetForm = () => {
  const initialFormState = {
    spreadsheetId: '',
    sheetYear: '',
    file: null,
    fileYear: ''
  };

  const [formState, setFormState] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // New state for messages
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormState({
      ...formState,
      file: e.target.files[0]
    });
  };

  const handleSheetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); // Clear message before new request
    try {
      const response = await axios.post('/api/fetch-and-insert', {
        spreadsheetId: formState.spreadsheetId,
        year: formState.sheetYear
      });
      console.log('Server response:', response.data);
      setMessage(response.data.message); // Set the message from the server response
      setFormState(initialFormState); // Reset form state
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
    } catch (error) {
      console.error('Error fetching and inserting Google Sheets data:', error);
      setMessage('Error fetching and inserting Google Sheets data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); // Clear message before new request
    const formData = new FormData();
    formData.append('year', formState.fileYear);
    formData.append('file', formState.file);

    console.log('Form Data:', formData); // Log the FormData before sending

    try {
      const response = await axios.post('/api/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Server response:', response.data);
      setMessage(response.data.message); // Set the message from the server response
      setFormState(initialFormState); // Reset form state
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
    } catch (error) {
      console.error('Error uploading and inserting Excel data:', error);
      setMessage('Error uploading and inserting Excel data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        {loading && <Spinner />}
        {message && <div className="alert alert-info">{message}</div>} {/* Display message */}
        <form onSubmit={handleSheetSubmit}>
          <div className="mb-3">
            <label htmlFor="spreadsheetId" className="form-label">Google Sheets URL:</label>
            <input
              type="text"
              className="form-control"
              id="spreadsheetId"
              name="spreadsheetId"
              value={formState.spreadsheetId}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="sheetYear" className="form-label">Year:</label>
            <input
              type="text"
              className="form-control"
              id="sheetYear"
              name="sheetYear"
              value={formState.sheetYear}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            Fetch and Insert Google Sheets Data
          </button>
        </form>

        <form onSubmit={handleFileSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="file" className="form-label">Excel File:</label>
            <input
              type="file"
              className="form-control"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xls,.xlsx"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fileYear" className="form-label">Year:</label>
            <input
              type="text"
              className="form-control"
              id="fileYear"
              name="fileYear"
              value={formState.fileYear}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            Upload and Insert Excel Data
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoogleSheetForm;









