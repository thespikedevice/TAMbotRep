const discord = require("discord.js")

module.exports = {
  init: function(channel, user, msg) {
    if (msg=="..help" || msg=="..help ") {
      channel.send("Please choose a category using ..help [category]\n\nCategory types:\n\nGeneral\nTAM\nAdmin\nSkyblock")
    } else if (msg.toLowerCase().startsWith("..help tam")) {
      channel.send("getbalance [userid|#]: Get the balance of a discord user using their discord ID, or using a # to get your balance\n\npay [userid] [amount]: Pay a discord user")
    } else if (msg.toLowerCase().startsWith("..help general")) {
      channel.send("help [category]: Shows the help screen\n\nseeme: Test whether bot is online")
    } else if (msg.toLowerCase().startsWith("..help admin")) {
      channel.send("TSD-Only\n\nregister [userid]: Register a user for TAMbot\n\ndeposit [userid] [amount]: Add money to an account deposited in the TAMbot bank\n\nstartbank [userid]: Start a bank account for a TAMbot user\n\nwithdraw [userid] [amount]: Withdraw money from TAMbot to be given in item form on TAM")
    } else if (msg.toLowerCase().startsWith("..help skyblock")) {
      channel.send("Pick a command name and type help (eg. ..shop help)\n\ncraft  crops  inv  levelcheck  levelup  ores  shop  skyblock spawners trees")
    }
  }
}