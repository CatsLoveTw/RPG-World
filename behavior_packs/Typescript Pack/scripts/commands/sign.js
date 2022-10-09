import { world } from "mojang-minecraft";
import * as mc from "mojang-minecraft"
import * as ui from "mojang-minecraft-ui";
import { cmd, GetWorldPlayersName, log, logfor } from '../lib/GametestFunctions.js'
import { getScore, isNum, randomInt, worldlog } from '../lib/function.js'

export const sign = (playerClass) => {
    /**
    * @type {mc.Player} 
    */
    const player = playerClass 
    let date = new Date()
    let today = date.getDate()
    if (player.hasTag("sign-UI")) {
        player.removeTag("sign-UI")
        let daySignMsg = `§e§l每日登入獎勵\n§a可領取!`
        let newSignMsg = `§b§l新手登入獎勵\n§a可領取!`
        if (worldlog.getScoreFromMinecraft(player.name, "sign").score == today) {
            daySignMsg = `§e§l每日登入獎勵\n§c今天已領過! 需再等 §f${24 - (date.getHours() + 8)} §c小時!`
        }
        if (player.hasTag("newplayeraward")) {
            newSignMsg = `§e§l新手登入獎勵\n§c已領過!`
        }
        const buttons = [daySignMsg, newSignMsg, '§e§l全部獎勵查看']
        const list = {
            "§e§l每日登入獎勵": {msg: "§6§l每日登入", award: "§e§l抽獎卷軸x1"},
            "§b§l新手登入獎勵": {msg: "§6§l登入該伺服器", award: "§e§l金錢100000$ §f& §d界浮盒x1 §f& §b鑽石x5"},
            "§a§l更新中......": {msg:"§6§l更新中......", award: '§e§l更新中......'}
        }

        let fm = new ui.ActionFormData()
        fm.title('§e§l獎勵列表')
        for (let i = 0; i < buttons.length; i++) {
            fm.button(buttons[i])
        }
        fm.show(player).then(res => {
            if (res.selection === 0) {
                if (worldlog.getScoreFromMinecraft(player.name, "sign").score == today) {
                    logfor(player.name, `§3§l>> §c今天已領過! 需再等 §f${24 - (date.getHours() + 8)} §c小時!`)
                } else {
                    player.runCommand(`scoreboard players set @s sign ${today}`)
                    player.runCommand('structure load day ~~1~')
                    logfor(player.name, `§3§l>> §a領取成功!`)
                }
            } 
            if (res.selection === 1) {
                if (!player.hasTag("newplayeraward")) {
                    player.addTag("newplayeraward")
                    player.runCommand("scoreboard players add @s money 100000")
                    player.runCommand("give @s undyed_shulker_box")
                    player.runCommand("give @s diamond 5")
                    logfor(player.name, '§3v§l>> §a新手獎勵領取成功!')
                }
            }
            if (res.selection === buttons.length - 1) {
                let msg = []
                for (let i in list) {
                    msg.push(`§e§l名稱§f - ${i}\n§b條件§f - ${list[i].msg}\n§a獎勵§f - ${list[i].award}\n§f§l---------------------------------`)
                }
                logfor(player.name, '§f§l---------------------------------\n' + msg.join("\n"))
            }
        })
    }  
}