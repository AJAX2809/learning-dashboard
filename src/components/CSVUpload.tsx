import { useState, useCallback } from 'react';
import './CSVUpload.css';

interface CSVUploadProps {
  onFileUpload: (file: File) => void;
}

export default function CSVUpload({ onFileUpload }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setFileName(file.name);
        onFileUpload(file);
      } else {
        alert('Please upload a CSV file');
      }
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="csv-upload-container">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="csv-file-input"
          accept=".csv"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <label htmlFor="csv-file-input" className="upload-label">
          <svg
            className="upload-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="upload-text">
            {fileName ? (
              <>
                <strong>{fileName}</strong>
                <br />
                <span className="upload-subtext">Click to change file</span>
              </>
            ) : (
              <>
                <strong>Drop your CSV file here</strong>
                <br />
                <span className="upload-subtext">or click to browse</span>
              </>
            )}
          </p>
        </label>
      </div>
    </div>
  );
}
