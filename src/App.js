// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import logo from './file-vault-center.png';
import UploadComponent from './UploadComponent';
import Download from './Download';
import UploadMetadata from './UploadMetadata';
import UploadDocument from './UploadDocument';
import SoftDelete from './SoftDelete';
import VersionRollback from './VersionRollback';
import Swal from 'sweetalert2';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default is light mode

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleGenerateToken = () => {
    const token = crypto.randomUUID();
    sessionStorage.setItem('authToken', token);
    Swal.fire({
      icon: 'success',
      title: 'Token Generated!',
      text: 'Your session token has been generated and stored.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        {loading && (
          <div className="loader-overlay">
            <img src={logo} className="App-logo" alt="logo" />
            <p>Loading File Vault...</p>
          </div>
        )}
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} onGenerateToken={handleGenerateToken} />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/upload" />} />
            <Route path="/upload" element={<UploadComponent />} />
            <Route path="/download" element={<Download />} />
            <Route path="/upload-metadata" element={<UploadMetadata />} />
            <Route path="/upload-document" element={<UploadDocument />} />
            <Route path="/soft-delete" element={<SoftDelete />} />
            <Route path="/version-rollback" element={<VersionRollback />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
