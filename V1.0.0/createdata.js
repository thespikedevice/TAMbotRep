const discord = require("discord.js")
const jsonedit = require("./jsonedit.js")

module.exports = {
  init: function(channel, user, msg) {
    if (user.id == 631470980019126272) {
      var userdata = jsonedit.load("./playerdata.json")
      console.log(userdata)
      var tag = msg.split(" ")
      if (tag[1] in userdata) {
        channel.send("This user is already registered")
      } else {
        userdata[tag[1]] = {}
        jsonedit.save("./playerdata.json", userdata)
        channel.send("User registered!")
      }
    } else {
      channel.send("Only TSD can register users!")
    }
  }
}