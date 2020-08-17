const web = require('ws');
const fs = require('fs');

module.exports = class miner {
  constructor(d) {
    this.name = d.name,
    this.limit = d.limit,
    this.channel = d.channel,
    this.output = d.output
  }
  mine() {
    let ws = new web('wss://hack.chat/chat-ws');
    let pass = Math.random().toString(36).substr(2, 8);
    ws.on('open', () => {
      ws.send(JSON.stringify({ // on open
        cmd:"join", channel: this.channel, nick:(this.name+"#"+pass)
      }));
      setTimeout(() => { // 5 sec after open
        ws.close()
      }, 5000);
      ws.on('message', (msg) => {
        msg = JSON.parse(msg); // whoops, almost forgot
        if (msg.cmd == "onlineSet") {
          var self = msg.users.find(u => u.isme);
          this.update({trip: self.trip, pass: pass})
        }
      })
    })
  }
  begin() {
    try {
      for (var i=0; i < this.limit; i++) {
        setTimeout(this.mine.bind(this), i*10000) // 10 seconds for each request (5 action, 5 bumper)
      }
      console.log("[#] MINE COMPLETE");
    } catch (e) {
      console.log("[!] "+e)
    }
  }
  update(content) {
    fs.readFile(this.output, (err, d) => {
      let p = JSON.parse(d);
      p.log.push(content);
      fs.writeFile(this.output, JSON.stringify(p, null, 2), (err) => {
        if (err) {console.log(err)}
      })
    })
  }
}
