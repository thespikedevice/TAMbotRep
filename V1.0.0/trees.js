const discord = require("discord.js")
const fs = require("fs")
const jsonedit = require("./jsonedit.js")
const sha1 = require("sha1")

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
                            var mytrees = mysave["trees"]
                            var myinv = mysave["inventory"][user.id]
                            if (hm[1]=="list") {
                                if (mytrees.length == 0) {
                                    channel.send("You do not have any trees")
                                } else {
                                    var printTo = ""
                                    for (var i=0;i<mytrees.length;i++) {
                                        var printTo = printTo + mytrees[i][0] + ", "
                                        var e = mytrees[i][1] - Date.now()
                                        if (e<=0) {
                                            printTo += "Fully grown"
                                        } else {
                                            printTo = printTo + (parseInt(e)/1000) + " seconds"
                                        }
                                        if (i+1!=mytrees.length) {
                                            printTo += "\n"
                                        }
                                    }
                                    channel.send(printTo)
                                }
                            } else if (hm[1]=="harvest") {
                                if (mytrees.length==0) {
                                    channel.send("You don't have any trees!")
                                } else {
                                    var ow = 0
                                    var apple = 0
                                    var os = 0
                                    var newtrees = []
                                    for (var i=0;i<mytrees.length;i++) {
                                        var thistree = mytrees[i]
                                        if (thistree[0]=="oak" && thistree[1]<=Date.now()) {
                                            ow += Math.floor(Math.random()*3+4)
                                            apple += Math.floor(Math.random()*3)
                                            os += Math.floor(Math.random()*2+1)
                                            mysave["spaceFree"] += 3
                                        } else if (thistree[1]>Date.now()) {
                                            newtrees.push(thistree)
                                        }
                                    }
                                    if (!("oak_sapling" in myinv)) {
                                        myinv["oak_sapling"]=0
                                    }
                                    if (!("apple" in myinv)) {
                                        myinv["apple"]=0
                                    }
                                    if (!("oak_wood" in myinv)) {
                                        myinv["oak_wood"]=0
                                    }
                                    myinv["oak_sapling"] += os
                                    myinv["oak_wood"] += ow
                                    myinv["apple"] += apple
                                    mysave["inventory"][user.id] = myinv
                                    mysave["trees"] = newtrees
                                    jsonedit.save("./skyfiles/" + iselect + ".json", mysave)
                                    channel.send("Trees harvested!")
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