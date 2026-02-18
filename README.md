# CSV Intelligence Chatbot

An advanced data analysis chatbot built with Astro.js and React that allows users to upload CSV files and ask questions in natural language.

## Features

### 🎯 Core Capabilities

- **Automatic CSV Analysis**: Instant schema detection, column type inference, and statistical summary
- **Natural Language Processing**: Ask questions in plain English with full error tolerance
- **Fuzzy Matching**: Handles typos, spelling mistakes, and column name variations
- **Execution-Based Answers**: All responses are computed from actual data, never hallucinated
- **Structured Responses**: Every answer includes method, data scope, and confidence score
- **Smart Suggestions**: Auto-generated questions based on your dataset

### 🔍 Query Types Supported

- **Aggregations**: sum, average, count, min, max
- **Ranking**: top N, bottom N records
- **Filtering**: conditional queries
- **Comparisons**: compare multiple columns
- **Trends**: time-series analysis
- **Distribution**: data spread and range
- **Schema Inspection**: view columns and types

### 🎨 User Interface

- Modern gradient design with glassmorphism effects
- Drag-and-drop CSV upload
- Interactive chat interface with message history
- Suggested question buttons
- Real-time query processing
- Responsive layout for all devices

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. **Upload CSV File**: Drag and drop or click to browse for your CSV file
2. **Wait for Analysis**: The system automatically analyzes your data
3. **Ask Questions**: Type your questions in natural language or click suggested questions
4. **View Results**: Get instant, accurate answers with metadata

## Example Queries

- "What is the average price?"
- "Show me the top 10 records"
- "How many unique genres are there?"
- "What are the columns in this dataset?"
- "What is the maximum rating?"
- "Compare year and rating"

## Technology Stack

- **Framework**: Astro.js 5.x with React Islands
- **UI**: React 18.x with TypeScript
- **CSV Parsing**: PapaParse
- **Fuzzy Matching**: Fuzzysort
- **Build Tool**: Vite (via Astro)
- **Styling**: Modern CSS with gradients and animations

## Project Structure

```
learning-dashboard/
├── src/
│   ├── components/
│   │   ├── CSVChatbot.tsx      # Main chatbot component
│   │   ├── CSVUpload.tsx       # File upload component
│   │   ├── ChatInterface.tsx   # Chat UI component
│   │   └── *.css               # Component styles
│   ├── pages/
│   │   └── index.astro         # Main page
│   ├── types/
│   │   └── csv.ts              # TypeScript interfaces
│   └── utils/
│       ├── csvAnalyzer.ts      # CSV parsing and analysis
│       └── queryProcessor.ts   # Natural language query processing
├── public/
│   └── books.csv               # Sample dataset
└── package.json
```

## Features in Detail

### Automatic Analysis

Upon upload, the system:
- Parses CSV structure
- Detects column types (string, number, date, boolean)
- Calculates statistics (unique values, null counts, samples)
- Identifies numeric, categorical, and date columns
- Generates semantic summary
- Creates suggested questions

### Error Tolerance

The chatbot handles:
- Spelling mistakes ("avrage" → "average")
- Column name typos ("ratng" → "rating")
- Spacing errors
- Grammar issues
- Ambiguous phrasing

### Response Format

Every response includes:

```json
{
  "response": "Clear and concise answer",
  "metadata": {
    "method": "Aggregation/Filtering/Ranking/etc",
    "dataScope": "Rows and columns considered",
    "confidence": "Percentage confidence",
    "rowsConsidered": 30,
    "columnsUsed": ["column1", "column2"]
  }
}
```

## Development

Built following Astro.js best practices:
- Server-first rendering for performance
- Interactive islands for dynamic components
- Minimal JavaScript shipped to client
- Type-safe with TypeScript
- Modern CSS without framework bloat

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
