const discord=require("discord.js")
const fs=require("fs")
const sha1=require("sha1")
const jsonedit=require("./jsonedit.js")

module.exports={
  init: function(channel, user, msg) {
    var hm=msg.split(" ")
    if (hm[1]=="help") {
      channel.send("..levelcheck needed: Get a list of needed items for upgrade")
    } else {
      var skyplayers=jsonedit.load("./skyblockplayers.json")
      if (user.id in skyplayers) {
        if ("selected" in skyplayers[user.id]) {
          var myid = skyplayers[user.id]["selected"]
          myid=sha1(myid)
          try {
            if (fs.existsSync("./skyfiles/" + myid + ".json")) {
              var mysky=jsonedit.load("./skyfiles/" + myid + ".json")
              if (hm[1]=="needed") {
                var currLvl=mysky["level"]
                var lvlstats=jsonedit.load("./lvlstats.json")
                var needed=lvlstats[currLvl]
                var nKeys=Object.keys(needed)
                var toPrint="Needed to upgrade:\n\n"
                for (var i=0;i<nKeys.length;i++) {
                  toPrint=toPrint+nKeys[i]+": "+needed[nKeys[i]]
                  if (i+1!=nKeys.length) {
                    toPrint=toPrint+"\n"
                  }
                }
                channel.send(toPrint)
              }
            } else {
              channel.send("Please reselect your file with ..skyblock load [filename]")
            }
          }catch(err){
            channel.send("An error occurred, please contact TSD\n\n" + err)
            console.log(err)
          }
        } else {
          channel.send("You haven't selected a file! (..skyblock load [filename])")
        }
      } else {
        channel.send("You haven't selected a file! (..skyblock load [filename])")
      }
    }
  }
}