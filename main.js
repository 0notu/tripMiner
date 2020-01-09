let webSocket = require('ws'); // connection to hack.chat
let crypto = require('crypto'); // node.js crypto packages
let mongoose = require('mongoose'); // database storage

function mine_trip(channel, name) {
  // def login details
  let password = crypto.randomBytes(8).toString('base64'); // random 8 byte pwrd with base64 encoding
  let fullname = String(name+"#"+password); // full details for logging in
  let ws = new WebSocket('wss://hack.chat/chat-ws'); // open new webSocket

  // webSocket + mongodb
  ws.send({cmd:"join", channel:channel, nick:fullName}); // request to join channel
  ws.on("open", function() {
    console.log(`${channel} joined!`) // testing only (display channel)
    ws.on("message", function(data) {
      var parsedData = JSON.parse(data);
      console.log(`Nick: ${parsedData["nick"]}`); // testing only (display nick)
      console.log(`Trip: ${parsedData["trip"]}`); // testing  only (display trip)
      if (parsedData["nick"] == name){
        console.log(`nick successful`); // testing only (verify nick)
        if (parsedData["trip"] !== undefined){
          console.log("trip successful :D"); // testing only (test trip)
          mongoose.connect('mongodb://localhost/tripMine',{useNewUrlParser: true}); // connect to localhost database
          var db = mongoose.connection; // use db for readability
          db.on('error', console.error.bind(console, 'connection error:')); // error logging
          db.once('open', function() { // on connection to database
            console.log("connected to database");
            var tripSchema = new mongoose.Schema({trip: String, password = String}); // formatting for database
            var tripModel = mongoose.model('tripData', tripSchema); // database model
            var tripData = new tripModel({trip:parsedData["trip"], password:parsedData["password"]}); // inputing trip data to an obj
            tripData.save(function (err) {if (err) return console.error(err)}); // saving new tripData to the db
          });
         ws.close(); // close connection
        } else{console.log("trip failed :/")} // testing only (test trip)
    
      } else{console.log("nick failed :C")} // testing only (verify nick)
    });
    ws.send({cmd:"chat", channel})
  });
}

