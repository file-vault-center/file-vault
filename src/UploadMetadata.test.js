// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { render, screen } from '@testing-library/react';
import UploadMetadata from './UploadMetadata';

describe('UploadMetadata', () => {
  it('renders upload metadata component with correct content', () => {
    render(<UploadMetadata />);
    
    expect(screen.getByText('Upload Metadata')).toBeInTheDocument();
    expect(screen.getByText(/This page is under construction/i)).toBeInTheDocument();
    expect(screen.getByText(/Functionality to upload metadata will be available soon/i)).toBeInTheDocument();
  });

  it('has proper heading structure', () => {
    render(<UploadMetadata />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Upload Metadata');
  });

  it('displays construction message', () => {
    render(<UploadMetadata />);
    
    const message = screen.getByText(/under construction/i);
    expect(message).toBeInTheDocument();
    expect(message.tagName).toBe('P');
  });
}); 