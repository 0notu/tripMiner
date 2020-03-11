const web = require('ws');
const fs = require('fs');

module.exports.mine = function (d) {
  const ws = new web('wss://hack.chat/chat-ws');

  let name = d.name;
  let limit = d.limit;
  let channel = d.channel;

  ws.on('open', function() {
    console.log(`channel: ${channel}\nname: ${name}`); // debugging
    let pass = "";
    let rateLimited = false;

    ws.on('message', function(_d) {
      let p = JSON.parse(_d);
      if (p.trip) {
        let trip = p.trip;
        fs.appendFile('./log.txt', `\ntrip: ${trip} | password: ${pass}`, (err) => {
          if (err) throw err;
          console.log(trip+":"+pass); // debugging
        });
      } else if (p.cmd == 'warn') {
        console.log(p.text);
        rateLimited = true;
        setTimeout(function(){rateLimited = false}, 30000) // rate limit check refresh
      }
    });

    for (let i=0; i < limit; i++) {
      function c() {
        if (rateLimited) {return}
        pass = Math.random().toString(36).substr(2, 8);
        ws.send(JSON.stringify({ cmd:"join", nick:(name+"#"+pass) }));
        ws.send(JSON.stringify({ cmd:"chat", text: "I'm miningfortrips! github: github.com/realnotU/tripMiner" }));
      }
      setTimeout(c, i * 5000);
    }
  });
}
