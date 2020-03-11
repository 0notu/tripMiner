const web = require('ws');
const fs = require('fs');

module.exports.mine = function (d) {
  let ws = new web('wss://hack.chat/chat-ws');

  let name = d.name;
  let limit = d.limit;
  let channel = d.channel;

  ws.on("open", function() {
    console.log(`channel: ${channel}\nname: ${name}`); // debugging
    var pass;
    ws.on('message', function(_d) {
      let p = JSON.parse(_d);
      if (p.cmd !== 'chat') {return}
      let trip = p.trip;
      fs.appendFile('./log.txt', `\ntrip: ${trip} | password: ${pass}`, (err) => {
        if (err) throw err;
        console.log(trip+":"+pass); // debugging
      });
    });
    for (let i=0; i < limit; i++) {
      function c() {
        pass = Math.random().toString(36).substr(2, 8);
        ws.send(JSON.stringify({ cmd:"join", nick:(name+"#"+pass) }));
        ws.send(JSON.stringify({ cmd:"chat", text: Math.random().toString(36).substr(2, 4) }));
        ws.send(JSON.stringify({ cmd:"disconnect" }));
      }
      setTimeout(c, i * 5000);
    }
  });
}
