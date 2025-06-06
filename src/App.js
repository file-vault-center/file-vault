import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import UploadComponent from "./UploadComponent";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000); // Show loader for 5 secs
  }, []);

  return (
    <div className="App">
      {loading ? (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>File Vault is reloading...</p>
        </header>
      ) : (
        <div className="Main-body">
          <h1 className="left-align">File Vault</h1>
          <UploadComponent />
        </div>
      )}
    </div>
  );
}

export default App;