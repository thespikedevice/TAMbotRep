const discord = require("discord.js");
const fs = require("fs");
const jsonedit = require("../jsonedit.js");
const sha1 = require("sha1");

module.exports = {
  init: function(channel, user, msg) {
    var hm = msg.split(" ");
    if (hm[1] == "help") {
      channel.send("..inv list: List your inventory\n\n..inv use [item] [amount]: Use an item");
    } else {
      var skyplayers = jsonedit.load("./skyblockplayers.json");
      if (user.id in skyplayers) {
        if ("selected" in skyplayers[user.id]) {
          var myid = skyplayers[user.id]["selected"];
          myid = sha1(myid);
          try {
            if (fs.existsSync("./skyfiles/" + myid + ".json")) {
              var mysky = jsonedit.load("./skyfiles/" + myid + ".json");
              if (hm.length >= 3) {
                var myinv = mysky["inventory"][user.id];
                var invuse = jsonedit.load("./invuse.json");
                if (hm[2] in invuse) {
                  if (hm[2] in myinv) {
                    if (myinv[hm[2]] >= parseInt(hm[3])) {
                      if (
                        parseInt(hm[3]) * invuse[hm[2]]["space"] <=
                        mysky["spaceFree"]
                      ) {
                        var itemdata = invuse[hm[2]];
                        for (var i = 0; i < parseInt(hm[3]); i++) {
                          //Class -> Type -> Function
                          if (itemdata["class"] == "tree") {
                            timeboost=1
                            if ("wooden_axe" in myinv) {
                              timeboost-=0.05
                            }
                            if ("stone_axe" in myinv) {
                              timeboost-=0.1
                            }
                            mysky["trees"].push([
                              itemdata["type"],
                              Date.now() + Math.floor(itemdata["timer"]*timeboost)
                            ]);
                          } else if (itemdata["class"] == "crop") {
                            timeboost=1
                            if ("wooden_hoe" in myinv) {
                              timeboost-=0.05
                            }
                            if ("stone_hoe" in myinv) {
                              timeboost-=0.1
                            }
                            mysky["crops"].push([
                              itemdata["type"],
                              Date.now() + Math.floor(itemdata["timer"]*timeboost)
                            ]);
                          } else if (itemdata["class"] == "generator") {
                            if ("wooden_pickaxe" in myinv) {
                              if (myinv["wooden_pickaxe"]!=0) {
                                var timeboost=0.95
                              } else {
                                var timeboost=1
                              }
                            }
                            mysky["generators"].push([
                              itemdata["type"],
                              Date.now() + Math.floor(itemdata["timer"]*timeboost)
                            ]);
                          } else if (itemdata["class"] == "spawner") {
                            var timeboost=1
                            mysky["spawners"].push([
                              itemdata["type"],
                              1,
                              Date.now() + Math.floor(itemdata["timer"]*timeboost)
                            ]);
                          }
                          mysky["spaceFree"] -= itemdata["space"];
                        }
                        mysky["inventory"][user.id][hm[2]] -= parseInt(hm[3]);
                        jsonedit.save("./skyfiles/" + myid + ".json", mysky);
                        if (itemdata["class"] == "tree") {
                          channel.send("Trees planted!");
                        } else if (itemdata["class"] == "crop") {
                          channel.send("Crops planted!");
                        } else if (itemdata["class"] == "generator") {
                          channel.send("Ores placed!");
                        } else if (itemdata["class"]=="spawner") {
                          channel.send("Spawners placed!")
                        }
                      } else {
                        channel.send(
                          "You don't have enough space! You need " +
                            parseInt(hm[3]) * invuse[hm[2]]["space"] +
                            ", but you only have " +
                            mysky["spaceFree"]
                        );
                      }
                    } else {
                      channel.send("You don't have this many!");
                    }
                  } else {
                    channel.send("You don't have any of this item!");
                  }
                } else {
                  channel.send("This item cannot be used!");
                }
              } else {
                channel.send("Incorrect syntax: ..inv use [item] [amount]");
              }
            } else {
              channel.send(
                "Your selected file does not exist, please reselect your file"
              );
            }
          } catch (err) {
            channel.send("An error occured, please contact TSD\n\n" + err);
          }
        } else {
          channel.send("You do not have a file selected!");
        }
      } else {
        channel.send("You do not have a file selected!");
      }
    }
  }
};
