const msrc = require('./miner.js');

const t = new msrc({name: "sudo", limit: 3000, channel: "testing", output: '../../../Desktop/log.json'});
t.begin();
