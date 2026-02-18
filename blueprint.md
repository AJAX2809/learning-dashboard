# CSV Intelligence Chatbot - Project Blueprint

## Overview

This project is a CSV Intelligence Chatbot built with Astro.js and React, designed to provide advanced data analysis capabilities for CSV files. The chatbot enables users to upload CSV files (specifically books data) and ask natural language questions about the data, receiving accurate, computed responses with metadata.

### Core Capabilities

- **Automatic CSV Analysis**: Parses and understands CSV structure upon upload
- **Natural Language Query Processing**: Handles user questions with error tolerance and fuzzy matching
- **Execution-Based Answers**: All responses are computed from actual data, not hallucinated
- **Structured JSON Responses**: Returns data in a consistent format with metadata
- **Error Tolerance**: Handles typos, spelling mistakes, and ambiguous queries
- **Auto-Insights**: Generates intelligent suggested questions and insights

## Current Implementation

### Phase 1: Initial Setup ✓
- [x] Astro.js project with React integration
- [x] Basic project structure with Counter component example
- [x] Build system configured and working

## Planned Implementation

### Phase 2: Core Infrastructure
- [ ] Add necessary dependencies (papaparse, fuzzysort, etc.)
- [ ] Create TypeScript types and interfaces for CSV data
- [ ] Set up data processing utilities

### Phase 3: UI Components
- [ ] CSV upload component with drag-and-drop
- [ ] Chatbot interface with message display
- [ ] Auto-suggestions panel
- [ ] Data preview component

### Phase 4: Data Processing Engine
- [ ] CSV parser and validator
- [ ] Schema analyzer (columns, types, statistics)
- [ ] Query intent classifier
- [ ] Fuzzy matching for column names
- [ ] Typo correction engine

### Phase 5: Query Execution
- [ ] Aggregation operations (sum, avg, count, etc.)
- [ ] Filtering and conditional queries
- [ ] Comparison operations
- [ ] Trend analysis
- [ ] Ranking operations
- [ ] Distribution calculations

### Phase 6: Response Generation
- [ ] JSON response formatter
- [ ] Metadata builder (method, scope, confidence)
- [ ] Auto-insight generator
- [ ] Follow-up question suggestions

### Phase 7: Testing & Refinement
- [ ] Create sample books.csv dataset
- [ ] Test query processing
- [ ] Validate response format
- [ ] Test error handling

### Phase 8: UI/UX Polish
- [ ] Modern, clean interface design
- [ ] Responsive layout
- [ ] Interactive elements with proper states
- [ ] Accessibility features

## Current Change Request

Implement the CSV Intelligence Chatbot with the following requirements:

### Mandatory Features

1. **Automatic Post-Upload Behavior**
   - Parse CSV structure (columns, types, row count)
   - Generate semantic summary
   - Auto-suggest intelligent questions
   - No user prompting required

2. **Input Error Tolerance**
   - Normalize input text automatically
   - Correct spelling with high confidence
   - Fuzzy matching for column names
   - Semantic understanding for intent
   - Never fail on typos/formatting errors

3. **Query Understanding**
   - Identify intent (aggregation, filtering, comparison, etc.)
   - Extract required components (columns, conditions, filters)
   - Validate column existence and data types
   - Provide guided corrections on validation failure

4. **Execution-First Answering**
   - Never answer with language reasoning alone
   - Always run validated operations on CSV data
   - Cross-check results for consistency
   - Use only computed results in responses

5. **Response Format (Mandatory)**
   ```json
   {
     "response": "Clear and concise answer",
     "metadata": {
       "method": "Aggregation/Filtering/etc",
       "dataScope": "Rows/columns considered",
       "confidence": "98.6%"
     }
   }
   ```

6. **Advanced Intelligence**
   - Auto-insight generation for patterns
   - Follow-up question suggestions
   - Session memory for preferences
   - Multiple explanation levels
   - Proactive warnings about data quality

7. **Performance**
   - Cached summaries
   - No recomputation for repeated queries
   - Vectorized operations
   - Chunked processing for large files

8. **Fail-Safe**
   - Never crash on invalid input
   - Never guess missing data
   - Never expose internal errors
   - Always provide safe fallback responses

## Technical Stack

- **Framework**: Astro.js with React Islands
- **UI**: React with modern, accessible components
- **CSV Parsing**: PapaParse
- **Fuzzy Matching**: Fuzzysort
- **Styling**: Modern CSS with utility classes
- **Build Tool**: Vite (via Astro)

## Design Principles

- Server-first rendering for performance
- Interactive islands for dynamic components
- Minimal JavaScript shipped to client
- Clean, modern, accessible UI
- Error-tolerant and user-friendly
- Data-driven and accurate responses
