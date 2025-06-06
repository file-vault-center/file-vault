import React, { useState } from "react";
import { Upload } from "tus-js-client";
import axios from "axios";
import "./UploadComponent.css"; // Import CSS for styling

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const [metadata, setMetadata] = useState("");
    const [authToken, setAuthToken] = useState("");

    const handleUpload = () => {
        if (!file || !authToken) {
            alert("Please select a file and provide an auth token.");
            return;
        }

        const upload = new Upload(file, {
            endpoint: "http://localhost:8080/upload",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            metadata: { metadata },
            onError: (error) => console.error("Upload failed:", error),
            onProgress: (bytesUploaded, bytesTotal) => {
                console.log(`Uploaded ${bytesUploaded} of ${bytesTotal} bytes`);
            },
            onSuccess: () => {
                console.log("Upload completed");
                saveMetadata();
            },
        });

        upload.start();
    };

    const saveMetadata = async () => {
        try {
            await axios.post("http://localhost:8080/metadata", {
                metadata,
                authToken,
            });
            console.log("Metadata saved successfully");
        } catch (error) {
            console.error("Error saving metadata:", error);
        }
    };

    return (
        <div className="upload-container">
            <h2>Resumable File Upload</h2>

            <textarea
                placeholder="Enter metadata..."
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                className="metadata-input"
            />

            <input
                type="password"
                placeholder="Enter auth token..."
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                className="auth-input"
            />

            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input"
            />


            <button onClick={handleUpload} className="upload-btn">
                Start Upload
            </button>
        </div>
    );
};

export default UploadComponent;