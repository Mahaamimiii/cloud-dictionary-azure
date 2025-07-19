const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Load cloud terms data
let cloudTerms = {};
try {
  const termsData = fs.readFileSync(path.join(__dirname, 'data', 'cloud_terms.json'), 'utf8');
  cloudTerms = JSON.parse(termsData);
} catch (error) {
  console.error('Error loading cloud terms:', error);
}

// API endpoint for getting definitions
app.get('/api/GetDefinition', (req, res) => {
  const term = req.query.term;
  
  if (!term) {
    return res.status(400).json({
      error: "Please provide a search term"
    });
  }

  const termLower = term.toLowerCase();
  if (termLower in cloudTerms) {
    res.json({
      term: term,
      definition: cloudTerms[termLower]
    });
  } else {
    res.status(404).json({
      error: `Term '${term}' not found in dictionary`
    });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});