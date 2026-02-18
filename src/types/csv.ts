// CSV Intelligence Chatbot Types

export interface CSVColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  uniqueCount: number;
  nullCount: number;
  sampleValues: any[];
}

export interface CSVStats {
  rowCount: number;
  columnCount: number;
  columns: CSVColumn[];
  numericColumns: string[];
  categoricalColumns: string[];
  dateColumns: string[];
}

export interface DatasetSummary {
  description: string;
  keyMetrics: string[];
  timeFields: string[];
  categoricalDimensions: string[];
  suggestedQuestions: string[];
}

export interface QueryIntent {
  type: 'aggregation' | 'filtering' | 'comparison' | 'trend' | 'ranking' | 'distribution' | 'anomaly';
  columns: string[];
  conditions?: Record<string, any>;
  timeScope?: string;
  outputFormat: 'text' | 'table' | 'chart';
}

export interface QueryResult {
  response: string;
  metadata: {
    method: string;
    dataScope: string;
    confidence: string;
    rowsConsidered?: number;
    columnsUsed?: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  result?: QueryResult;
}

export interface CSVDataset {
  filename: string;
  data: any[];
  stats: CSVStats;
  summary: DatasetSummary;
  uploadedAt: Date;
}
