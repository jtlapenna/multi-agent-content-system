console.log('Test server starting...');

const express = require('express');
console.log('Express loaded');

const app = express();
console.log('App created');

app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Test successful' });
});

console.log('About to listen on port 4001');

app.listen(4001, () => {
  console.log('Test server listening on port 4001');
}); 