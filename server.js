const express = require("express");
const os = require("os");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// APP
var app = express();
app.use(bodyParser.json());

// SCHEMAS
var msgSchema = new mongoose.Schema({
  text: String,
  created: Date,
  updated: Date
});
var Message = mongoose.model("Message", msgSchema);

msgSchema.pre('update', function( next ) {
  this.update({}, { $inc: { __v: 1 } }, next );
});

msgSchema.pre('save', function(next) {
  this.increment();
  return next();
});

// DATABASE
var db = mongoose.connection;
mongoose.connect("mongodb://localhost:27017/node-express-db");
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  app.listen(80, () => {
    console.log("App listening on port 80!");
  });
  console.log("Connected to MongoDB!");
});

// GUI
app.set("view engine", "hbs");
app.get("/", (req, res) => {
  Message.find({}).exec(function(err, messages) {
    if (err) {
      console.log("Error:", err);
    } else {
      res.render("index", { hostname: os.hostname(), messages: messages });
    }
  });
});

// API

app.get("/message", (req, res) => {
  Message.find(function(err, findMessages) {
    if (err) {
      console.log(err);
      res
        .status(500)
        .send({ message: "Some error occurred while retrieving notes." });
    } else {
      res.send(findMessages);
    }
  });
});

app.post("/message", (req, res) => {
  if (!req.body.text) {
    return res.status(400).send({ message: "Your message can not be empty" });
  }
  var createdTime = new Date();
  var newMessage = new Message({ text: req.body.text, created: createdTime });
  newMessage.save((err, data) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .send({ message: "Some error occurred while creating the Note." });
    } else {
      res.send(data);
    }
  });
});

app.put("/message", (req, res) => {
  var msgId = req.query.id;
  Message.findById(msgId, (err, updateMessage) => {
    if (err) {
      console.log(err);
      if (err.kind === "ObjectId") {
        return res
          .status(404)
          .send({ message: "Note not found with id " + msgId });
      }
      return res
        .status(500)
        .send({ message: "Error finding note with id " + msgId });
    }

    if (!updateMessage) {
      return res
        .status(404)
        .send({ message: "Note not found with id " + msgId });
    }

    updateMessage.text = req.body.text;
    updateMessage.updated = new Date();

    updateMessage.save((err, data) => {
      if (err) {
        res
          .status(500)
          .send({ message: "Could not update note with id " + msgId });
      } else {
        res.send(data);
      }
    });
  });
});

app.delete("/message", (req, res) => {
  var msgId = req.query.id;
  Message.findByIdAndRemove(msgId, (err, deleteMessage) => {
    if (err) {
      console.log(err);
      if (err.kind === "ObjectId") {
        return res
          .status(404)
          .send({ message: "Note not found with id " + msgId });
      }
      return res
        .status(500)
        .send({ message: "Could not delete note with id " + msgId });
    }
    if (!deleteMessage) {
      return res
        .status(404)
        .send({ message: "Note not found with id " + msgId });
    }
    res.send({ message: "Note " + msgId + "deleted successfully!" });
  });
});
