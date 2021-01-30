const discord = require("discord.js")
const fs = require("fs")
const jsonedit = require("./jsonedit.js")
const sha1 = require("sha1")

module.exports = {
	init: function(channel, user, msg) {
        var hm = msg.split(" ")
        if (hm[1]=="help") {
            channel.send("No help screen yet!")
        } else {
            var skyplayers = jsonedit.load("./skyblockplayers.json")
            if (user.id in skyplayers) {
                if ("selected" in skyplayers[user.id]) {
                    var myid = skyplayers[user.id]["selected"]
                    myid = sha1(myid)
                    try {
                        if (fs.existsSync("./skyfiles/" + myid + ".json")) {
                            var mysky = jsonedit.load("./skyfiles/" + myid + ".json")
                            if (hm[1]=="list") {
                                var myinv = mysky["inventory"][user.id]
                                var myitems = Object.keys(myinv)
                                if (myitems.length!=0) {
                                    var toSend = ""
                                    for (var i=0;i<myitems.length;i++) {
                                        toSend = toSend + myitems[i] + ": " + myinv[myitems[i]]
                                        if (i+1!=myitems.length) {
                                            toSend += "\n"
                                        }
                                    }
                                    channel.send(toSend)
                                } else {
                                    channel.send("You don't have any items!")
                                }
                            } else if (hm[1]=="use") {
                                if (hm.length>=3) {
                                    var myinv = mysky["inventory"][user.id]
                                    var invuse = jsonedit.load("./invuse.json")
                                    if (hm[2] in invuse) {
                                        if (hm[2] in myinv) {
                                            if (myinv[hm[2]]>=parseInt(hm[3])) {
                                                if ((parseInt(hm[3])*invuse[hm[2]]["space"])<=mysky["spaceFree"]) {
                                                    var itemdata = invuse[hm[2]]
                                                    for (var i=0;i<parseInt(hm[3]);i++) {
                                                        //Class -> Type -> Function
                                                        if (itemdata["class"]=="tree") {
                                                            mysky["trees"].push([itemdata["type"], Date.now()+itemdata["timer"]])
                                                        } else if (itemdata["class"]=="crop") {
                                                            mysky["crops"].push([itemdata["type"], Date.now()+itemdata["timer"]])
                                                        }
                                                        mysky["spaceFree"] -= itemdata["space"]
                                                    }
                                                    mysky["inventory"][user.id][hm[2]] -= parseInt(hm[3])
                                                    jsonedit.save("./skyfiles/" + myid + ".json", mysky)
                                                    if (itemdata["class"]=="tree") {
                                                        channel.send("Trees planted!")
                                                    } else if (itemdata["class"]=="crop") {
                                                        channel.send("Crops planted!")
                                                    }
                                                } else {
                                                    channel.send("You don't have enough space! You need " + (parseInt(hm[3])*invuse[hm[2]]["space"]) + ", but you only have " + mysky["spaceFree"])
                                                }
                                            } else {
                                                channel.send("You don't have this many!")
                                            }
                                        } else {
                                            channel.send("You don't have any of this item!")
                                        }
                                    } else {
                                        channel.send("This item cannot be used!")
                                    }
                                } else {
                                    channel.send("Incorrect syntax: ..inv use [item] [amount]")
                                }
                            }
                        } else {
                            channel.send("Your selected file does not exist, please reselect your file")
                        }
                    } catch(err) {
                        channel.send("An error occured, please contact TSD\n\n" + err)
                    }
                } else {
                    channel.send("You do not have a file selected!")
                }
            } else {
                channel.send("You do not have a file selected!")
            }
        }
    }
}