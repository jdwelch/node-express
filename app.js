var express = require('express');
var app = express();
var os = require('os')

app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  res.render('index', { hostname: os.hostname() } );
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
