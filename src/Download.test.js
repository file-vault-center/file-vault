// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { render, screen } from '@testing-library/react';
import Download from './Download';

describe('Download', () => {
  it('renders download component with correct content', () => {
    render(<Download />);
    
    expect(screen.getByText('Download Files')).toBeInTheDocument();
    expect(screen.getByText(/This page is under construction/i)).toBeInTheDocument();
    expect(screen.getByText(/Functionality to download files will be available soon/i)).toBeInTheDocument();
  });

  it('has proper heading structure', () => {
    render(<Download />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Download Files');
  });

  it('displays construction message', () => {
    render(<Download />);
    
    const message = screen.getByText(/under construction/i);
    expect(message).toBeInTheDocument();
    expect(message.tagName).toBe('P');
  });
}); 