// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { useState, useRef, useEffect } from 'react';
import { Upload } from 'tus-js-client';
import Swal from 'sweetalert2';
import './UploadComponent.css';

const TUS_ENDPOINT = 'https://tusd.tusdemo.net/files/';

// Utility functions
const getTusIdFromUrl = url => (url ? url.split('/').pop() : '');
const formatSpeed = bytesPerSec => {
  if (!bytesPerSec) {
    return '-';
  }
  if (bytesPerSec > 1024 * 1024) {
    return `${(bytesPerSec / (1024 * 1024)).toFixed(2)} MB/s`;
  }
  if (bytesPerSec > 1024) {
    return `${(bytesPerSec / 1024).toFixed(2)} KB/s`;
  }
  return `${bytesPerSec.toFixed(2)} B/s`;
};
const formatBytes = bytes => {
  if (bytes > 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (bytes > 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${bytes} B`;
};
const getFileExtension = filename => filename.split('.').pop().toLowerCase();

const downloadIcon = () => '<svg xmlns=\'http://www.w3.org/2000/svg\' height=\'22\' width=\'22\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'#1976d2\' strokeWidth=\'2\' strokeLinecap=\'round\' strokeLinejoin=\'round\' style=\'vertical-align:middle;\'><path d=\'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\'/><polyline points=\'7 10 12 15 17 10\'/><line x1=\'12\' y1=\'15\' x2=\'12\' y2=\'3\'/></svg>';

const UploadComponent = () => {
  // State management
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(null);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadName, setDownloadName] = useState('');
  const [downloadSize, setDownloadSize] = useState(0);
  const [chunkSize, setChunkSize] = useState('5MB');
  const [customChunkSize, setCustomChunkSize] = useState('');

  // Refs for performance optimization
  const uploadRef = useRef(null);
  const lastBytesRef = useRef(0);
  const lastTimeRef = useRef(null);
  const lastNonNullSpeedRef = useRef(null);
  const timerInterval = useRef(null);
  const uploadStartTimeRef = useRef(null);

  // Timer effect for upload progress tracking
  useEffect(() => {
    if (timerActive) {
      timerInterval.current = setInterval(() => {
        if (uploadStartTimeRef.current) {
          const seconds = Math.round((Date.now() - uploadStartTimeRef.current) / 1000);
          setElapsed(seconds);
        }
      }, 1000);
    } else if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    return () => timerInterval.current && clearInterval(timerInterval.current);
  }, [timerActive]);

  // Parse metadata as key:value pairs
  const parseMetadata = () => {
    const meta = {};
    metadata.split('\n').forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length > 0) {
        meta[key.trim()] = rest.join(':').trim();
      }
    });
    if (file && file.name) {
      meta.filename = file.name;
    }
    return meta;
  };

  // Convert chunk size selection to bytes
  const getChunkSizeInBytes = () => {
    if (chunkSize === 'Other') {
      return parseInt(customChunkSize, 10) || 5 * 1024 * 1024;
    }
    const sizeMap = {
      '5MB': 5 * 1024 * 1024,
      '10MB': 10 * 1024 * 1024,
      '20MB': 20 * 1024 * 1024,
    };
    return sizeMap[chunkSize] || 5 * 1024 * 1024;
  };

  // Handle file upload with tus protocol
  const handleUpload = async () => {
    try {
      setError('');
      setElapsed(0);
      setSpeed(null);
      setUploadedBytes(0);
      setTotalBytes(0);
      setProgress(0);
      lastNonNullSpeedRef.current = null;
      setDownloadUrl('');
      setDownloadName('');
      setDownloadSize(0);

      if (!file) {
        await Swal.fire({
          icon: 'warning',
          title: 'No File Selected',
          text: 'Please select file for upload.',
          confirmButtonText: 'OK',
        });
        return;
      }

      setUploading(true);
      setPaused(false);
      lastBytesRef.current = 0;
      lastTimeRef.current = Date.now();
      uploadStartTimeRef.current = Date.now();
      setTimerActive(true);

      const upload = new Upload(file, {
        endpoint: TUS_ENDPOINT,
        metadata: parseMetadata(),
        chunkSize: getChunkSizeInBytes(),
        onError: uploadError => {
          setError(`Upload failed: ${uploadError}`);
          setUploading(false);
          setTimerActive(false);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          setProgress(Math.round((bytesUploaded / bytesTotal) * 100));
          setUploadedBytes(bytesUploaded);
          setTotalBytes(bytesTotal);

          // Calculate upload speed
          const now = Date.now();
          const deltaBytes = bytesUploaded - lastBytesRef.current;
          const deltaTime = (now - lastTimeRef.current) / 1000;
          if (deltaTime > 0.5) {
            const currentSpeed = deltaBytes / deltaTime;
            setSpeed(currentSpeed);
            if (currentSpeed > 0) {
              lastNonNullSpeedRef.current = currentSpeed;
            }
            lastBytesRef.current = bytesUploaded;
            lastTimeRef.current = now;
          }
        },
        onSuccess: () => {
          setUploading(false);
          setPaused(false);
          setTimerActive(false);
          setDownloadUrl(upload.url);
          setDownloadName(file.name);
          setDownloadSize(file.size);
          const finalSpeed = lastNonNullSpeedRef.current;
          const timeTaken = uploadStartTimeRef.current
            ? Math.round((Date.now() - uploadStartTimeRef.current) / 1000)
            : elapsed;
          const successMsg = `<div style='text-align:left;font-size:1em;'>Doc-ID: ${getTusIdFromUrl(
            upload.url,
          )}<br/>N/W Speed: ${formatSpeed(finalSpeed)}<br/>Time taken: ${timeTaken} seconds</div>`;
          Swal.fire({
            icon: 'success',
            title: 'File upload successfully',
            html: successMsg,
          });
        },
      });
      uploadRef.current = upload;
      upload.start();
    } catch (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setUploading(false);
      setTimerActive(false);
    }
  };

  // Handle pause/resume upload functionality
  const handlePauseResume = async () => {
    if (!uploadRef.current) {
      return;
    }

    if (paused) {
      const result = await Swal.fire({
        title: 'Resume Upload?',
        text: 'Do you want to continue upload?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, resume',
        cancelButtonText: 'No',
      });
      if (result.isConfirmed) {
        setPaused(false);
        setTimerActive(true);
        uploadRef.current.start();
      }
    } else {
      const result = await Swal.fire({
        title: 'Pause Upload?',
        text: 'Are you sure you want to abort the upload?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, pause',
        cancelButtonText: 'No',
      });
      if (result.isConfirmed) {
        setPaused(true);
        setTimerActive(false);
        uploadRef.current.abort();
      }
    }
  };

  // Handle file download and preview with progress tracking
  const handleDownloadAndPreview = async () => {
    if (!downloadUrl) {
      return;
    }

    let total = 0;
    let downloaded = 0;
    let speed = 0;
    const startTime = Date.now();
    const abortController = new AbortController();

    const progressBar = p => (
      `<div style='width:100%;background:#eee;border-radius:4px;height:18px;'>
        <div style='background:#1976d2;height:100%;width:${p}%;
        border-radius:4px;transition:width 0.1s;'></div>
      </div>`
    );

    const stats = () => {
      const downloadedStr = formatBytes(downloaded);
      const totalStr = formatBytes(total);
      const percent = total ? ((downloaded / total) * 100).toFixed(2) : 0;
      const speedStr = formatSpeed(speed);
      const elapsedStr = Math.round((Date.now() - startTime) / 1000);
      return (
        `<div style='color:#888;font-size:0.9em;margin-top:4px;'>
          Downloaded ${downloadedStr} of ${totalStr} (${percent}%)<br/>
          N/W Speed: ${speedStr} | Time elapsed: ${elapsedStr}s
        </div>`
      );
    };

    // Download function with progress tracking
    const startDownload = async (startByte = 0) => {
      const response = await fetch(downloadUrl, {
        headers: { Range: `bytes=${startByte}-` },
        signal: abortController.signal,
      });

      if (startByte === 0) {
        total = parseInt(response.headers.get('content-length') || '0', 10);
      }

      const reader = response.body.getReader();
      let lastDownloaded = startByte;
      let lastTime = Date.now();
      const chunks = [];

      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          chunks.push(value);
          downloaded += value.length;
          const percent = total ? (downloaded / total) * 100 : 0;
          const now = Date.now();
          const dt = (now - lastTime) / 1000;
          if (dt > 0.2) {
            speed = (downloaded - lastDownloaded) / dt;
            lastDownloaded = downloaded;
            lastTime = now;
          }
          Swal.update({ html: progressBar(percent) + stats() });
        } catch (downloadError) {
          if (downloadError.name === 'AbortError') {
            break;
          }
          throw downloadError;
        }
      }
      return chunks;
    };

    try {
      Swal.fire({
        title: 'File Downloading...',
        html: progressBar(0) + stats(),
        allowOutsideClick: false,
        showConfirmButton: false,
        showCloseButton: true,
        width: '90vw',
        customClass: { popup: 'swal2-file-preview-popup' },
      });

      const allChunks = await startDownload();
      const blob = new Blob(allChunks);

      // Generate preview based on file type
      const ext = getFileExtension(downloadName);
      let contentHtml = '';
      const fileUrl = URL.createObjectURL(blob);

      if (ext === 'txt') {
        const text = await blob.text();
        contentHtml
          = `<pre style='max-height:400px;overflow:auto;text-align:left;'>${
            text.replace(/</g, '&lt;')
          }</pre>`;
      } else if (ext === 'pdf') {
        contentHtml = `<iframe src='${fileUrl}' width='100%' height='400px' style='border:none;'></iframe>`;
      } else if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext)) {
        contentHtml = `<img src='${fileUrl}' alt='${downloadName}' 
          style='max-width:100%;max-height:400px;' />`;
      } else {
        contentHtml = '<div style=\'color:#888;\'>'
          + 'Preview not supported. Please download the file to view.</div>';
      }

      // eslint-disable-next-line max-len
      const titleHtml = `<div style='display:flex;align-items:center;justify-content:space-between;width:100%'><span style='flex:1;text-align:left;'>${downloadName}</span><a href='${fileUrl}' download='${downloadName}' title='Download' style='margin-left:8px;display:inline-block;'>${downloadIcon()}</a></div>`;

      Swal.fire({
        title: titleHtml,
        html: `<div style='position:relative;max-width:100vw;'>${contentHtml}</div>`,
        width: '90vw',
        customClass: { popup: 'swal2-file-preview-popup' },
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        Swal.fire({ icon: 'error', title: 'Failed to load file', text: err.message });
      }
    }
  };

  const downloadLabel = (downloadName && downloadSize)
    ? `Download ${downloadName} (${formatBytes(downloadSize)})`
    : '';

  return (
    <div className="upload-container">
      <h2>Resumable File Upload</h2>

      {downloadUrl && downloadName && downloadSize > 0 && (
        <div style={{ marginBottom: 16, color: '#1976d2', fontWeight: 500 }}>
          <button
            type="button"
            onClick={handleDownloadAndPreview}
            style={{
              color: '#1976d2',
              textDecoration: 'underline',
              fontSize: '1em',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {downloadLabel}
          </button>
        </div>
      )}

      <textarea
        placeholder="Enter metadata as key:value per line (e.g. author: John Doe)"
        value={metadata}
        onChange={e => setMetadata(e.target.value)}
        className="metadata-input"
      />

      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
        className="file-input"
      />

      <div className="chunk-size-container">
        <span className="chunk-size-label">Chunk Size:</span>
        <select
          value={chunkSize}
          onChange={e => setChunkSize(e.target.value)}
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '0.9em',
          }}
        >
          <option value="5MB">5MB</option>
          <option value="10MB">10MB</option>
          <option value="20MB">20MB</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {chunkSize === 'Other' && (
        <div style={{ marginBottom: 10 }}>
          <input
            type="number"
            placeholder="Enter chunk size in bytes"
            value={customChunkSize}
            onChange={e => setCustomChunkSize(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '0.9em',
            }}
          />
          <small style={{ color: '#666', fontSize: '0.8em' }}>
            Enter size in bytes (e.g., 1048576 for 1MB)
          </small>
        </div>
      )}

      <button onClick={handleUpload} className="upload-btn" disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Start Upload'}
      </button>

      {uploading && (
        <>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
            <span>{progress}%</span>
          </div>
          <div style={{ color: '#888', fontSize: '0.9em', marginTop: 2, marginBottom: 2 }}>
            Uploaded {formatBytes(uploadedBytes)} of {formatBytes(totalBytes)} (
            {progress.toFixed(2)}%)
          </div>
          <div style={{ color: '#888', fontSize: '0.9em', marginTop: 0, marginBottom: 8 }}>
            N/W Speed: {formatSpeed(speed)} &nbsp;|&nbsp; Time elapsed: {elapsed} seconds
          </div>
          <button
            onClick={handlePauseResume}
            className="upload-btn"
            style={{ backgroundColor: paused ? '#1976d2' : '#fbc02d', color: '#fff' }}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </>
      )}

      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

export default UploadComponent;
