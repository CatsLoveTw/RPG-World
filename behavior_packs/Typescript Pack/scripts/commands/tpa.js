import { world } from "mojang-minecraft";
import * as ui from "mojang-minecraft-ui";
import {cmd, GetWorldPlayersName, log, logfor} from '../lib/GametestFunctions.js'
import { isNum, randomInt } from '../lib/function.js'

// | 或 §

export function tpa(player, eventData, tpplayer, playertotpplayer) {
    


    if (playertotpplayer) {
        let fm = new ui.MessageFormData();
    fm.title (`請求傳送`)
    fm.body (`§e§l${tpplayer.name}§a§l想傳送你到他的位置!`)
    fm.button1 ('§a§l允許')
    fm.button2 ('§c§l拒絕')

    fm.show(player).then((result) => {
        if (result.selection === 1) {
            cmd (`tp "${player.name}" "${tpplayer.name}"`)
            logfor (tpplayer.name, '§a§l請求成功!')
        } else if (result.selection === 0 || result.isCanceled) {
            logfor (tpplayer.name, '§c§l請求失敗!')
        }
    })
    } else {
        let fm = new ui.MessageFormData();
        fm.title ('傳送請求')
        fm.body (`§e§l${tpplayer.name}§a§l想傳送你到你的位置!`)
        fm.button1 ('§a§l允許')
        fm.button2 ('§c§l拒絕')
        fm.show(player).then((result) => {
            if (result.selection === 1) {
                cmd (`tp "${tpplayer.name}" "${player.name}"`)
                logfor (tpplayer.name, '§a§l請求成功!')
            } else if (result.selection === 0 || result.isCanceled) {
                logfor (tpplayer.name, '§c§l請求失敗!')
            }
        })
    }
}