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
                            var myshop = jsonedit.load("./shopbuy.json")
                            if (hm[2] in myshop) {
                                try {
                                    var cost = myshop[hm[1]] * parseInt(hm[2])
                                    if (cost<=mysky["coins"][user.id]) {
                                        mysky["coins"][user.id] -= cost
                                        if (hm[1] in mysky["inventory"][user.id]) {
                                            mysky["inventory"][user.id][hm[1]] += parseInt(hm[2])
                                        } else {
                                            mysky["inventory"][user.id][hm[1]] = parseInt(hm[2])
                                        }
                                        jsonedit.save("./skyfiles/" + myid + ".json", mysky)
                                        channel.send("Item(s) purchased!")
                                    } else {
                                        channel.send("You don't have enough coins for that!")
                                    }
                                } catch(err) {
                                    console.log(err)
                                    channel.send("An error occured, please contact TSD")
                                    channel.send("\n" + err)
                                }
                            } else {
                                channel.send("That item isn't in the shop!")
                            }
                        } else {
                            channel.send("Incorrect syntax: ..buy [item] [amount]\n\nReplace all spaces in the item name with an underscore!")
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