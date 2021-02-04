const discord=require("discord.js")
const fs=require("fs")
const jsonedit=require("./jsonedit.js")
const sha1=require("sha1")

module.exports={
  init: function(channel, user, msg) {
    var hm=msg.split(" ")
    if (hm[1]=="help") {
      channel.send("No help screen yet")
    } else {
      if (user.id==631470980019126272) {
        var skyplayers=jsonedit.load("./skyblockplayers.json")
        if (user.id in skyplayers) {
          if ("selected" in skyplayers[user.id]) {
            var myid=skyplayers[user.id]["selected"]
            myid=sha1(myid)
            try {
              if (fs.existsSync("./skyfiles/" + myid + ".json")) {
                var myfile="./skyfiles/" + myid + ".json"
                if (hm[1]=="give") {
                  var yourid=hm[2]
                  yourid=sha1(yourid)
                  if (fs.existsSync("./skyfiles/" + myid + ".json")) {
                    if (hm.length==6) {
                      var yourfile=jsonedit.load("./skyfiles/" + myid + ".json")
                      if (hm[3] in yourfile["inventory"]) {
                        if (hm[4] in yourfile["inventory"][hm[3]]) {
                          yourfile["inventory"][hm[3]][hm[4]] += parseInt(hm[5])
                        } else {
                          yourfile["inventory"][hm[3]][hm[4]] = parseInt(hm[5])
                        }
                        channel.send("Items given!")
                        jsonedit.save("./skyfiles/" + myid + ".json", yourfile)
                      } else {
                        channel.send("This user is not on this save file!")
                      }
                    } else {
                      channel.send("Incorrect syntax: ..admin give [savename] [playerID] [itemName] [amount]")
                    }
                  } else {
                    channel.send("This file does not exist!")
                  }
                }
              }
            } catch(err) {
              channel.send("An error occured:\n\n" + err)
            }
          }
        }
      }
    }
  }
}