const discord = require("discord.js")
const sha1 = require("sha1")
const fs = require("fs")
const jsonedit = require("./jsonedit.js")

module.exports = {
  init: function(channel, user, msg, acmsg) {
    var hm = msg.split(" ")
    if (hm[1] == "create") {
      if (hm.length == 3) {
        var shatag = hm[2]
        shatag = sha1(shatag)
        try {
          if (fs.existsSync("./skyfiles/" + shatag + ".json")) {
            channel.send("This name already exists, please use another name")
          } else {
            var userid = user.id
            var skyBasis = {
              name: hm[2],
              password: null,
              users: [user.id],
              spaceFree: 100,
              trees: [["oak", Date.now()]],
              generators: [],
              coins: {},
              level: 1,
              inventory: {},
              crops: [["beetroot", Date.now()]],
              owner: user.id,
              spawners: []
            }
            skyBasis["coins"][user.id] = 0
            skyBasis["inventory"][user.id] = {}
            console.log(skyBasis)
            fs.writeFile("./skyfiles/" + shatag + ".json", JSON.stringify(skyBasis), function() {console.log("it worked")})
            jsonedit.save("./skyfiles/" + shatag + ".json", skyBasis)
            channel.send("Skyblock created, switch to it with ..skyblock load [name]")
          }
        } catch(err) {
          console.log(err)
        }
      } else {
        channel.send("Incorrect syntax: ..skyblock create [name]. Your name cannot have any spaces!")
      }
    } else if (hm[1] == "load") {
      if (hm.length==3) {
        var shatag = hm[2]
        shatag = sha1(shatag)
        try {
          if (fs.existsSync("./skyfiles/" + shatag + ".json")) {
            var skyData = jsonedit.load("./skyfiles/" + shatag + ".json")
            if (skyData["users"].indexOf(user.id)!=-1) {
              var memberdata = jsonedit.load("./skyblockplayers.json")
              if (!(user.id in memberdata)) {
                memberdata[user.id] = {}
              }
              memberdata[user.id]["selected"] = hm[2]
              jsonedit.save("./skyblockplayers.json", memberdata)
              channel.send("Set correctly!")
            } else {
              channel.send("You aren\'t allowed on this save file!")
            }
          } else {
            channel.send("This save doesn\'t exist!")
          }
        } catch(err) {
          console.log(err)
        }
      } else {channel.send("Incorrect syntax: ..skyblock load [name]")}
    } else if (hm[1]=="delete") {
        if (hm.length==2) {
            var memberdata = jsonedit.load("./skyblockplayers.json")
            if (user.id in memberdata) {
                if ("selected" in memberdata[user.id]) {
                    var savename = memberdata[user.id]["selected"]
                    savename = sha1(savename)
                    try {
                        if (fs.existsSync("./skyfiles/" + savename + ".json")) {
                            var mysavefile = jsonedit.load("./skyfiles/" + savename + ".json")
                            if (mysavefile["owner"]==user.id) {
                                try {
                                    fs.unlinkSync("./skyfiles/" + savename + ".json")
                                    channel.send("File deleted, please make sure to relink your new file!")
                                } catch(err) {
                                    console.log(err)
                                    channel.send("An error occured, please contact TSD\n\n" + err)
                                }
                            } else {
                                channel.send("You aren't the owner!")
                            }
                        } else {
                            channel.send("Your selected save no longer exists!")
                        }
                    } catch(err) {
                        console.log(err)
                        channel.send("An error occured, please call TSD\n\n" + err)
                    }
                } else {
                    channel.send("You don't have a save file selected!")
                }
            } else {
                channel.send("You've never selected a save file!")
            }
        } else {
            channel.send("Incorrect syntax: ..skyblock delete")
        }
    } else if (hm[1]=="invite") {
      var pti=acmsg.mentions.users.first().id
      console.log(pti)
      var memberdata=jsonedit.load("./skyblockplayers.json")
      if (user.id in memberdata) {
        if ("selected" in memberdata[user.id]) {
          var myfile=memberdata[user.id]["selected"]
          myfile=sha1(myfile)
          try {
            if (fs.existsSync("./skyfiles/" + myfile + ".json")) {
              var ourfile=jsonedit.load("./skyfiles/" + myfile + ".json")
              if (ourfile["owner"]==user.id) {
                ourfile["users"].push(pti)
                ourfile["coins"][pti]=0
                ourfile["inventory"][pti]={}
                channel.send("Player invited!")
                jsonedit.save("./skyfiles/" + myfile + ".json", ourfile)
              } else {
                channel.send("You have to be owner to do this!")
              }
            } else {
              channel.send("Please reselect your file")
            }
          } catch(err) {
            channel.send("An error occured, please contact TSD\n\n" + err)
            console.log(err)
          }
        }
      }
    }
  }
}