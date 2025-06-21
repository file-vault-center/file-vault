// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock SweetAlert2 to prevent CSS injection issues
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  Toast: jest.fn(),
}));

// Mock the components that are rendered by the router
jest.mock('./UploadComponent', () => {
  const MockUploadComponent = () => <div>UploadComponent</div>;
  MockUploadComponent.displayName = 'MockUploadComponent';
  return MockUploadComponent;
});
jest.mock('./Download', () => {
  const MockDownload = () => <div>Download</div>;
  MockDownload.displayName = 'MockDownload';
  return MockDownload;
});
jest.mock('./UploadMetadata', () => {
  const MockUploadMetadata = () => <div>UploadMetadata</div>;
  MockUploadMetadata.displayName = 'MockUploadMetadata';
  return MockUploadMetadata;
});
jest.mock('./UploadDocument', () => {
  const MockUploadDocument = () => <div>UploadDocument</div>;
  MockUploadDocument.displayName = 'MockUploadDocument';
  return MockUploadDocument;
});
jest.mock('./SoftDelete', () => {
  const MockSoftDelete = () => <div>SoftDelete</div>;
  MockSoftDelete.displayName = 'MockSoftDelete';
  return MockSoftDelete;
});
jest.mock('./VersionRollback', () => {
  const MockVersionRollback = () => <div>VersionRollback</div>;
  MockVersionRollback.displayName = 'MockVersionRollback';
  return MockVersionRollback;
});

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the loading screen and then the main app', async () => {
    render(<App />);

    // Initially, the loader should be visible
    expect(screen.getByText(/loading file vault/i)).toBeInTheDocument();

    // Fast-forward time to trigger the loading timeout
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Wait for the loading timeout to complete and the main content to appear
    await waitFor(() => {
      expect(screen.getByText('File Vault')).toBeInTheDocument();
    });

    expect(screen.getByText('UploadComponent')).toBeInTheDocument();

    // The loader should now be gone
    expect(screen.queryByText(/loading file vault/i)).not.toBeInTheDocument();
  });

  it('renders navigation links', async () => {
    render(<App />);

    // Fast-forward time to trigger the loading timeout
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('File Vault')).toBeInTheDocument();
    });

    // Check that navigation elements are present
    expect(screen.getByText('Generate Token')).toBeInTheDocument();
  });
});
