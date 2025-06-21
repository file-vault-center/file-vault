// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  const mockToggle = jest.fn();
  const mockGenerate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <Router>
        <Navbar isDarkMode={false} toggleDarkMode={mockToggle} onGenerateToken={mockGenerate} />
      </Router>
    );

    expect(screen.getByText('File Vault')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Generate Token')).toBeInTheDocument();
  });

  it('displays navigation links', () => {
    render(
      <Router>
        <Navbar isDarkMode={false} toggleDarkMode={mockToggle} onGenerateToken={mockGenerate} />
      </Router>
    );

    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('Upload Metadata')).toBeInTheDocument();
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
    expect(screen.getByText('Soft Delete')).toBeInTheDocument();
    expect(screen.getByText('Version Rollback')).toBeInTheDocument();
  });

  it('calls toggleDarkMode when dark mode button is clicked', () => {
    render(
      <Router>
        <Navbar isDarkMode={false} toggleDarkMode={mockToggle} onGenerateToken={mockGenerate} />
      </Router>
    );

    const darkModeButton = screen.getByTitle('Switch to Dark Mode');
    fireEvent.click(darkModeButton);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onGenerateToken when generate token button is clicked', () => {
    render(
      <Router>
        <Navbar isDarkMode={false} toggleDarkMode={mockToggle} onGenerateToken={mockGenerate} />
      </Router>
    );

    const tokenButton = screen.getByText('Generate Token');
    fireEvent.click(tokenButton);

    expect(mockGenerate).toHaveBeenCalledTimes(1);
  });

  it('shows correct dark mode button title based on mode', () => {
    const { rerender } = render(
      <Router>
        <Navbar isDarkMode={true} toggleDarkMode={mockToggle} onGenerateToken={mockGenerate} />
      </Router>
    );

    expect(screen.getByTitle('Switch to Light Mode')).toBeInTheDocument();

    rerender(
      <Router>
        <Navbar isDarkMode={false} toggleDarkMode={mockToggle} onGenerateToken={mockGenerate} />
      </Router>
    );

    expect(screen.getByTitle('Switch to Dark Mode')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(
      <Router>
        <Navbar isDarkMode={false} toggleDarkMode={mockToggle} onGenerateToken={mockGenerate} />
      </Router>
    );

    const hamburgerButton = screen.getByLabelText('Toggle navigation');
    fireEvent.click(hamburgerButton);

    // The mobile menu should be visible after clicking
    const navbarCollapse = document.querySelector('.navbar-collapse');
    expect(navbarCollapse).toHaveClass('open');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Router>
        <Navbar isDarkMode={false} toggleDarkMode={mockToggle} onGenerateToken={mockGenerate} />
      </Router>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle navigation')).toBeInTheDocument();
    expect(screen.getByTitle('Switch to Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('Generate Token')).toBeInTheDocument();
  });

  it('closes mobile menu when navigation link is clicked', () => {
    render(
      <Router>
        <Navbar isDarkMode={false} toggleDarkMode={mockToggle} onGenerateToken={mockGenerate} />
      </Router>
    );

    const hamburgerButton = screen.getByLabelText('Toggle navigation');
    fireEvent.click(hamburgerButton);

    // Menu should be open
    const navbarCollapse = document.querySelector('.navbar-collapse');
    expect(navbarCollapse).toHaveClass('open');

    // Click a navigation link
    const uploadLink = screen.getByText('Upload');
    fireEvent.click(uploadLink);

    // Menu should be closed
    expect(navbarCollapse).not.toHaveClass('open');
  });
}); 