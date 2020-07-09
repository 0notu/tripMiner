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
          // stats
          process.stdout.moveCursor(0,-1) // remove "/n"
          process.stdout.write("\r\x1b[K"); // remove old stat
          process.stdout.write("                        Current Trip: "+self.trip+"\n");
          this.update({trip: self.trip, pass: pass})
        }
      })
    })
  }

  time(mill) { // ease of use
    var sec = (mill/1000).toFixed(0);
    var min = Math.floor(sec/60);
    var hr = "";
    if (min > 59) {
      hr = Math.floor(min / 60);
      hr = (hr >= 10) ? hr:"0"+hr;
      min = min - (hr * 60);
      min = (min >= 10) ? min : "0" + min;
    }

    sec = Math.floor(sec % 60);
    sec = (sec >= 10) ? sec:"0"+sec;
    if (hr != "") {
      return hr+ "hrs, "+min+" mins, "+sec+" sec";
    }
    return min+" mins, "+sec+" sec";
  }

  begin() {
    try {
      console.log(
        "\n   /$$               /$$           /$$      /$$ /$$",
        "\n  | $$              |__/          | $$$    /$$$|__/",
        "\n /$$$$$$    /$$$$$$  /$$  /$$$$$$ | $$$$  /$$$$|/$$ /$$$$$$$   /$$$$$$   /$$$$$$",
        "\n|_  $$_/   /$$__  $$| $$ /$$__  $$| $$ $$/$$ $$|$$| $$__  $$ /$$__  $$ /$$__  $$",
        "\n  | $$    | $$  \\__/| $$| $$  \\ $$| $$  $$$| $$|$$| $$  \\ $$| $$$$$$$$| $$  \\__/",
        "\n  | $$ /$$| $$      | $$| $$  | $$| $$\\  $ | $$|$$| $$  | $$| $$_____/| $$",
        "\n  |  $$$$/| $$      | $$| $$$$$$$/| $$ \\/  | $$|$$| $$  | $$|  $$$$$$$| $$",
        "\n  \\___/  |__/       |__/| $$____/ |__/     |__/|__/|__/  |__/ \\_______/|__/",
        "\n                        | $$",
        "\n                        | $$",
        "\n                        |__/",
        "\n                       .____________________",
        "\n                       / Written by @im_notu|",
        "\n                       | Help from sudo     |",
        "\n                       |___________________/",
        "\n"
      )
      console.log("\n                 Estimated Time: "+this.time(this.limit*10000)+" \n")
      for (var i=0; i < this.limit; i++) {
        setTimeout(this.mine.bind(this), i*10000) // 10 seconds for each request (5 action, 5 bumper)
      }
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
