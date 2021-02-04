const Discord = require('discord.js');
const client = new Discord.Client();

var funcs = {
  seeme: require("./seeme.js"),
  register: require("./createdata.js"),
  startbank: require("./startbank.js"),
  deposit: require("./deposit.js"),
  getbalance: require("./getbalance.js"),
  withdraw: require("./withdraw.js"),
  pay: require("./withdraw.js"),
  help: require("./help.js"),
  skyblock: require("./skyblock.js"),
  trees: require("./trees.js"),
  shop: require("./shop.js"),
  credits: require("./credits.js"),
  inv: require("./inv.js"),
  crops: require("./crops.js"),
  sell: require("./alias/sell.js"),
  buy: require("./alias/buy.js"),
  use: require("./alias/use.js"),
  ores: require("./ores.js"),
  craft: require("./craft.js"),
  admin: require("./admin.js")
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on("message", (msg) => {
  var msgcontent = msg.content
  if (msgcontent.startsWith("..seeme")) {
    funcs.seeme.init(msg.channel, msg.author, msg.content)
  }
  else if (msgcontent.startsWith("..register ")) {
    funcs.register.init(msg.channel, msg.author, msg.content)
  }
  else if (msgcontent.startsWith("..startbank ")) {
    funcs.startbank.init(msg.channel, msg.author, msg.content)
  }
  else if (msgcontent.startsWith("..deposit ")) {
    funcs.deposit.init(msg.channel, msg.author, msg.content)
  }
  else if (msgcontent.startsWith("..getbalance ")) {
    funcs.getbalance.init(msg.channel, msg.author, msg.content)
  }
  else if (msgcontent.startsWith("..withdraw ")) {
    funcs.withdraw.init(msg.channel, msg.author, msg.content)
  }
  else if (msgcontent.startsWith("..pay ")) {
    funcs.pay.init(msg.channel, msg.author, msg.content)
  }
  else if (msgcontent.startsWith("..help")) {
    funcs.help.init(msg.channel, msg.author, msg.content)
  }
  else if (msgcontent.startsWith("..skyblock")) {
    funcs.skyblock.init(msg.channel, msg.author, msg.content)
  }
  else if (!msg.content.startsWith("..") && msg.content.toLowerCase().indexOf("happen")!=-1 && msg.content.toLowerCase().indexOf("server")!=-1 && msg.content.toLowerCase().indexOf("to")!=-1) {
    msg.channel.send("I deleted the discord server cuz TSD was big dumb")
  }
  else if (msg.content.startsWith("..tree")) {
      funcs.trees.init(msg.channel, msg.author, msg.content)
  }
  else if (msg.content.startsWith("..shop")) {
      funcs.shop.init(msg.channel, msg.author, msg.content)
  }
  else if (msg.content.startsWith("..credits")) {
      funcs.credits.init(msg.channel, msg.author, msg.content)
  }
  else if (msg.content.startsWith("..inv")) {
      funcs.inv.init(msg.channel, msg.author, msg.content)
  }
  else if (msg.content.startsWith("..crop")) {
      funcs.crops.init(msg.channel, msg.author, msg.content)
  }
  else if (msg.content.startsWith("..use")) {
      funcs.use.init(msg.channel, msg.author, msg.content)
  }
  else if (msg.content.startsWith("..sell")) {
      funcs.sell.init(msg.channel, msg.author, msg.content)
  }
  else if (msg.content.startsWith("..buy")) {
      funcs.buy.init(msg.channel, msg.author, msg.content)
  }
  else if (msg.content.startsWith("..ore")) {
	  funcs.ores.init(msg.channel, msg.author, msg.content)
  }
  else if (msg.content.startsWith("..craft")) {
	  funcs.craft.init(msg.channel, msg.author, msg.content)
  }
  else if (msg.content.startsWith("..admin")) {
    funcs.admin.init(msg.channel, msg.author, msg.content)
  }
})

client.login(process.env.SECRET);