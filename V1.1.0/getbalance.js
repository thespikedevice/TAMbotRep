const discord = require("discord.js")
const jsonedit = require("./jsonedit.js")

module.exports = {
  init: function(channel, user, msg) {
    var memberdata = jsonedit.load("./playerdata.json")
    var hm = msg.split(" ")
    if (hm[1]=="#") {
      if (user.id in memberdata) {
        if ("hasBank" in memberdata[user.id]) {
          channel.send("You have " + memberdata[user.id]["bankBalance"] + " coins")
        } else {
          channel.send("You don't have a bank balance, ask TSD to register you one")
        }
      } else {
        channel.send("You aren't registered for TAM, ask TSD to register you")
      }
    } else {
      if (hm[1] in memberdata) {
        if ("hasBank" in memberdata[hm[1]]) {
          channel.send(hm[1] + " has " + memberdata[hm[1]]["bankBalance"] + " coins")
        } else {
          channel.send("This user has no bank balance")
        }
      } else {
        channel.send("This user is not TAM registered")
      }
    }
  }
}