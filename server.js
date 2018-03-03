const express = require('express');
const os = require('os')
const bodyParser= require('body-parser')
const mongoose = require('mongoose');

// SCHEMAS
var msgSchema = new mongoose.Schema({
  text: String,
  created: Date,
})
var Message = mongoose.model('Message', msgSchema)

// DATABASE
var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/node-express-db');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(80, () => {
    console.log('App listening on port 80!');
  })
  console.log("Connected to MongoDB!")
});

// APP
var app = express();
app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.get('/', (req, res) => {
  Message.find({}).exec(function (err, messages) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render('index', { hostname: os.hostname(), messages: messages } );
    }
  })
})

app.get('/message', (req, res) => {
  Message.find (function (err, messages) {
    if (err) return console.error(err);
    res.send(messages)
  })
  res.setHeader('Content-Type', 'application/json');
})

app.post('/message', (req, res) => {
  var createdTime = new Date()
  var newMessage = new Message({ text:req.body.text, created:createdTime })
  newMessage.save()
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(newMessage))
  res.send()
})