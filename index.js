WebSocket = require("ws");
const { crypto } = require('crypto');
var accounts = {"testTripCode":"testname#testPassword"};

// Generate a somewhat secure password
function generatePassword () {
  var buffer = new Uint8Array(6);
    crypto.getRandomValues(buffer);
    return btoa(String.fromCharCode.apply(null, buffer));
}

// Open a new session (with a new trip)
var newSession = (function (_super) {
  __extends(newSession, _super);
  function hackChatSession (channel, username) {
    this.password = generatePassword;
    this.session = new WebSocket("wss://hack.chat/chat-ws");
    this.full_name = username += "#" + String(password());
    this.session.on("open", function() {
      this.sendRaw({ cmd: "join", channel: channel, nick: full_name });
      this.emit(`joining`);
    }.bind(this));
    this.ws.on("join", function(data) {
      try {
        var json = JSON.parse(data);
        if String(json.nick) === String(username)) {
          var trip = String(json.trip);
          var outputObj = JSON.parse(accounts);
          outputObj.push({trip:this.full_name})
          newObj = JSON.stringify(outputObj);
          return newObj;
          this.sendRaw({ cmd:"leave", channel: channel, nick: full_name });
        }
      } except(err) {
        console.log(err)
      }
    }
}

function get_trip (word) {
  var accounts.value[key].forEach(value) {
    if value contains (word || convertInput(value)) {
      console.log(`Trip => [ ${value) ] - Pwrd [ $(key) ]`);
    } else {
      continue;
    }
  }

function run_until (username, channel, stop) {
  if (stop === int) {
    counter = stop
    for i in stop {
      newSession.hackChatSession(channel, username);
      counter - 1;
      return counter;
    }
  if !(stop === int) {
    console.log(`${stop} is not valid`);
  }
}

module.exports = index.js
