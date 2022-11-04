import { world } from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import {cmd, log, logfor} from '../lib/GametestFunctions.js'
import { isNum, randomInt, worldlog } from '../lib/function.js'

// | 或 §
function getScore (player, scoreName) {
    cmd(`scoreboard players add ${player} ${scoreName} 0`)
    return worldlog.getScoreFromMinecraft(player, scoreName).score
}
    let locationtag = []
    let location = []
export function updateafk (playerData) {

        world.events.blockBreak.subscribe(ev => {
            const {player} = ev
            player.runCommand('scoreboard players set @s testafk 1')
        })
         for (let tag of playerData.getTags()) {
            if (tag.startsWith("location:")) {
                locationtag.push(tag)
                let locname = tag.split(":")[1]
                //log (locname)
                let loc = [locname.split(',')[0], locname.split(',')[1], locname.split(',')[2]]
                //log (`loc ${loc}`)
                try {cmd (`tag "${playerData.name}" remove "${tag}"`)} catch (error) {logfor (playerData.name, error)}
                location = loc
            }
         }
           
            cmd (`tag "${playerData.name}" add "location:${playerData.location.x},${playerData.location.y},${playerData.location.z}"`)
         
    if (locationtag.length == 0) {
        return;
    }
    return location
}

export function cheakafk (playerData, location, setafkNumber) {
    //logfor (playerData.name, `x=${location[0]} y=${location[1]} z=${location[2]}\nplayer : x=${playerData.location.x} y=${playerData.location.y} z=${playerData.location.z}`)
    if (location[0] == playerData.location.x && location[1] == playerData.location.y && location[2] == playerData.location.z) {
        cmd (`scoreboard players add "${playerData.name}" testafk 1`)
       }
    let playertime = Number(getScore(playerData.name, "testafk"))  
    if (playertime > 0) {
        if (location[0] != playerData.location.x || location[1] != playerData.location.y || location[2] != playerData.location.z) {
            if (Math.trunc(playerData.location.x) != -99 || Math.trunc(playerData.location.z) != 0) {
            cmd (`scoreboard players set "${playerData.name}" testafk 0`)
            }
        }
    }  
    if (playertime == setafkNumber) {
        cmd (`tag "${playerData.name}" add afk`)
        // log (`§3§l>> §f${playerData.name} §e§l正在掛機`)
        // cmd (`tp "${playerData.name}" -100 200 0`)
    } 
    if (playertime > setafkNumber) {
        cmd (`scoreboard players add "${playerData.name}" afktime 1`)
        cmd (`title "${playerData.name}" times 0 40 0`)
        cmd (`title "${playerData.name}" title §e§l`)
        cmd (`title "${playerData.name}" subtitle §c§lYou Are AFK!`)
    }
    if (playerData.hasTag("afk")) {
    if (location[0] != playerData.location.x || location[1] != playerData.location.y || location[2] != playerData.location.z || Number(getScore(playerData.name, 'testafk')) < 180) {
        if (Math.trunc(playerData.location.x) != -99 || Math.trunc(playerData.location.z) != 0) {
        let afktime = Number(getScore(playerData.name, 'afktime'))
        let sec = 0
        let min = 0
        let hour = 0
        let day = 0
        for (let i=0; i<=70; i++) {
        if (afktime >= 60) {
            min++
            afktime = afktime-60
        } else {sec = afktime}
        if (min >= 60) {
            hour++
            min = min-60
        } else {
            min = min
        }
        if (hour >= 24) {
            day++
            hour = hour-24
        } else {
            hour = hour
        }
        }
        // 換算分鐘/小時/天

        if (sec < 10) {
            sec = "0" + sec
        } 
        if (min < 10) {
            min = "0" + min
        }
        if (hour < 10) {
            hour = "0" + hour
        }
        if (day < 10) {
            day = "0" + day
        }
        // 調整顯示
      //  log (`${Math.trunc(playerData.location.x)} ${Math.trunc(playerData.location.y)} ${Math.trunc(playerData.location.z)}`)
        logfor (playerData.name, `§3§l>> ${playerData.name} §e§l回來了 §f(§b共掛機 §e${day} 天 ${hour} 小時 ${min} 分鐘 ${sec} 秒)`)
        // log(playerData.hasTag("afk"))
        cmd (`scoreboard players reset ${playerData.name} testafk`)
        cmd (`scoreboard players reset ${playerData.name} afktime`)
        playerData.removeTag("afk")
        return;
        // cmd (`tp "${playerData.name}" 0 -60 0`)
    }
    }
}
}
