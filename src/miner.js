const web = require('ws');
const fs = require('fs');

module.exports.mine = function (d) {
  const miner = new web('wss://hack.chat/chat-ws');
  const watcher = new web('wss://hack.chat/chat-ws');
  let name = d.name;
  let limit = d.limit;
  let channel = d.channel;

  // globals
  let pass = "";
  let holder = {
    trip: "",
    pass: ""
  }

  watcher.on('open', function() {
    watcher.send(JSON.stringify({ cmd:"join", channel:channel, nick:(name+"watcher") }));
    watcher.on('message', function(_d) {
      let p = JSON.parse(_d);
      if (p.cmd == 'onlineAdd' && p.nick == name) {
        let trip = p.trip;
        holder.trip = trip;
      }
    });
  });

  miner.on('open', function() {
    let rateLimited = -1;

    miner.on('message', function(m) {
      let p = JSON.parse(m);

      if (p.cmd == 'warn') {
        console.log(p.text);
        rateLimited = 1;
        setTimeout(function(){rateLimited = -1}, 30000) // rate limit check refresh
      }
    });

    for (let i=0; i < limit; i++) {
      if (rateLimited > 0) {return}
      function a() {
        pass = Math.random().toString(36).substr(2, 8);
        miner.send(JSON.stringify({ cmd:"join", channel: channel, nick:(name+"#"+pass) }));
      }

      function b() {
        holder.pass = pass;
        miner.send(JSON.stringify({ cmd:"disconnect" }));
      }

      setTimeout(a, i * 5000);
      setTimeout(b, i * 10000);
    }
  });

  if (holder.trip && holder.pass) {
    fs.appendFile('./log.txt', `\ntrip: ${holder.trip} | pass: ${holder.pass}`, (err) => {
      if (err) throw err;
      console.log(trip+":"+pass); // debugging
    });
  }
}
