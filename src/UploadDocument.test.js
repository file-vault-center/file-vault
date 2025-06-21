// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { render, screen } from '@testing-library/react';
import UploadDocument from './UploadDocument';

describe('UploadDocument', () => {
  it('renders upload document component with correct content', () => {
    render(<UploadDocument />);
    
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
    expect(screen.getByText(/This page is under construction/i)).toBeInTheDocument();
    expect(screen.getByText(/Functionality to upload documents will be available soon/i)).toBeInTheDocument();
  });

  it('has proper heading structure', () => {
    render(<UploadDocument />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Upload Document');
  });

  it('displays construction message', () => {
    render(<UploadDocument />);
    
    const message = screen.getByText(/under construction/i);
    expect(message).toBeInTheDocument();
    expect(message.tagName).toBe('P');
  });
}); 