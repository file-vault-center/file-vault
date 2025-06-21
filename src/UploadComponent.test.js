// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { render, screen, fireEvent } from '@testing-library/react';
import UploadComponent from './UploadComponent';

// Mock SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  Toast: jest.fn(),
}));

// Mock tus-js-client
jest.mock('tus-js-client', () => ({
  Upload: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    resume: jest.fn(),
    abort: jest.fn(),
  })),
}));

describe('UploadComponent', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the main upload form elements', () => {
    render(<UploadComponent />);

    expect(screen.getByText('Resumable File Upload')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter metadata/i)).toBeInTheDocument();
    expect(screen.getByText('Chunk Size:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start upload/i })).toBeInTheDocument();
  });

  it('allows file selection', () => {
    render(<UploadComponent />);
    
    const fileInput = screen.getByRole('button', { name: /start upload/i }).parentElement.querySelector('input[type="file"]');
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // The file input should now have a file selected
    expect(fileInput.files[0]).toBe(file);
  });

  it('allows metadata input', () => {
    render(<UploadComponent />);
    
    const metadataInput = screen.getByPlaceholderText(/enter metadata/i);
    fireEvent.change(metadataInput, { target: { value: 'Test metadata' } });
    
    expect(metadataInput.value).toBe('Test metadata');
  });

  it('allows chunk size adjustment', () => {
    render(<UploadComponent />);
    
    const chunkSizeSelect = screen.getByRole('combobox');
    fireEvent.change(chunkSizeSelect, { target: { value: '10MB' } });
    
    expect(chunkSizeSelect.value).toBe('10MB');
  });

  it('shows upload button as disabled when no file is selected', () => {
    render(<UploadComponent />);
    
    const uploadButton = screen.getByRole('button', { name: /start upload/i });
    expect(uploadButton).toBeDisabled();
  });

  it('enables upload button when file is selected', () => {
    render(<UploadComponent />);
    
    const fileInput = screen.getByRole('button', { name: /start upload/i }).parentElement.querySelector('input[type="file"]');
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const uploadButton = screen.getByRole('button', { name: /start upload/i });
    expect(uploadButton).not.toBeDisabled();
  });

  it('shows custom chunk size input when "Other" is selected', () => {
    render(<UploadComponent />);
    
    const chunkSizeSelect = screen.getByRole('combobox');
    fireEvent.change(chunkSizeSelect, { target: { value: 'Other' } });
    
    expect(screen.getByPlaceholderText(/enter chunk size in bytes/i)).toBeInTheDocument();
  });

  it('allows custom chunk size input', () => {
    render(<UploadComponent />);
    
    const chunkSizeSelect = screen.getByRole('combobox');
    fireEvent.change(chunkSizeSelect, { target: { value: 'Other' } });
    
    const customChunkInput = screen.getByPlaceholderText(/enter chunk size in bytes/i);
    fireEvent.change(customChunkInput, { target: { value: '1048576' } });
    
    expect(customChunkInput.value).toBe('1048576');
  });

  it('displays file input element', () => {
    render(<UploadComponent />);
    
    const fileInput = screen.getByRole('button', { name: /start upload/i }).parentElement.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput.type).toBe('file');
  });

  it('displays metadata textarea', () => {
    render(<UploadComponent />);
    
    const metadataInput = screen.getByPlaceholderText(/enter metadata/i);
    expect(metadataInput.tagName).toBe('TEXTAREA');
  });

  it('displays chunk size selector with options', () => {
    render(<UploadComponent />);
    
    const chunkSizeSelect = screen.getByRole('combobox');
    expect(chunkSizeSelect).toBeInTheDocument();
    
    // Check that the expected options are present
    expect(screen.getByText('5MB')).toBeInTheDocument();
    expect(screen.getByText('10MB')).toBeInTheDocument();
    expect(screen.getByText('20MB')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });
}); 