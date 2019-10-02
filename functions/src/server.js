const path    = require('path');
const express = require('express');
const app     = express();

app.get('/', (req, res) => {
  console.log('Running Express on request');
  res.sendFile(path.join(__dirname, '/react_templates/build/index.html'));
});

app.use(express.static(path.join(__dirname, '/react_templates')));

module.exports = app;