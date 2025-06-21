// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { render, screen } from '@testing-library/react';
import VersionRollback from './VersionRollback';

describe('VersionRollback', () => {
  it('renders version rollback component with correct content', () => {
    render(<VersionRollback />);
    
    expect(screen.getByText('Version Rollback')).toBeInTheDocument();
    expect(screen.getByText(/This page is under construction/i)).toBeInTheDocument();
    expect(screen.getByText(/Functionality for version rollback will be available soon/i)).toBeInTheDocument();
  });

  it('has proper heading structure', () => {
    render(<VersionRollback />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Version Rollback');
  });

  it('displays construction message', () => {
    render(<VersionRollback />);
    
    const message = screen.getByText(/under construction/i);
    expect(message).toBeInTheDocument();
    expect(message.tagName).toBe('P');
  });
}); 