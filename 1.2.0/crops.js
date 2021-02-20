const discord = require("discord.js")
const fs = require("fs")
const jsonedit = require("./jsonedit.js")
const sha1 = require("sha1")
const times = require("./timesimplify.js")

module.exports = {
    init: function(channel, user, msg) {
        var hm = msg.split(" ")
        if (hm[1]=="help") {
            channel.send("..crops list: List crops\n\n..crops harvest: Harvest all crops with finished timers")
        } else {
            var skyplayers = jsonedit.load("./skyblockplayers.json")
            if (user.id in skyplayers) {
                if ("selected" in skyplayers[user.id]) {
                    var iselect = skyplayers[user.id]["selected"]
                    iselect = sha1(iselect)
                    try {
                        if (fs.existsSync("./skyfiles/" + iselect + ".json")) {
                            var mysave = jsonedit.load("./skyfiles/" + iselect + ".json")
                            var mycrops = mysave["crops"]
                            var myinv = mysave["inventory"][user.id]
                            if (hm[1]=="list") {
                                if (mycrops.length == 0) {
                                    channel.send("You do not have any crops")
                                } else {
                                    var printTo = ""
                                    for (var i=0;i<mycrops.length;i++) {
                                        if (i<=25) {
                                            var printTo = printTo + i + ": " + mycrops[i][0] + ", "
                                            var e = mycrops[i][1] - Date.now()
                                            if (e<=0) {
                                                printTo += "Fully grown"
                                            } else {
                                                printTo = printTo + times.simplify(e)
                                            }
                                            if (i+1!=mycrops.length) {
                                                printTo += "\n"
                                            }
                                        } else if (i+1==mycrops.length) {
                                            printTo += "\n\nand more..."
                                        }
                                    }
                                    channel.send(printTo)
                                }
                            } else if (hm[1]=="harvest") {
                                if (mycrops.length==0) {
                                    channel.send("You don't have any crops!")
                                } else {
                                    var bs=0
                                    var br=0
                                    var pt=0
                                    var pk=0
                                    var ps=0
                                    var newcrops = []
                                    for (var i=0;i<mycrops.length;i++) {
                                        var thiscrop = mycrops[i]
                                        if (thiscrop[0]=="beetroot" && thiscrop[1]<=Date.now()) {
                                            bs += Math.floor(Math.random()*3+2)
                                            br += Math.floor(Math.random()*2+1)
                                            mysave["spaceFree"] += 1
                                        } else if (thiscrop[0]=="potato" && thiscrop[1]<=Date.now()) {
                                            pt += Math.floor(Math.random()*4+2)
                                            mysave["spaceFree"] += 1
                                        } else if (thiscrop[0]=="pumpkin" && thiscrop[1]<=Date.now()) {
                                            pk += Math.floor(1)
                                            ps+=Math.floor(Math.random()*2+1)
                                            mysave["spaceFree"] += 3
                                        } else if (thiscrop[1]>Date.now()) {
                                            newcrops.push(thiscrop)
                                        }
                                    }
                                    if (!("beetroot" in myinv)) {
                                        myinv["beetroot"]=0
                                    }
                                    if (!("beetroot_seeds" in myinv)) {
                                        myinv["beetroot_seeds"]=0
                                    }
                                    if (!("potato" in myinv)) {
                                        myinv["potato"]=0
                                    }
                                    if (!("pumpkin" in myinv)) {
                                        myinv["pumpkin"]=0
                                    }
                                    if (!("pumpkin_seeds" in myinv)) {
                                        myinv["pumpkin_seeds"]=0
                                    }
                                    myinv["beetroot_seeds"] += bs
                                    myinv["beetroot"] += br
                                    myinv["potato"]+=pt
                                    myinv["pumpkin"]+=pk
                                    myinv["pumpkin_seeds"]+=ps
                                    mysave["inventory"][user.id] = myinv
                                    mysave["crops"] = newcrops
                                    jsonedit.save("./skyfiles/" + iselect + ".json", mysave)
                                    if (mycrops.length!=newcrops.length) {
                                      channel.send("Crops harvested!")
                                    } else {
                                      channel.send("No crops were harvested!")
                                    }
                                }
                            }
                        } else {
                            channel.send("Save file cannot be found, please reselect")
                        }
                    } catch(err) {
                        channel.send("Save file cannot be found, please reselect: ERRMODE")
                        console.log(err)
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