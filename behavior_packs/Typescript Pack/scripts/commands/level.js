import { Player, world } from "mojang-minecraft";
import * as ui from "mojang-minecraft-ui";
import {cmd, GetWorldPlayersName, log, logfor} from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt, worldlog } from '../lib/function.js'
import { tpa } from './tpa.js'
import { addboard } from "../Main.js";


// | 或 §
export function build () {
    let allScore = ["level", "xp", "nxp", "maxlevel"]
    for (let scores of allScore) {
        try {
            addboard(scores, "")
        } catch {}
    }
    world.events.tick.subscribe(() => {
        for (let player of world.getPlayers()) {
            updatelevel(player)
        }
    })
}

export function getlevel (player) {
    cmd("scoreboard players add a maxlevel 0")
    player.runCommand("scoreboard players add @s level 0")
    player.runCommand("scoreboard players add @s xp 0")
    player.runCommand("scoreboard players add @s nxp 0")
    const level = Number(getScore(player.name, "level"))
    const xp = Number(getScore(player.name, "xp"))
    const needxp = Number(getScore(player.name, "nxp"))
    const maxlevel = Number(getScore('a', 'maxlevel'))
    return {"name": player.name, "xp": xp, "level": level, "needxp": needxp, 'maxlevel': maxlevel} 
}


export function updatelevel (player) {
    const playerlevel = worldlog.getPlayerLevel(player)
    const level = playerlevel.level
    const xp = playerlevel.xp
    let needxp = playerlevel.needxp
    const maxlevel = playerlevel.maxlevel

    
    let allneedxp = [] // 0-max等所需經驗 (使用前不用將數字-1, 因等級從0開始!) ex:400級所需經驗 = allneedxp[400]
    let th = 4
    for (let i = 0; i <= maxlevel; i++) {
        allneedxp.push(th)
        th = Math.trunc(th * 2.5)
    }
    if (maxlevel == 0 || !maxlevel || maxlevel == '') {
    if (level == 0) {
        cmd (`scoreboard players set "${player.name}" nxp 4`)
        needxp = 4
    } 
    if (xp >= needxp) {
        cmd (`scoreboard players set "${player.name}" level ${level + 1}`)
        cmd (`scoreboard players set "${player.name}" nxp ${Math.trunc(needxp * 2.5)}`)
        cmd (`scoreboard players set "${player.name}" xp 0`)
        cmd (`title "${player.name}" title §b§l您升級了! §f(§6${level} §f=> §6${level + 1}§f)`)
        cmd (`title "${player.name}" subtitle §a§l詳細福利請去伺服器查詢!`)
    }
    } else {
            if (level == 0) {
                cmd (`scoreboard players set "${player.name}" nxp 4`)
                needxp = 4
            } 
            if (xp >= needxp && level < maxlevel) {
                cmd (`scoreboard players set "${player.name}" level ${level + 1}`)
                cmd (`scoreboard players set "${player.name}" nxp ${Math.trunc(needxp * 2.5)}`)
                cmd (`scoreboard players set "${player.name}" xp ${xp - needxp}`)
                cmd (`title "${player.name}" title §b§l您升級了! §f(§6${level} §f=> §6${level + 1}§f)`)
                cmd (`title "${player.name}" subtitle §a§l詳細福利請去伺服器查詢!`)
            } else if (xp >= needxp && level >= maxlevel) {
                cmd (`scoreboard players set "${player.name}" xp ${needxp}`)
            }
            if (level > maxlevel) {
                cmd (`scoreboard players set "${player.name}" level ${maxlevel}`)
                cmd (`scoreboard players set "${player.name}" nxp ${allneedxp[maxlevel]}`)
                cmd (`scoreboard players set "${player.name}" xp ${allneedxp[maxlevel] - 1}`)
                cmd (`title "${player.name}" title §c§l等級降低!`)
                cmd (`title "${player.name}" subtitle §3系統偵測到您的等級高於最高等級,因此被降低了!`)
            }
    }
}


export function changeMaxLevel (maxlevel) {
    cmd (`scoreboard players set a maxlevel ${maxlevel}`)
}


export function cheakPlayerXPMax (player) {
    let l = worldlog.getPlayerLevel(player)
    let allneedxp = [] // 0-max等所需經驗 (使用前不用將數字-1, 因等級從0開始!) ex:400級所需經驗 = allneedxp[400]
    let th = 4
for (let i=0; i <= l.maxlevel; i++) {
    allneedxp.push(th)
    th = Math.trunc(th * 2.5)
}
    if (l.xp == allneedxp[l.maxlevel] - 1 || l.xp >= allneedxp[l.maxlevel]) {
        if (l.level == maxlevel) {
        return true
        } else {
            return false
        }
    } else {
        return false
    }
}