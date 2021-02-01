const discord=require("discord.js")
const jsonedit=require("./jsonedit")
const sha1=require("sha1")

module.exports={
	init: function(channel, user, msg) {
		hm=msg.split(" ")
		if (hm[1]=="help") {
			channel.send("No help screen available")
		} else {
			var skyblockplayers=jsonedit.load("./skyblockplayers.json")
			if (user.id in skyblockplayers) {
				if ("selected" in skyblockplayers[user.id]) {
					var myfile = skyblockplayers[user.id]["selected"]
					myfile=sha1(myfile)
					try {
						if (fs.existsSync("./skyfiles/" + myfile + ".json")) {
							var mysky=jsonedit.load("./skyfiles/" + myfile + ".json")
							var crecipes=jsonedit.load("./crecipes.json")
							if (hm[1]=="list") {
								var itemsToCraft="Possible Recipes:\n\n"
								var precipes=Object.keys(crecipes)
								for (var i=0;i<precipes.length;i++) {
									itemsToCraft = itemsToCraft+precipes[i]+"\n"
								}
								channel.send(itemsToCraft)
							}
						} else {
							channel.send("Your save file does not exist, please resync your file")
						}
					} catch(err) {
						channel.send("An error occured, please contact TSD\n\n" + err)
					}
				} else {
					channel.send("You don't have a skyblock save selected yet!")
				}
			} else {
				channel.send("You don't have a skyblock save selected yet!")
			}
		}
	}
}