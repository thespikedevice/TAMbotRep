const discord = require("discord.js")
const jsonedit = require("./jsonedit.js")

module.exports = {
  init: function(channel, user, msg) {
    var memberdata = jsonedit.load("./playerdata.json")
    var hm = msg.split(" ")
    if (user.id in memberdata) {
      if (hm[1] in memberdata) {
        if ("hasBank" in memberdata[hm[1]]) {
          if ("hasBank" in memberdata[user.id]) {
            var mybalance = memberdata[user.id]["bankBalance"]
            if (mybalance >= parseInt(hm[2])) {
              memberdata[user.id]["bankBalance"] -= parseInt(hm[2])
              memberdata[hm[1]]["bankBalance"] += parseInt(hm[2])
              channel.send("Transaction successful!")
            }
            else {
              channel.send("You don't have this much!")
            }
          }
          else {
            channel.send("You do not have a bank balance, ask TSD to make one for you")
          }
        } else {
          channel.send("This user does not have a bank balance!")
        }
      }
      else {
        channel.send("This user is not registered with TAM!")
      }
    } else {
      channel.send("You are not registered with TAM!")
    }
  }
}