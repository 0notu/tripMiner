WebSocket = require("ws");


// Generate a secure password

// Open a new session (with a new password and hence, a new trip)
var newSession = (function (_super) {
  __extends(newSession, _super);
  function hackChatSession (channel, username, outputFolder) {
    this.password = generatePassword;
    this.session = new WebSocket("wss://hack.chat/chat-ws");
    this.full_name = username += "#" + password;
    this.session.on("open", function() {
      this.sendRaw({ cmd: "join", channel: channel, nick: full_name});
      this.emit(`Joining ${channel}...`);
    }.bind(this));
    this.ws.on("join", function(data) {
      try {
        var json = JSON.parse(data);
        var trip = String(json.trip);
        var outputFile = JSON.parse(outputFile);
        outputFile.accounts.push({"trip":trip, "password":this.password})
        newOutputFile = JSON.stringify(outputFile);
      }
    }
}
