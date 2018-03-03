const express = require('express');
const os = require('os')
const bodyParser= require('body-parser')
const mongoose = require('mongoose');

// SCHEMAS
var msgSchema = new mongoose.Schema({
  text: String,
})
var Message = mongoose.model('Message', msgSchema)

// DATABASE
var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/node-express-db');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB!")
});

// APP
var app = express();
app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index', { hostname: os.hostname() } );
})

app.get('/message', (req, res) => {
  Message.find (function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
    res.send(kittens)
  })
  res.setHeader('Content-Type', 'application/json');
})

app.post('/message', (req, res) => {
  var newMessage = new Message(req.body)
  console.log(newMessage.text)
  newMessage.save()
  console.log('saved to database')
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(newMessage))
  res.send()
})

app.listen(80, () => {
  console.log('App listening on port 80!');
})