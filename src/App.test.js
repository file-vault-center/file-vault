// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock SweetAlert2 to prevent CSS injection issues
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  Toast: jest.fn(),
}));

// Mock the components that are rendered by the router
jest.mock('./UploadComponent', () => () => <div>UploadComponent</div>);
jest.mock('./Download', () => () => <div>Download</div>);
jest.mock('./UploadMetadata', () => () => <div>UploadMetadata</div>);
jest.mock('./UploadDocument', () => () => <div>UploadDocument</div>);
jest.mock('./SoftDelete', () => () => <div>SoftDelete</div>);
jest.mock('./VersionRollback', () => () => <div>VersionRollback</div>);

describe('App', () => {
  it('renders the loading screen and then the main app', async () => {
    render(<App />);

    // Initially, the loader should be visible
    expect(screen.getByText(/loading file vault/i)).toBeInTheDocument();

    // Wait for the loading timeout to complete and the main content to appear
    await waitFor(() => {
      expect(screen.getByText('File Vault')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('UploadComponent')).toBeInTheDocument();

    // Wait a bit more for the loader to disappear
    await waitFor(() => {
      expect(screen.queryByText(/loading file vault/i)).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('renders navigation links', async () => {
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('File Vault')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Check that navigation elements are present
    expect(screen.getByText('Generate Token')).toBeInTheDocument();
  });
});
