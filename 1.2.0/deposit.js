const discord = require("discord.js")
const jsonedit = require("./jsonedit.js")

module.exports = {
  init: function(channel, user, msg) {
    var memberdata = jsonedit.load("./playerdata.json")
    if (user.id==631470980019126272) {
      var hm = msg.split(" ")
      if (hm[1] in memberdata) {
        if ("hasBank" in memberdata[hm[1]]) {
          memberdata[hm[1]]["bankBalance"] += parseInt(hm[2])
          jsonedit.save("./playerdata.json", memberdata)
          channel.send("Bank balance updated!")
        }
        else {
          channel.send("This user does not have a bank balance, use ..startbank [user]")
        }
      } else {
        channel.send("This user does not exist, use ..register [user]")
      }
    } else {
      channel.send("Only TSD can deposit new money to an account, to pay another user use ..pay [user] [amount]")
    }
  }
}