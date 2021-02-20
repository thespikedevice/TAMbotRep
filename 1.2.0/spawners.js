const discord=require("discord.js")
const fs=require("fs")
const sha1=require("sha1")
const jsonedit=require("./jsonedit.js")
const timesimplify=require("./timesimplify.js")

module.exports={
  init: function(channel, user, msg) {
    var hm=msg.split(" ")
    if (hm[1]=="help") {
      channel.send("..spawners list: List your spawners\n\n..spawners kill: Kill all mobs from spawners")
    } else {
      var skyblockplayers=jsonedit.load("./skyblockplayers.json")
      if (user.id in skyblockplayers) {
        if ("selected" in skyblockplayers[user.id]) {
          var canDo=true
          if ("timers" in skyblockplayers[user.id]) {
            if ("spawners" in skyblockplayers[user.id]["timers"]) {
              var rn=Date.now()
              if (rn>skyblockplayers[user.id]["timers"]["spawners"]) {
                skyblockplayers[user.id]["timers"]["spawners"]=rn+10000
              } else {
                canDo=false
              }
            } else {
              skyblockplayers[user.id]["timers"]["spawners"]=rn+10000
            }
          } else {
            skyblockplayers[user.id]["timers"]={}
            skyblockplayers[user.id]["timers"]["spawners"]=rn+10000
          }
          if (!canDo) {
            channel.send("You are doing that too much, try again in " + timesimplify.simplify(Date.now()-skyblockplayers[user.id]["timers"]["spawners"]))
          } else {
            var mykey=skyblockplayers[user.id]["selected"]
            mykey=sha1(mykey)
            try {
              if (fs.existsSync("./skyfiles/" + mykey + ".json")) {
                var myfile=jsonedit.load("./skyfiles/" + mykey + ".json")
                var myspawners=myfile["spawners"]
                if (hm[1]=="list") {
                  var toPrint="Spawner list:\n\n"
                  var spawnerCount=Math.floor(myspawners.length/10)*10
                  if (hm.length==2) {
                    hm.push(0)
                  }
                  var sspot=parseInt(hm[2])*10
                  if (parseInt(hm[2])<=spawnerCount) {
                    var endSpot=sspot+10
                    spawnerCount=myspawners.length
                    if (endSpot>spawnerCount) {
                      endSpot=spawnerCount
                    }
                    for (var i=sspot;i<endSpot;i++) {
                      var thisSpawner=myspawners[i]
                      toPrint=toPrint+thisSpawner[0]+", level "+thisSpawner[1]+"\nTime: "
                      toPrint=toPrint+timesimplify.simplify(Date.now()-thisSpawner[2])
                      if (i+1<endSpot) {
                          toPrint=toPrint+"\n"
                      }
                    }
                    channel.send(toPrint)
                  } else {
                    channel.send("You only have " + spawnerCount + " pages!")
                  }
                } else if (hm[1]=="kill") {
                  var newSpawnerList=[]
                  var lt=0
                  var rb=0
                  for (var i=0;i<myspawners.length;i++) {
                    var thSpawn=myspawners[i]
                    if (thSpawn[2]<Date.now()) {
                      if (thSpawn[0]=="cow") {
                        rb+=Math.floor(Math.random()*3+1)
                        lt+=Math.floor(Math.random()*3)
                        thSpawn[2]=Date.now()+300000
                      }
                      newSpawnerList.push(thSpawn)
                    } else {
                      newSpawnerList.push(thSpawn)
                    }
                  }
                  var myinv=myfile["inventory"][user.id]
                  if (!("leather" in myinv)) {
                    myinv["leather"]=0
                  }
                  if (!("raw_beef" in myinv)) {
                    myinv["raw_beef"]=0
                  }
                  myinv["raw_beef"]+=rb
                  myinv["leather"]+=lt
                  myfile["inventory"][user.id]=myinv
                  jsonedit.save("./skyfiles/" + mykey + ".json", myfile)
                  channel.send("Mobs killed!")
                }
                jsonedit.save("./skyblockplayers.json", skyblockplayers)
              } else {
                channel.send("Please reload your save with ..skyblock load [filename]")
              }
            } catch(err) {
              channel.send("An error occured, please contact TSD\n\n"+err)
              console.log(err)
            }
          }
        }
      }
    }
  }
}