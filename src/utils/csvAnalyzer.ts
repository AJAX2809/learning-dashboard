import Papa from 'papaparse';
import type { CSVColumn, CSVStats, DatasetSummary } from '../types/csv';

export class CSVAnalyzer {
  static parseCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  static detectColumnType(values: any[]): 'string' | 'number' | 'date' | 'boolean' {
    const nonNullValues = values.filter(v => v != null && v !== '');
    
    if (nonNullValues.length === 0) return 'string';

    const numericCount = nonNullValues.filter(v => typeof v === 'number' || !isNaN(Number(v))).length;
    const numericRatio = numericCount / nonNullValues.length;

    if (numericRatio > 0.8) return 'number';

    const dateCount = nonNullValues.filter(v => {
      const dateVal = new Date(v);
      return dateVal.toString() !== 'Invalid Date' && !isNaN(dateVal.getTime());
    }).length;
    const dateRatio = dateCount / nonNullValues.length;

    if (dateRatio > 0.8) return 'date';

    const boolCount = nonNullValues.filter(v => 
      v === true || v === false || 
      String(v).toLowerCase() === 'true' || 
      String(v).toLowerCase() === 'false'
    ).length;
    const boolRatio = boolCount / nonNullValues.length;

    if (boolRatio > 0.8) return 'boolean';

    return 'string';
  }

  static analyzeColumn(data: any[], columnName: string): CSVColumn {
    const values = data.map(row => row[columnName]);
    const nonNullValues = values.filter(v => v != null && v !== '');
    const uniqueValues = [...new Set(nonNullValues)];

    return {
      name: columnName,
      type: this.detectColumnType(values),
      uniqueCount: uniqueValues.length,
      nullCount: values.length - nonNullValues.length,
      sampleValues: uniqueValues.slice(0, 5),
    };
  }

  static analyzeDataset(data: any[]): CSVStats {
    if (data.length === 0) {
      return {
        rowCount: 0,
        columnCount: 0,
        columns: [],
        numericColumns: [],
        categoricalColumns: [],
        dateColumns: [],
      };
    }

    const columnNames = Object.keys(data[0]);
    const columns = columnNames.map(name => this.analyzeColumn(data, name));

    return {
      rowCount: data.length,
      columnCount: columnNames.length,
      columns,
      numericColumns: columns.filter(c => c.type === 'number').map(c => c.name),
      categoricalColumns: columns.filter(c => c.type === 'string' && c.uniqueCount < data.length * 0.5).map(c => c.name),
      dateColumns: columns.filter(c => c.type === 'date').map(c => c.name),
    };
  }

  static generateSummary(data: any[], stats: CSVStats): DatasetSummary {
    const suggestedQuestions: string[] = [];

    if (stats.numericColumns.length > 0) {
      suggestedQuestions.push(`What is the average ${stats.numericColumns[0]}?`);
      suggestedQuestions.push(`What is the total ${stats.numericColumns[0]}?`);
      if (stats.numericColumns.length > 1) {
        suggestedQuestions.push(`Compare ${stats.numericColumns[0]} and ${stats.numericColumns[1]}`);
      }
    }

    if (stats.categoricalColumns.length > 0) {
      suggestedQuestions.push(`What are the unique ${stats.categoricalColumns[0]}s?`);
      suggestedQuestions.push(`How many records per ${stats.categoricalColumns[0]}?`);
    }

    if (stats.dateColumns.length > 0 && stats.numericColumns.length > 0) {
      suggestedQuestions.push(`Show ${stats.numericColumns[0]} trend over time`);
    }

    suggestedQuestions.push(`Show me the top 10 records`);
    suggestedQuestions.push(`What are the columns in this dataset?`);

    return {
      description: `Dataset with ${stats.rowCount} rows and ${stats.columnCount} columns`,
      keyMetrics: stats.numericColumns,
      timeFields: stats.dateColumns,
      categoricalDimensions: stats.categoricalColumns,
      suggestedQuestions: suggestedQuestions.slice(0, 6),
    };
  }
}
