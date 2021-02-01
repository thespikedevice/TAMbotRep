const discord = require("discord.js")
const fs = require("fs")
const jsonedit = require("./jsonedit.js")
const sha1 = require("sha1")
const times = require("./timesimplify.js")

module.exports = {
    init: function(channel, user, msg) {
        var hm = msg.split(" ")
        if (hm[1]=="help") {
            channel.send("No help screen yet")
        } else {
            var skyplayers = jsonedit.load("./skyblockplayers.json")
            if (user.id in skyplayers) {
                if ("selected" in skyplayers[user.id]) {
                    var iselect = skyplayers[user.id]["selected"]
                    iselect = sha1(iselect)
                    try {
                        if (fs.existsSync("./skyfiles/" + iselect + ".json")) {
                            var mysave = jsonedit.load("./skyfiles/" + iselect + ".json")
                            var myores = mysave["generators"]
                            var myinv = mysave["inventory"][user.id]
                            if (hm[1]=="list") {
                                if (myores.length == 0) {
                                    channel.send("You do not have any ores")
                                } else {
                                    var printTo = ""
                                    for (var i=0;i<myores.length;i++) {
                                        if (i<=25) {
                                            var printTo = printTo + myores[i][0] + ", "
                                            var e = myores[i][1] - Date.now()
                                            if (e<=0) {
                                                printTo += "Fully grown"
                                            } else {
                                                printTo = printTo + times.simplify(e)
                                            }
                                            if (i+1!=myores.length) {
                                                printTo += "\n"
                                            }
                                        } else if (i+1==myores.length) {
                                            printTo += "\n\nAnd more..."
                                        }
                                    }
                                    channel.send(printTo)
                                }
                            } else if (hm[1]=="harvest") {
                                if (myores.length==0) {
                                    channel.send("You don't have any ores!")
                                } else {
                                    var ow = 0
                                    var apple = 0
                                    var os = 0
                                    var newores = []
                                    for (var i=0;i<myores.length;i++) {
                                        var thisore = myores[i]
                                        if (thisore[0]=="cobblestone" && thisore[1]<=Date.now()) {
                                            cb += Math.floor(1)
											newores.push(["cobblestone", Date.now()+10000])
                                        } else if (thisore[1]>Date.now()) {
                                            newores.push(thisore)
                                        }
                                    }
                                    if (!("cobblestone" in myinv)) {
                                        myinv["cobblestone"]=0
                                    }
                                    myinv["cobblestone"] += cb
                                    mysave["inventory"][user.id] = myinv
                                    mysave["generators"] = newores
                                    jsonedit.save("./skyfiles/" + iselect + ".json", mysave)
                                    channel.send("Ores harvested!")
                                }
                            }
                        } else {
                            channel.send("Save file cannot be found, please reselect")
                        }
                    } catch(err) {
                        channel.send("Save file cannot be found, please reselect: ERRMODE")
                    }
                } else {
                    channel.send("You haven\'t selected a save file yet!")
                }
            } else {
                channel.send("You haven\'t started a save file yet: ..skyblock create [name]")
            }
        }
    }
}