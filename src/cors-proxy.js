// This file won't actually be used server-side on Render
// It's just to document how to set up a CORS proxy if needed

/*
To set up a CORS proxy on Render:

1. Create a new Web Service on Render
2. Use this simple Node.js server:

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Proxy all requests to the backend
app.use('/api', async (req, res) => {
  try {
    const targetUrl = 'http://18.206.140.165:5001/api' + req.url;
    
    const method = req.method.toLowerCase();
    const options = {
      method,
      url: targetUrl,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (['post', 'put', 'patch'].includes(method)) {
      options.data = req.body;
    }
    
    if (Object.keys(req.query).length > 0) {
      options.params = req.query;
    }
    
    const response = await axios(options);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Proxy error',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CORS Proxy server running on port ${PORT}`);
});
*/

// Then update your API_BASE_URL in src/api/index.ts to:
// const API_BASE_URL = 'https://your-cors-proxy.onrender.com/api'; 