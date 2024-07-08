import React from 'react';
import './App.css'; // Ensure this path is correct
import SideBar from './components/SideBar';
import MainContent from './components/MainContent';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="app-container">
      <SideBar />
      <MainContent />
    </div>
  );
}

export default App;





