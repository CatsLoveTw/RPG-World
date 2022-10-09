import * as Minecraft from "mojang-minecraft";

const cmd = function(command) {
    return Minecraft.world.getDimension("overworld").runCommand(command).statusMessage
};
  
const logfor = function(playername,message) {
    let okay_message = message.toString().replaceAll('\"',"''").replaceAll('\\',"/")
    Minecraft.world.getDimension("overworld").runCommand(`tellraw "${playername}" {"rawtext":[{"text":"${okay_message}"}]}`)
};
const logforTarget = function(Target,message) {
    let okay_message = message.toString().replaceAll('\"',"''").replaceAll('\\',"/")
    Minecraft.world.getDimension("overworld").runCommand(`tellraw ${Target} {"rawtext":[{"text":"${okay_message}"}]}`)
}

const titlefor = function(playername,message) {
    let okay_message = message
    Minecraft.world.getDimension("overworld").runCommand(`titleraw "${playername}" actionbar {"rawtext":[{"text":"${okay_message}"}]}`)
}

const titlelog = function(message) {
    let okay_message = message
    Minecraft.world.getDimension("overworld").runCommand(`titleraw @a actionbar {"rawtext":[{"text":"${okay_message}"}]}`)
}
const GetWorldPlayersName = function() {
    let callback = cmd("list")

    callback = callback.substring(callback.indexOf('\n')+1,callback.length)

    let result = callback.match(/\S+/)

    for (let i = 0 ; i < result ; i++) {
        let name = result[i]
        let detectLocation = name.length-1

        if (name[detectLocation] == ',') {
            result[i][detectLocation] = ''
        }
        
    }
    return result
}

const log = function(message) {
    let okay_message = message.toString().replaceAll('\"',"''").replaceAll('\\',"/")
    Minecraft.world.getDimension("overworld").runCommand(`tellraw @a {"rawtext":[{"text":"${okay_message}"}]}`).statusMessage
}

function GetPlayerTags(Playername) {
    try {
        let GetTagsMsg = Minecraft.Commands.run(`tag "${Playername}" list`,Minecraft.World.getDimension("overworld")).statusMessage;
        let GetTagsListReg = /(:|：)(.*, ).*/
        let GfReturn = GetTagsMsg.match(GetTagsListReg)[0]
        if (GfReturn.includes("：")) {GfReturn = GfReturn.substring(GfReturn.indexOf("：")+1,GfReturn.length).split(", ")}
        else {GfReturn = GfReturn.substring(GfReturn.indexOf(":")+1,GfReturn.length).split(", ")}
        for (let tag in GfReturn) {GfReturn[tag] = GfReturn[tag].substring(2,GfReturn[tag].length-2)}
        return GfReturn
    }
    catch (error) {
        return []
    }
}

function GetPlayerScoreboards (Playername) {
    try {
        let GetScoresMsg = Minecraft.Commands.run(`scoreboard players list "${Playername}"`,Minecraft.World.getDimension("overworld")).statusMessage;
        let GetScoresListReg = /- \S+(:|：) (\S+) \((\S+)\)/gi
        let GetScoresValueAndKeyReg = /- \S+(:|：) (\S+) \((\S+)\)/
        let GetScoresTest = GetScoresMsg.match(GetScoresListReg)
        let GetScoresDict = {}
        for (let score in GetScoresTest) {GetScoresDict[GetScoresTest[score].match(GetScoresValueAndKeyReg)[3]] = parseInt(GetScoresTest[score].match(GetScoresValueAndKeyReg)[2],10)}
        let GfReturn = GetScoresDict
        return GfReturn
    }
    catch (error) {
        return error
    }
}

export {GetPlayerTags, GetPlayerScoreboards, cmd, logfor, logforTarget, log, GetWorldPlayersName, titlefor, titlelog}

/*
GetPlayerScoreboards(playername) 回傳玩家所有記分板的字典
GetPlayerTags(playername) 回傳玩家所有標籤的陣列
cmd(command) 執行指令並回傳執行訊息
log(messgae) 傳送給所有玩家titleraw訊息
logfor(playername,messgae) 傳送給指定玩家titleraw訊息
PosX(PlayerClass) 回傳處理過後的玩家X座標
PosY(PlayerClass) 回傳處理過後的玩家Y座標
PosZ(PlayerClass) 回傳處理過後的玩家Z座標
*/