const discord=require("discord.js")
const fs=require("fs")
const sha1=require("sha1")
const jsonedit=require("./jsonedit.js")

module.exports={
  init: function(channel, user, msg) {
    var hm=msg.split(" ")
    var skyfiles=jsonedit.load("skyblockplayers.json")
    if (user.id in skyfiles) {
      if ("selected" in skyfiles[user.id]) {
        var filecode=skyfiles[user.id]["selected"]
        filecode=sha1(filecode)
        try {
          if (fs.existsSync("./skyfiles/" + filecode + ".json")) {
            var myfile=jsonedit.load("./skyfiles/" + filecode + ".json")
            var maxlvl=2
            var mylvl=myfile["level"]
            if (mylvl==maxlvl) {
              channel.send("You are already at max island lvl!")
            } else {
              var itemsNeeded=jsonedit.load("./lvlstats.json")
              var itemsIN=itemsNeeded[mylvl]
              var playerInv=myfile["inventory"][user.id]
              var itemNames=Object.keys(itemsIN)
              var ICan=true
              for (var i=0;i<itemNames.length;i++) {
                if (itemNames[i] in playerInv) {
                  var count=playerInv[itemNames[i]]
                  if (count>=itemsIN[itemNames[i]]) {
                    console.log(itemNames[i]+"Passed")
                  } else {
                    ICan=false
                  }
                } else {
                  ICan=false
                }
              }
              if (ICan) {
                mylvl += 1
                for (var i=0;i<itemNames.length;i++) {
                  playerInv[itemNames[i]]-=itemsIN[itemNames[i]]
                }
                myfile["inventory"][user.id] = playerInv
                myfile["level"] = mylvl
                myfile["spaceFree"]+=100
                jsonedit.save("./skyfiles/" + filecode + ".json", myfile)
                channel.send("Level updated to level " + mylvl + "!")
              } else {
                channel.send("You don't have all the items required!")
              }
            }
          } else {
            channel.send("Please reselect your file")
          }
        } catch(err) {
          channel.send("An error occured, please contact TSD\n\n" + err)
          console.log(err)
        }
      } else {
        channel.send("You don't have a file selected! (..skyblock load [filename])")
      }
    } else {
      channel.send("You don't have a file selected! (..skyblock load [filename])")
    }
  }
}