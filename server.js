var express = require('express');
var app = express();
var bodyParser= require('body-parser')
var os = require('os')

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.render('index', { hostname: os.hostname() } );
})

app.get('/message', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send('{"message":"foo"}')
})

app.post('/message', (req, res) => {
  // db.collection('messages').save(req.body, (err, result) => {
  //   if (err) return console.log(err)

  //   console.log('saved to database')
  // })
  console.log(req.query)
  res.send()
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
