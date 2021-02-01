const discord = require("discord.js")
const fs = require("fs")
const jsonedit = require("../jsonedit.js")
const sha1 = require("sha1")

module.exports = {
	init: function(channel, user, msg) {
        var hm = msg.split(" ")
        var skyplayers = jsonedit.load("./skyblockplayers.json")
        if (user.id in skyplayers) {
            if ("selected" in skyplayers[user.id]) {
                var myid = skyplayers[user.id]["selected"]
                myid = sha1(myid)
                try {
                    if (fs.existsSync("./skyfiles/" + myid + ".json")) {
                        var mysky = jsonedit.load("./skyfiles/" + myid + ".json")
                        if (hm.length==3) {
                            var myinv = mysky["inventory"][user.id]
                            var invuse = jsonedit.load("./invuse.json")
                            if (hm[1] in invuse) {
                                if (hm[1] in myinv) {
                                    if (myinv[hm[1]]>=parseInt(hm[2])) {
                                        if ((parseInt(hm[2])*invuse[hm[1]]["space"])<=mysky["spaceFree"]) {
                                            var itemdata = invuse[hm[1]]
                                            for (var i=0;i<parseInt(hm[2]);i++) {
                                                //Class -> Type -> Function
                                                if (itemdata["class"]=="tree") {
                                                    mysky["trees"].push([itemdata["type"], Date.now()+itemdata["timer"]])
                                                } else if (itemdata["class"]=="crop") {
                                                    mysky["crops"].push([itemdata["type"], Date.now()+itemdata["timer"]])
                                                }
                                                mysky["spaceFree"] -= itemdata["space"]
                                            }
                                            mysky["inventory"][user.id][hm[1]] -= parseInt(hm[2])
                                            jsonedit.save("./skyfiles/" + myid + ".json", mysky)
                                            if (itemdata["class"]=="tree") {
                                                channel.send("Trees planted!")
                                            } else if (itemdata["class"]=="crop") {
                                                channel.send("Crops planted!")
                                            }
                                        } else {
                                            channel.send("You don't have enough space! You need " + (parseInt(hm[2])*invuse[hm[1]]["space"]) + ", but you only have " + mysky["spaceFree"])
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
                            channel.send("Incorrect syntax: ..use [item] [amount]")
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