// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { render, screen } from '@testing-library/react';
import SoftDelete from './SoftDelete';

describe('SoftDelete', () => {
  it('renders soft delete component with correct content', () => {
    render(<SoftDelete />);
    
    expect(screen.getByText('Soft Delete')).toBeInTheDocument();
    expect(screen.getByText(/This page is under construction/i)).toBeInTheDocument();
    expect(screen.getByText(/Functionality for soft deletion will be available soon/i)).toBeInTheDocument();
  });

  it('has proper heading structure', () => {
    render(<SoftDelete />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Soft Delete');
  });

  it('displays construction message', () => {
    render(<SoftDelete />);
    
    const message = screen.getByText(/under construction/i);
    expect(message).toBeInTheDocument();
    expect(message.tagName).toBe('P');
  });
}); 