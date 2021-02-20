const discord = require("discord.js");
const fs = require("fs");
const sha1 = require("sha1");
const jsonedit = require("./jsonedit.js");
module.exports = {
  init: function(channel, user, msg) {
    var hm = msg.split(" ");
    if (hm[1] == "help") {
      channel.send(
        "shop help: Loads the help screen\n\nshop list: List all items that the player can buy\n\nshop buy [item] [amount]: Buy an item\n\nshop sell [item] [amount]: Sell an item"
      );
    } else {
      var skyplayers = jsonedit.load("./skyblockplayers.json");
      if (user.id in skyplayers) {
        if ("selected" in skyplayers[user.id]) {
          var myid = skyplayers[user.id]["selected"];
          myid = sha1(myid);
          try {
            if (fs.existsSync("./skyfiles/" + myid + ".json")) {
              var mysky = jsonedit.load("./skyfiles/" + myid + ".json");
              if (hm[1] == "list") {
                var myshop = jsonedit.load("./shopbuy.json");
                var mykeys = Object.keys(myshop);
                var shoptext =
                  "You have " + mysky["coins"][user.id] + " coins.\n\n";
                for (var i = 0; i < mykeys.length; i++) {
                  if (myshop[mykeys[i]][1] <= mysky["level"]) {
                    shoptext =
                      shoptext + mykeys[i] + ": " + myshop[mykeys[i]][0];
                    if (i + 1 != mykeys.length) {
                      shoptext += "\n";
                    }
                  }
                }
                channel.send(shoptext);
              } else if (hm[1] == "buy") {
                if (hm.length == 4) {
                  var myshop = jsonedit.load("./shopbuy.json");
                  if (hm[2] in myshop) {
                    if (myshop[hm[2]][1] <= mysky["level"]) {
                      try {
                        var cost = myshop[hm[2]][0] * parseInt(hm[3]);
                        if (cost <= mysky["coins"][user.id]) {
                          mysky["coins"][user.id] -= cost;
                          if (hm[2] in mysky["inventory"][user.id]) {
                            mysky["inventory"][user.id][hm[2]] += parseInt(
                              hm[3]
                            );
                          } else {
                            mysky["inventory"][user.id][hm[2]] = parseInt(
                              hm[3]
                            );
                          }
                          jsonedit.save("./skyfiles/" + myid + ".json", mysky);
                          channel.send("Item(s) purchased!");
                        } else {
                          channel.send("You don't have enough coins for that!");
                        }
                      } catch (err) {
                        console.log(err);
                        channel.send("An error occured, please contact TSD");
                        channel.send("\n" + err);
                      }
                    } else {
                      channel.send("You aren't a high enough level for that!")
                    }
                  } else {
                    channel.send("That item isn't in the shop!");
                  }
                } else {
                  channel.send(
                    "Incorrect syntax: ..shop buy [item] [amount]\n\nReplace all spaces in the item name with an underscore!"
                  );
                }
              } else if (hm[1] == "sell") {
                if (hm.length == 4) {
                  var buyoff = jsonedit.load("./shopsell.json");
                  if (hm[2] in buyoff) {
                    if (hm[2] in mysky["inventory"][user.id]) {
                      if (
                        mysky["inventory"][user.id][hm[2]] >= parseInt(hm[3])
                      ) {
                        mysky["inventory"][user.id][hm[2]] -= parseInt(hm[3]);
                        mysky["coins"][user.id] +=
                          parseInt(hm[3]) * buyoff[hm[2]];
                        jsonedit.save("./skyfiles/" + myid + ".json", mysky);
                        channel.send("Sold!");
                      } else {
                        channel.send("You don't have this many!");
                      }
                    } else {
                      channel.send("You don't have any of this item!");
                    }
                  } else {
                    channel.send("You can't sell this item!");
                  }
                } else {
                  channel.send(
                    "Incorrect syntax: ..shop sell [item] [amount]\n\nReplace all spaces in item name with an underscore!"
                  );
                }
              }
            } else {
              channel.send(
                "Please reload your save file, your selected one doesn/'t exist"
              );
            }
          } catch (err) {
            channel.send(
              "Please reload your save file, your selected one doesn/'t exist: ERRTYPE"
            );
            console.log(err);
          }
        } else {
          channel.send("You haven't loaded a save file yet!");
        }
      } else {
        channel.send("You haven't loaded a save file yet!");
      }
    }
  }
};
