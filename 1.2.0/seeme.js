const discord = require('discord.js')

module.exports = {
  init: function(channel, user, msg) {
    channel.send({embed: {
      color: 3447003,
      title: "Hi " + user.username + "!",
      description: "This is a bot specially made by TSDOmlet, to make the TAM server easier to use",
      footer: {text: "@TAM"}
    }})
  }
}