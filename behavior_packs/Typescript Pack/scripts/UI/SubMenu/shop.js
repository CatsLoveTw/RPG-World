import { Player, world } from "@minecraft/server";
import { EffectType } from "@minecraft/server" // mc-script
// import { Entityhit } from "@minecraft/server"
import * as ui from "@minecraft/server-ui";
import {cmd, log, logfor} from '../../lib/GametestFunctions.js';
import { isNum, randomInt, worldlog, worldDB, getScore } from '../../lib/function.js'
import { jointext } from '../../commands/jointext.js'
import { sendchat, chatCommands } from '../../commands/Chat.js'
import { titleraw } from '../../commands/titleraw.js'
import { cheakafk, updateafk } from '../../commands/cheakafk.js'
import { leaderboard } from '../../commands/leaderboard.js'
import { cheakPlayerXPMax, updatelevel } from '../../commands/level.js'

// | 或 §
class SetButton {
    /**
     * 
     * @param {Player} playerClass 
     * @param {string} ShopName 
     * @param {number} Price 
     * @param  {...string} Commands 
     */
    constructor(playerClass, ShopName, Price, ...Commands) {
        /**
         * @type {Player}
         */
        this.PlayerClass = playerClass
        /**
         * @type {string}
         */
        this.ShopName = ShopName
        /**
         * @type {number}
         */ 
        this.Price = Price
        /**
         * @type {string[]}
         */ 
        this.Commands = Commands
    }
}




const shopSeting = {
    Button : () => {return new SetButton()}
}
shopSeting.Button()
function buy (player, playerprice, price, command) {
    if (playerprice >= price) {
        cmd(`scoreboard players remove "${player.name}" money ${price}`)
        for (let cm of command) {
            try {
                cmd(`${cm}`)
            } catch {}
        }
        logfor (player.name, `§3§l>> §a購買成功! §f(§6${playerprice} §f=> §6${playerprice - price}§f)`)
    } else {
        logfor (player.name, `§3§l>> §c金額不足! §f(§6還差 §b${price - playerprice} §f$§f)`)
    }
}

function nightbuy (player, playerprice, price, command) {
    if (playerprice >= price) {
        cmd(`scoreboard players remove "${player.name}" spmoney ${price}`)
        for (let cm of command) {
            try {
                cmd(`${cm}`)
            } catch {}
        }
        logfor (player.name, `§3§l>> §a購買成功! §f(§6${playerprice} §f=> §6${playerprice - price}§f)`)
        return true
    } else {
        logfor (player.name, `§3§l>> §c金額不足! §f(§6還差 §b${price - playerprice} §f$§f)`)
        return false
    }
}

function vipbuy (player, playerprice, price, command) {
    if (playerprice >= price) {
        cmd(`scoreboard players remove "${player.name}" spmoney ${price}`)
        for (let cm of command) {
            try {
                cmd(`${cm}`)
            } catch {}
        }
        logfor (player.name, `§3§l>> §a購買成功! §f(§6${playerprice} §f=> §6${playerprice - price}§f $/§bVIP §6${Number(getScore(player.name, "vip")) - 1} §f=> §6${getScore(player.name, "vip")}§f)`)
        
        const nowVIP = Number(getScore(player.name, "vip"))
        const VIPawardTags = ['§b§l遊俠', '§5§l領主', '§3§l新星']
        log(`§3§l>> §e恭喜 §f${player.name} §e的VIP升級至 §6${nowVIP}!`)
        for (let i=0; i < VIPawardTags.length; i++)
        if (nowVIP == i+1) {
        logfor(player.name, `§3§l>> §a您已解鎖新稱號 §f[${VIPawardTags[i]}§f]!`)
        cmd(`tag "${player.name}" add chatTag:${VIPawardTags[i]}`)
        }
    } else {
        logfor (player.name, `§3§l>> §c金額不足! §f(§6還差 §b${price - playerprice} §f$§f)`)
    }
}

export function shop (player) {
    const playerSP = Number(getScore(player.name, "spmoney"))
    let playerprice = Number(getScore(player.name, "money"))
        // log(`test`)
        let fm = new ui.ActionFormData();
        let shopprice = [56/2, 120/2, 64/2, 64/2, 64/2, 160/2, 120/2, 80/2, 80/2]
        let shopdata = {'界浮盒':56/2, '命名牌':120/2 , '豬':64/2, '牛':64/2, '羊':64/2, '村民':160/2, '凋零骷髏':120/2, '殭屍':80/2, '骷髏':80/2}
        fm.title('§e§l鐵匠商店')
        for (let shopname in shopdata) {
            fm.button(`§b§l${shopname}\n§6§l${shopdata[shopname]} 元`)
        }

        fm.show(player).then(res => {
            if (!res || res.isCanceled) {return;}
            if (res.selection === 0) {
                buy(player, playerprice, shopprice[res.selection], [`give "${player.name}" undyed_shulker_box`])
            } else if (res.selection === 1) {
                buy(player, playerprice, shopprice[res.selection], [`give "${player.name}" name_tag`])
            } else if (res.selection === 2) {
                buy(player, playerprice, shopprice[res.selection], [`give "${player.name}" pig_spawn_egg`])
            } else if (res.selection === 3) {
                buy(player, playerprice, shopprice[res.selection], [`give "${player.name}" cow_spawn_egg`])
            } else if (res.selection === 4) {
                buy(player, playerprice, shopprice[res.selection], [`give "${player.name}" sheep_spawn_egg`])
            } else if (res.selection === 5) {
                buy(player, playerprice, shopprice[res.selection], [`give "${player.name}" villager_spawn_egg`])
            } else if (res.selection === 6) {
                buy(player, playerprice, shopprice[res.selection], [`give "${player.name}" wither_skeleton_spawn_egg`])
            } else if (res.selection === 7) {
                buy(player, playerprice, shopprice[res.selection], [`give "${player.name}" zombie_spawn_egg`])
            } else if (res.selection === 8) {
                buy(player, playerprice, shopprice[res.selection], [`give "${player.name}" skeleton_spawn_egg`])
            }
        })
}