const discord=require("discord.js")
const jsonedit=require("./jsonedit")
const sha1=require("sha1")
const fs=require("fs")

module.exports={
	init: function(channel, user, msg) {
		var hm=msg.split(" ")
		if (hm[1]=="help") {
			channel.send("..craft craft [recipe] [amount]: Craft an item\n\n..craft list (page): List crafting recipes\n\n..craft details [recipe]: Get details on a single recipe")
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
                if (hm.length==3) {
                  var startPos=parseInt(hm[2])*25-25
                } else {
                  var startPos=0
                }
                var endPos=startPos+25
								var itemsToCraft="Possible Recipes:\n\n"
								var precipes=Object.keys(crecipes)
                if (startPos-1>precipes.length) {
                  channel.send("This page does not exist, there are 1 page(s)")
                } else {
                  if (endPos>precipes.length) {
                    endPos=precipes.length
                  }
                  for (var i=startPos;i<precipes.length;i++) {
                    itemsToCraft = itemsToCraft+precipes[i]+"\n"
                  }
                  channel.send(itemsToCraft)
                }
							} else if (hm[1]=="details") {
                var precipes=Object.keys(crecipes)
                if (hm.length==3) {
                  if (precipes.indexOf(hm[2])!=-1) {
                    var myrecipe = crecipes[hm[2]]
                    var ingrs=crecipes[hm[2]]["ingredients"]
                    var ingrnames=Object.keys(ingrs)
                    var sendback=hm[2] + ": \n\n"
                    for (var i=0;i<ingrnames.length;i++) {
                      sendback=sendback+ingrnames[i]+": "
                      sendback=sendback+ingrs[ingrnames[i]]
                      if (i+1!=ingrnames.length) {
                        sendback+="\n"
                      }
                    }
                    sendback=sendback+"\n\nCount: " + crecipes[hm[2]]["count"]
                    sendback=sendback+"\n\nDescription: " + crecipes[hm[2]]["desc"]
                    channel.send(sendback)
                  } else {
                    channel.send("This recipe does not exist!")
                  }
                } else {
                  channel.send("Incorrect syntax: ..craft details [recipe]")
                }
              } else if (hm[1]=="craft") {
                var precipes=Object.keys(crecipes)
                if (hm.length==4) {
                  if (precipes.indexOf(hm[2])!=-1) {
                    var myrecipe=crecipes[hm[2]]
                    var ingrs=myrecipe["ingredients"]
                    var ingrnames=Object.keys(ingrs)
                    var canCraft=true
                    var myinv=mysky["inventory"][user.id]
                    if (hm[2] in myinv) {
                      if (myinv[hm[2]]!=0 && myrecipe["limitOne"]) {
                        channel.send("You can't craft more than one of this!")
                        canCraft=false
                      }
                    } else if (myrecipe["limitOne"] && parseInt(hm[3])>1) {
                      channel.send("You can't craft more than one of this!")
                      canCraft=false
                    } else {
                      if (canCraft) {
                        for (var i=0;i<ingrnames.length;i++) {
                          if (canCraft) {
                            var mykey=ingrnames[i]
                            if (mykey in myinv) {
                              var mycount=myinv[mykey]
                              var needed=ingrs[ingrnames[i]]*parseInt(hm[3])
                              if (needed>mycount) {
                                canCraft=false
                              }
                            } else {
                              canCraft=false
                            }
                          }
                        }
                        if (canCraft) {
                          for (var i=0;i<ingrnames.length;i++) {
                            var needed=ingrs[ingrnames[i]]*parseInt(hm[3])
                            myinv[ingrnames[i]]-=needed
                          }
                          if (!(hm[2] in myinv)) {
                            myinv[hm[2]]=(parseInt(hm[3])*myrecipe["count"])
                          } else {
                            myinv[hm[2]]+=(parseInt(hm[3])*myrecipe["count"])
                          }
                          mysky["inventory"][user.id]=myinv
                          jsonedit.save("./skyfiles/" + myfile + ".json", mysky)
                          channel.send("Crafted!")
                        } else {
                          channel.send("You don't have enough items for this!")
                        }
                      }
                    }
                  } else {
                    channel.send("This recipe does not exist!")
                  }
                } else {
                  channel.send("Incorrect syntax: ..craft craft [recipe] [amount]")
                }
              }
						} else {
							channel.send("Your save file does not exist, please resync your file")
						}
					} catch(err) {
						channel.send("An error occured, please contact TSD\n\n" + err)
            console.log(err)
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