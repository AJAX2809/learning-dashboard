import Fuzzysort from 'fuzzysort';
import type { CSVDataset, QueryIntent, QueryResult } from '../types/csv';

export class QueryProcessor {
  private dataset: CSVDataset;

  constructor(dataset: CSVDataset) {
    this.dataset = dataset;
  }

  // Fuzzy match column names to handle typos
  matchColumnName(input: string): string | null {
    const columnNames = this.dataset.stats.columns.map(c => c.name);
    const results = Fuzzysort.go(input, columnNames, { threshold: -10000 });
    
    if (results.length > 0 && results[0].score > -5000) {
      return results[0].target;
    }
    
    return null;
  }

  // Normalize query text
  normalizeQuery(query: string): string {
    return query.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  // Identify query intent
  identifyIntent(query: string): QueryIntent['type'] {
    const normalized = this.normalizeQuery(query);
    
    if (/(sum|total|add up|calculate total)/i.test(normalized)) return 'aggregation';
    if (/(average|mean|avg)/i.test(normalized)) return 'aggregation';
    if (/(count|how many|number of)/i.test(normalized)) return 'aggregation';
    if (/(max|maximum|highest|largest|most)/i.test(normalized)) return 'aggregation';
    if (/(min|minimum|lowest|smallest|least)/i.test(normalized)) return 'aggregation';
    if (/(filter|where|show.*with|records.*with)/i.test(normalized)) return 'filtering';
    if (/(compare|vs|versus|difference between)/i.test(normalized)) return 'comparison';
    if (/(trend|over time|time series|change)/i.test(normalized)) return 'trend';
    if (/(top|bottom|rank|sort|order by)/i.test(normalized)) return 'ranking';
    if (/(distribution|spread|range|histogram)/i.test(normalized)) return 'distribution';
    if (/(anomaly|outlier|unusual|abnormal)/i.test(normalized)) return 'anomaly';
    
    return 'aggregation';
  }

  // Extract columns mentioned in query
  extractColumns(query: string): string[] {
    const normalized = this.normalizeQuery(query);
    const matchedColumns: string[] = [];
    
    for (const col of this.dataset.stats.columns) {
      const colLower = col.name.toLowerCase();
      const words = colLower.split(/[_\s]+/);
      
      if (words.some(word => normalized.includes(word) && word.length > 2)) {
        matchedColumns.push(col.name);
      } else {
        const fuzzyMatch = this.matchColumnName(colLower);
        if (fuzzyMatch && normalized.includes(colLower)) {
          matchedColumns.push(fuzzyMatch);
        }
      }
    }
    
    return [...new Set(matchedColumns)];
  }

  // Process aggregation queries
  processAggregation(query: string, columns: string[]): QueryResult {
    const normalized = this.normalizeQuery(query);
    const numericCols = columns.filter(c => 
      this.dataset.stats.numericColumns.includes(c)
    );
    
    if (numericCols.length === 0) {
      numericCols.push(...this.dataset.stats.numericColumns);
    }
    
    const targetCol = numericCols[0];
    
    if (!targetCol) {
      return {
        response: "No numeric columns found in the dataset for aggregation.",
        metadata: {
          method: "Error",
          dataScope: "N/A",
          confidence: "0%",
        },
      };
    }
    
    const values = this.dataset.data
      .map(row => parseFloat(row[targetCol]))
      .filter(v => !isNaN(v));
    
    let result: number;
    let operation: string;
    
    if (/(sum|total)/i.test(normalized)) {
      result = values.reduce((a, b) => a + b, 0);
      operation = "Sum";
    } else if (/(average|mean|avg)/i.test(normalized)) {
      result = values.reduce((a, b) => a + b, 0) / values.length;
      operation = "Average";
    } else if (/(count|how many)/i.test(normalized)) {
      result = values.length;
      operation = "Count";
    } else if (/(max|maximum|highest)/i.test(normalized)) {
      result = Math.max(...values);
      operation = "Maximum";
    } else if (/(min|minimum|lowest)/i.test(normalized)) {
      result = Math.min(...values);
      operation = "Minimum";
    } else {
      result = values.reduce((a, b) => a + b, 0) / values.length;
      operation = "Average";
    }
    
    return {
      response: `The ${operation.toLowerCase()} of ${targetCol} is ${result.toFixed(2)}.`,
      metadata: {
        method: `${operation} aggregation`,
        dataScope: `${values.length} rows, column: ${targetCol}`,
        confidence: "95%",
        rowsConsidered: values.length,
        columnsUsed: [targetCol],
      },
    };
  }

  // Process ranking queries
  processRanking(query: string, columns: string[]): QueryResult {
    const normalized = this.normalizeQuery(query);
    const isTop = /top/i.test(normalized);
    const isBottom = /bottom/i.test(normalized);
    
    let limit = 10;
    const limitMatch = normalized.match(/(\d+)/);
    if (limitMatch) {
      limit = parseInt(limitMatch[1]);
    }
    
    const numericCols = columns.filter(c => 
      this.dataset.stats.numericColumns.includes(c)
    );
    
    const sortCol = numericCols[0] || this.dataset.stats.numericColumns[0] || this.dataset.stats.columns[0].name;
    
    const sorted = [...this.dataset.data].sort((a, b) => {
      const aVal = parseFloat(a[sortCol]) || 0;
      const bVal = parseFloat(b[sortCol]) || 0;
      return isBottom ? aVal - bVal : bVal - aVal;
    });
    
    const topRecords = sorted.slice(0, limit);
    const recordsText = topRecords.map((r, i) => 
      `${i + 1}. ${Object.entries(r).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ')}`
    ).join('\n');
    
    return {
      response: `Here are the ${isBottom ? 'bottom' : 'top'} ${limit} records:\n\n${recordsText}`,
      metadata: {
        method: "Ranking",
        dataScope: `${topRecords.length} rows sorted by ${sortCol}`,
        confidence: "98%",
        rowsConsidered: this.dataset.data.length,
        columnsUsed: [sortCol],
      },
    };
  }

  // Process count queries
  processCount(query: string, columns: string[]): QueryResult {
    const normalized = this.normalizeQuery(query);
    
    if (/(unique|distinct)/i.test(normalized)) {
      const targetCol = columns[0] || this.dataset.stats.categoricalColumns[0] || this.dataset.stats.columns[0].name;
      const colInfo = this.dataset.stats.columns.find(c => c.name === targetCol);
      
      return {
        response: `There are ${colInfo?.uniqueCount || 0} unique values in ${targetCol}.`,
        metadata: {
          method: "Distinct count",
          dataScope: `Column: ${targetCol}`,
          confidence: "99%",
          rowsConsidered: this.dataset.data.length,
          columnsUsed: [targetCol],
        },
      };
    }
    
    return {
      response: `The dataset contains ${this.dataset.data.length} records.`,
      metadata: {
        method: "Row count",
        dataScope: "All rows",
        confidence: "100%",
        rowsConsidered: this.dataset.data.length,
      },
    };
  }

  // Main query processing
  processQuery(query: string): QueryResult {
    try {
      const intent = this.identifyIntent(query);
      const columns = this.extractColumns(query);
      
      if (/(column|field|attribute)/i.test(query)) {
        const columnList = this.dataset.stats.columns.map(c => 
          `${c.name} (${c.type})`
        ).join(', ');
        
        return {
          response: `The dataset has ${this.dataset.stats.columnCount} columns: ${columnList}`,
          metadata: {
            method: "Schema inspection",
            dataScope: "All columns",
            confidence: "100%",
            columnsUsed: this.dataset.stats.columns.map(c => c.name),
          },
        };
      }
      
      switch (intent) {
        case 'aggregation':
          if (/(count|how many)/i.test(query)) {
            return this.processCount(query, columns);
          }
          return this.processAggregation(query, columns);
        
        case 'ranking':
          return this.processRanking(query, columns);
        
        default:
          return this.processAggregation(query, columns);
      }
    } catch (error) {
      return {
        response: "I encountered an error processing your query. Please try rephrasing your question.",
        metadata: {
          method: "Error handling",
          dataScope: "N/A",
          confidence: "0%",
        },
      };
    }
  }
}
