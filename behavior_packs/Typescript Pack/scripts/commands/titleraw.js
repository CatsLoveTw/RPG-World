import { EntityInventoryComponent, world } from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import {cmd, log, logfor, titlelog, titlefor} from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt, worldlog } from '../lib/function.js'
import { changeMaxLevel, cheakPlayerXPMax } from "./level.js";
import { getMagicDamage, getSkill } from "./pveData.js";
// | 或 §
const deletes = {
    tag: [],
    player: [],
    tick: [],
    setTick: [],
} 
export const build = () => {
    world.events.tick.subscribe(() => {
        for (let i in deletes.tag) {
            deletes.tick[i]++
            if (deletes.tick[i] - 1 == deletes.setTick[i]) {
                deletes.player[i].removeTag(deletes.tag[i])
                deletes.tag.splice(i, 1)
                deletes.player.splice(i, 1)
                deletes.tick.splice(i, 1)
                deletes.setTick.splice(i, 1)
            }
        }
    })
}
export function titleraw (player, eventData) {
    /**
     * @type {string}
     */
    let getnews = []
    let getadminnews = []
    for (let tag of player.getTags()) {
        if (tag.startsWith("news:")) {
            if (tag.includes("技能冷卻剩餘")) {
                getnews.push(tag.replace("news:", ""))
                deletes.player.push(player)
                deletes.tag.push(tag)
                deletes.tick.push(0)
                deletes.setTick.push(1)
            } else {
                getnews.push(tag.replace("news:", ""))
                deletes.player.push(player)
                deletes.tag.push(tag)
                deletes.tick.push(0)
                deletes.setTick.push(25)
            }
            //return tag
        } else if (tag.startsWith("newsadmin:")) {
            getadminnews.push(tag.replace("newsadmin:", ""))
        }
    }
    let news
    let adminnews
    if (getnews.length == 0) {
        news = "§c§l沒有消息"
    } else {
        if (getnews.length > 1) {
            let test = []
            for (let w of getnews) {
                let s = false
                for (let a of test) {
                    if (a.includes(w.split(" ")[0])) {
                        s = true
                    }
                }
                if (!s) {
                    test.push(w)
                }
                
            }
            
        } 
        news = `${getnews}`.replace(/,/g, "\n")
    }

    if (getadminnews.length == 0) {
        adminnews = "§c§l沒有消息"
    } else {
    adminnews = `${getadminnews}`.replace(/,/g, "\n")
    }
    // let hr = getScore(player.name, 'timeh')
    // let min = getScore(player.name, 'timem')
    // let sec = getScore(player.name, 'time')

    // if (hr < 10) {
    //     hr = '0' + hr
    // }
    // if (min < 10) {
    //     min = '0' + min
    // }
    // if (sec < 10) {
    //     sec = '0' + sec
    // }
    // let times = `§b§l${hr}§f:§b${min}§f:§b${sec}`
    let damage = 1
    let magicDamage = 0
    /**
     * @type {EntityInventoryComponent}
     */
    let item = player.getComponent("inventory").container.getItem(player.selectedSlot)
    try {
        if (item.getLore()[0].includes("- §e")) {
            damage = Number(item.getLore()[0].split("- §e")[1])
        }
        let text = item.getLore()[1].split(" §c")[0].split(" ")[2]
        switch (text.slice(text.indexOf('§')+2)) {
            case "小火球":
                magicDamage = getMagicDamage(player)
                break;
        }
    } catch {}
    let mh = "§c無"
    try {
        
        if (player.runCommand("testfor @e[type=!player, type=!item, r=20, c=1]").statusMessage) {
            mh = `§a${player.runCommand(`testfor @e[type=!player, type=!item, r=20, c=1]`).statusMessage.split("§f-")[1].split(" ")[1]} §c❤`
            // mh = `${player.runCommand("testfor @e[type=!player, type=!item, r=5, c=1]").statusMessage}`
        }
    } catch {}
    let levelMax = ""
    let playerLevel = worldlog.getPlayerLevel(player)
    if (playerLevel.level == playerLevel.maxlevel && playerLevel.xp == playerLevel.needxp) {
        levelMax = " §f- §cMAX"
    }
    titlefor (player.name, `§a§l消息 §f- \n§6§l${news}\n§a等級§f - §a${playerLevel.level} §f(§6${playerLevel.xp}§f/§6${playerLevel.needxp}§f)${levelMax}\n§e§l血量§f - §e${worldlog.getEntityScore(player, 'health')} §c❤  §e最近敵人血量 §f- §6${mh}\n§6近距離攻擊 §f- §6${damage} §c❤  §d魔法攻擊 §f- §d${magicDamage} §c❤`)
    
    

    
    
    // titlefor (player.name, `§l§b管理員廣播:\n${adminnews}\n§a§l消息通知:\n${news}\n\n§e金錢§f: §b${getScore(player.name, 'money')} §e$§f/§6夜錠§f: §b${getScore(player.name, 'spmoney')} §6$\n§a§l等級§f: §amax`)    
    // titlefor (player.name, `§l§b管理員廣播:\n${adminnews}\n§a§l消息通知:\n${news}\n\n§e金錢§f: §b${getScore(player.name, 'money')} §e$§f/§6夜錠§f: §b${getScore(player.name, 'spmoney')} §6$\n§a§l等級§f: §b${l.level} §f(§6${l.xp}§f/§6${l.needxp}§f)`)
}