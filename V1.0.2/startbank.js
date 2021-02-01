const discord = require("discord.js")
const fs = require("fs")
const jsonedit = require("./jsonedit.js")

module.exports = {
  init: function(channel, user, msg) {
    var memberdata = jsonedit.load("./playerdata.json")
    if (user.id == 631470980019126272) {
      var hm = msg.split(" ")
      if (hm[1] in memberdata) {
        if ("hasBank" in memberdata[hm[1]]) {
          channel.send("This user already has a bank balance")
        }
        else {
          memberdata[hm[1]]["hasBank"] = true
          memberdata[hm[1]]["bankBalance"] = 0
          jsonedit.save("./playerdata.json", memberdata)
          channel.send("User registered for bank balance!")
        }
      }
      else {
        channel.send("You need to first register this user for TAM")
      }
    }
    else {
      channel.send("Only TSD can register bank balances!")
    }
  }
}