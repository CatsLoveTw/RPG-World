import { world } from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import {cmd, log, logfor} from '../../lib/GametestFunctions.js'
import { getScore, isNum, randomInt } from '../../lib/function.js'
import { worldlog } from '../../lib/function.js'
import { leaderboard } from '../../commands/leaderboard.js'
import { updateMenu } from "../../commands/update.js";

export const server = (player) => {
    new ui.ActionFormData()
    .title("§e§l伺服器資訊")
    // .button("§e§l金錢排行")
    .button("§b§l伺服器公告")
    .button("§e§l更新資訊")
    
    .show(player).then(res => {
        // if (res.selection === 0) {
        //     const max = worldlog.getScoreboardPlayers("allmoney").disname.length
        //     let a = 10
        //     if (max < 10) {
        //         a = max
        //     }
        //     new ui.ModalFormData()
        //     .title("§e§l金錢排行")
        //     .slider("§e§l查看的玩家數量", 1, max, 1, a)
        //     .toggle("§c§l過濾管理員玩家")
            
        //     .show(player).then(res => {
        //         let ad = res.formValues[1]
        //         let sele = res.formValues[0]
        //         if (ad) {
        //             let getleaderboard = leaderboard("allmoney", sele, true, true)
        //             let names = getleaderboard.namerank
        //             let scores = getleaderboard.namescore
        //             let fm = new ui.ActionFormData();
        //             for (let i in names) {
        //                 fm.button(`§e§l第§b${Number(i) + 1}§e名§f: §a${names[i]}\n§g分數§f: §a${scores[i]}`)
        //             }
        //             fm.show(player)
        //         } else {
        //             let getleaderboard = leaderboard("allmoney", sele, false, true)
        //             let names = getleaderboard.namerank
        //             let scores = getleaderboard.namescore
        //             let admin = getleaderboard.adminplayer
        //             let fm = new ui.ActionFormData();
        //             for (let i in names) {
        //                 if (!admin.includes(names[i])) {
        //                     fm.button(`§e§l第§b${Number(i) + 1}§e名§f: §a${names[i]}\n§g金錢
        //                     §f: §a${scores[i]}`)
        //                 } else {
        //                     fm.button(`§7§l[§c管理員§7] §e§l第§b${Number(i) + 1}§e名§f: §a${names[i]}\n§g金錢§f: §a${scores[i]}`)
        //                 }
        //             }
        //             fm.show(player)
        //         }
        //     })
        if (res.selection === 0) {
            let servermsg
            let time
            let playerName
            let msg
            try {
                servermsg = worldlog.getScoreboardPlayers("servermsg").disname[0]
                time = servermsg.split(",,,")[0]
                playerName = servermsg.split(",,,")[1]
                msg = servermsg.split(",,,")[2]
            } catch {}
            let fm = new ui.ActionFormData()
            .title("§e§l伺服器公告")
            if (!servermsg) {
                fm.body ("§e§l伺服器公告:\n§f§l沒有公告")
            } else {
                msg = msg.replaceAll('\\n', "\n")
                fm.body (`§e§l伺服器公告:\n§f§l${msg}\n\n§e§l更改者: §f§l${playerName}\n§e§l更改時間: §f§l${time}`)
            }
            fm.button("§c§l退出")
            fm.show(player)
        } else if (res.selection === 1) {
            updateMenu(player)
        }
    })
}