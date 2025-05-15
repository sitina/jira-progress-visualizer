const express = require('express');
const path = require('path');
const routes = require('./api/routes');
const config = require('../config');

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/', routes);

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

module.exports = app;
