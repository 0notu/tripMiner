const web = require('ws');
const fs = require('fs');

module.exports.watch = function (d) {
  const ws = new web('wss://hack.chat/chat-ws');

  let name = d.name;
  let channel = d.channel;

  ws.on('open', function() {
    let pass = "";
    let rateLimited = false;

    ws.on('message', function(_d) {
      let p = JSON.parse(_d);
      console.log(p); // debugging
      if (p.cmd == 'onlineAdd' && p.nick == name) {
        let trip = p.trip;
        fs.appendFile('./log.txt', `\ntrip: ${trip} | password: ${pass}`, (err) => {
          if (err) throw err;
          console.log(trip+":"+pass); // debugging
        });
      }
    });
    ws.send(JSON.stringify({ cmd:"join", nick:(name+" watch") }));
    }
  });
}
