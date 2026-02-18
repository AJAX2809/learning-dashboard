import { useState } from 'react';
import CSVUpload from './CSVUpload';
import ChatInterface from './ChatInterface';
import { CSVAnalyzer } from '../utils/csvAnalyzer';
import { QueryProcessor } from '../utils/queryProcessor';
import type { CSVDataset, QueryResult } from '../types/csv';
import './CSVChatbot.css';

export default function CSVChatbot() {
  const [dataset, setDataset] = useState<CSVDataset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryProcessor, setQueryProcessor] = useState<QueryProcessor | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const data = await CSVAnalyzer.parseCSV(file);
      const stats = CSVAnalyzer.analyzeDataset(data);
      const summary = CSVAnalyzer.generateSummary(data, stats);

      const newDataset: CSVDataset = {
        filename: file.name,
        data,
        stats,
        summary,
        uploadedAt: new Date(),
      };

      setDataset(newDataset);
      setQueryProcessor(new QueryProcessor(newDataset));
    } catch (error) {
      alert('Error parsing CSV file. Please ensure it is a valid CSV format.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (message: string): QueryResult => {
    if (!queryProcessor) {
      return {
        response: 'No dataset loaded. Please upload a CSV file first.',
        metadata: {
          method: 'Error',
          dataScope: 'N/A',
          confidence: '0%',
        },
      };
    }

    return queryProcessor.processQuery(message);
  };

  return (
    <div className="csv-chatbot">
      {!dataset ? (
        <div className="upload-section">
          <div className="hero-section">
            <h1>CSV Intelligence Chatbot</h1>
            <p className="hero-description">
              Upload your CSV file and ask questions in natural language.
              Get instant, accurate answers powered by data analysis.
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Automatic Analysis</h3>
                <p>Instant schema detection and statistical summary</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Error Tolerance</h3>
                <p>Handles typos and fuzzy column matching</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Fast Execution</h3>
                <p>Real-time computation, no hallucination</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💡</div>
                <h3>Smart Suggestions</h3>
                <p>Auto-generated questions and insights</p>
              </div>
            </div>
          </div>
          <CSVUpload onFileUpload={handleFileUpload} />
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Analyzing your CSV file...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="chat-section">
          <ChatInterface
            onSendMessage={handleSendMessage}
            suggestedQuestions={dataset.summary.suggestedQuestions}
            datasetName={dataset.filename}
          />
          <button 
            className="change-file-btn"
            onClick={() => {
              setDataset(null);
              setQueryProcessor(null);
            }}
          >
            Change File
          </button>
        </div>
      )}
    </div>
  );
}
