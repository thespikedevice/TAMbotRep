const discord = require("discord.js");
const fs = require("fs");
const jsonedit = require("./jsonedit.js");
const sha1 = require("sha1");
const times = require("./timesimplify.js");

module.exports = {
  init: function(channel, user, msg) {
    var hm = msg.split(" ");
    if (hm[1] == "help") {
      channel.send(
        "..ores list: List all placed generators\n\n..ores harvest: Harvest all placed ores"
      );
    } else {
      var skyplayers = jsonedit.load("./skyblockplayers.json");
      if (user.id in skyplayers) {
        if ("selected" in skyplayers[user.id]) {
          var iselect = skyplayers[user.id]["selected"];
          iselect = sha1(iselect);
          try {
            if (fs.existsSync("./skyfiles/" + iselect + ".json")) {
              var mysave = jsonedit.load("./skyfiles/" + iselect + ".json");
              var myores = mysave["generators"];
              var myinv = mysave["inventory"][user.id];
              if (hm[1] == "list") {
                if (myores.length == 0) {
                  channel.send("You do not have any ores");
                } else {
                  var printTo = "";
                  for (var i = 0; i < myores.length; i++) {
                    if (i <= 25) {
                      var printTo = printTo + myores[i][0] + ", ";
                      var e = myores[i][1] - Date.now();
                      if (e <= 0) {
                        printTo += "Fully grown";
                      } else {
                        printTo = printTo + times.simplify(e);
                      }
                      if (i + 1 != myores.length) {
                        printTo += "\n";
                      }
                    } else if (i + 1 == myores.length) {
                      printTo += "\n\nAnd more...";
                    }
                  }
                  channel.send(printTo);
                }
              } else if (hm[1] == "harvest") {
                if (myores.length == 0) {
                  channel.send("You don't have any ores!");
                } else {
                  var cb = 0;
                  var co=0
                  var newores = [];
                  var oreboost=1
                  if ("wooden_pickaxe" in myinv) {
                    oreboost-=0.05
                  }
                  if ("stone_pickaxe" in myinv) {
                    oreboost-=0.1
                  }
                  for (var i = 0; i < myores.length; i++) {
                    var thisore = myores[i];
                    if (
                      thisore[0] == "cobblestone" &&
                      thisore[1] <= Date.now()
                    ) {
                      cb += Math.floor(1);
                      newores.push(["cobblestone", Date.now() + Math.floor(10000*oreboost)]);
                    } else if (
                      thisore[0] == "coal" &&
                      thisore[1] <= Date.now()
                    ) {
                      co += Math.floor(1);
                      newores.push(["coal", Date.now() + Math.floor(60000*oreboost)]);
                    } else if (thisore[1] > Date.now()) {
                      newores.push(thisore);
                    }
                  }
                  if (!("cobblestone" in myinv)) {
                    myinv["cobblestone"] = 0;
                  }
                  if (!("coal" in myinv)) {
                    myinv["coal"]=0
                  }
                  myinv["cobblestone"] += cb;
                  myinv["coal"]+=co
                  mysave["inventory"][user.id] = myinv;
                  mysave["generators"] = newores;
                  jsonedit.save("./skyfiles/" + iselect + ".json", mysave);
                  channel.send("Ores harvested, check your inventory to see if the timers were ready!")
                }
              }
            } else {
              channel.send("Save file cannot be found, please reselect");
            }
          } catch (err) {
            channel.send("An error occured, please contact TSD:\n\n" + err);
            console.log(err);
          }
        } else {
          channel.send("You haven't selected a save file yet!");
        }
      } else {
        channel.send(
          "You haven't started a save file yet: ..skyblock create [name]"
        );
      }
    }
  }
};
