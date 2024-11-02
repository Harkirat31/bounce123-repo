const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../dist/')));

app.get('/src/assets/sample_order_creation_file.csv', (req, res) => {
  res.header('Content-Type', 'text/csv');
  res.download(path.join(__dirname, '../', '/src/assets/',"sample_order_creation_file.csv"))
});
app.get('/src/assets/sample.xlsx', (req, res) => {
  res.header('Content-Type', 'text/xlsx');
  res.download(path.join(__dirname, '../', '/src/assets/',"sample.xlsx"))
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist/', 'index.html'));
});


app.listen(3001,()=>console.log("started server at 3001"));
