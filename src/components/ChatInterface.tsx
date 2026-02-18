import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, QueryResult } from '../types/csv';
import './ChatInterface.css';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => QueryResult;
  suggestedQuestions: string[];
  datasetName: string;
}

export default function ChatInterface({ 
  onSendMessage, 
  suggestedQuestions,
  datasetName 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (datasetName) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: `CSV file "${datasetName}" uploaded successfully! I've analyzed the data and I'm ready to answer your questions.`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [datasetName]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const result = onSendMessage(text);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        result,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'An error occurred while processing your query. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>CSV Intelligence Chatbot</h2>
        <p className="dataset-name">Analyzing: {datasetName}</p>
      </div>

      {messages.length === 1 && suggestedQuestions.length > 0 && (
        <div className="suggestions-container">
          <h3>Suggested Questions:</h3>
          <div className="suggestions-grid">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => handleSuggestionClick(question)}
                disabled={isProcessing}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-content">
              <p>{message.content}</p>
              {message.result && (
                <div className="metadata">
                  <div className="metadata-item">
                    <strong>Method:</strong> {message.result.metadata.method}
                  </div>
                  <div className="metadata-item">
                    <strong>Scope:</strong> {message.result.metadata.dataScope}
                  </div>
                  <div className="metadata-item">
                    <strong>Confidence:</strong> {message.result.metadata.confidence}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your data..."
          disabled={isProcessing}
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isProcessing}
          className="send-btn"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
