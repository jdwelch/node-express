var express = require('express');
var app = express();
var bodyParser= require('body-parser')
var os = require('os')

app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index', { hostname: os.hostname() } );
})

app.get('/message', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send('{"message":"TODO FIXME"}')
})

app.post('/message', (req, res) => {
  // db.collection('messages').save(req.body, (err, result) => {
  //   if (err) return console.log(err)
  // })
  console.log(req.body)
  // console.log('saved to database')
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(req.body))
  res.send()
})

app.listen(80, function () {
  console.log('"node-express" listening on port 80!');
});
