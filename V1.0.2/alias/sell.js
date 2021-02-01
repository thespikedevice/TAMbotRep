const discord = require("discord.js")
const fs = require("fs")
const sha1 = require("sha1")
const jsonedit = require("../jsonedit.js")
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
                            var buyoff = jsonedit.load("./shopsell.json")
                            if (hm[1] in buyoff) {
                                if (hm[1] in mysky["inventory"][user.id]) {
                                    if (mysky["inventory"][user.id][hm[1]] >= parseInt(hm[2])) {
                                        mysky["inventory"][user.id][hm[1]] -= parseInt(hm[2])
                                        mysky["coins"][user.id] += (parseInt(hm[2]) * buyoff[hm[1]])
                                        jsonedit.save("./skyfiles/" + myid + ".json", mysky)
                                        channel.send("Sold!")
                                    } else {
                                        channel.send("You don't have this many!")
                                    }
                                } else {
                                    channel.send("You don't have any of this item!")
                                }
                            } else {
                                channel.send("You can't sell this item!")
                            }
                        } else {
                            channel.send("Incorrect syntax: ..sell [item] [amount]\n\nReplace all spaces in item name with an underscore!")
                        }
                    } else {
                        channel.send("Please reload your save file, your selected one doesn/'t exist")
                    }
                } catch(err) {
                    channel.send("Please reload your save file, your selected one doesn/'t exist: ERRTYPE")
                    console.log(err)
                }
            } else {
                channel.send("You haven\'t loaded a save file yet!")
            }
        } else {
            channel.send("You haven\'t loaded a save file yet!")
        }
    }
}